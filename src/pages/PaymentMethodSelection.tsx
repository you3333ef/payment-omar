import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, FileText, DollarSign, Lock as LockIcon, Shield, Building2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// UAE Government Official Color Scheme
const uaeColors = {
  primary: "#CE1126", // UAE Red (Official)
  secondary: "#00732F", // UAE Green (Official)
  accent: "#000000", // Black (Official)
  background: "#FFFFFF", // White (Official)
  lightGray: "#F5F5F5", // Light Gray
  border: "#E0E0E0", // Border
  gold: "#b68a35", // MOF Gold (Official)
  goldHover: "#8f6c29", // MOF Gold Hover
};

const PaymentMethodSelection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!invoiceNumber || !paymentAmount) {
      toast({
        title: "بيانات ناقصة",
        description: "الرجاء إدخال رقم الفاتورة ومبلغ السداد",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Store payment data in sessionStorage for next steps
      sessionStorage.setItem('paymentInvoiceNumber', invoiceNumber);
      sessionStorage.setItem('paymentAmount', paymentAmount);

      toast({
        title: "تم الحفظ بنجاح",
        description: "سيتم توجيهك الآن لاختيار البنك",
      });

      // Navigate to bank selector with UAE flag
      navigate('/pay/uae/bank-selector');
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ البيانات",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: uaeColors.background }} dir="rtl">
      {/* Official UAE Government Header */}
      <div
        className="w-full border-b-4"
        style={{
          backgroundColor: uaeColors.background,
          borderBottomColor: uaeColors.primary
        }}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* UAE Official Government Logo */}
              <div className="w-20 h-20 flex items-center justify-center">
                <svg width="80" height="80" viewBox="0 0 100 100" className="fill-current" style={{ color: uaeColors.primary }}>
                  <circle cx="50" cy="50" r="45" fill="white" stroke={uaeColors.primary} strokeWidth="3" />
                  <text x="50" y="45" textAnchor="middle" fontSize="18" fontWeight="bold" fill={uaeColors.primary} fontFamily="Noto Kufi Arabic">الإمارات</text>
                  <text x="50" y="60" textAnchor="middle" fontSize="14" fontWeight="bold" fill={uaeColors.secondary} fontFamily="Noto Kufi Arabic">UAE</text>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: uaeColors.accent, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
                  البوابة الإلكترونية الموحدة للسداد
                </h1>
                <p className="text-sm" style={{ color: uaeColors.gold, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
                  وزارة المالية - حكومة دولة الإمارات العربية المتحدة
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-white border-2" style={{ borderColor: uaeColors.gold, color: uaeColors.gold }}>
                <LockIcon className="w-4 h-4 ml-1" />
                <span style={{ fontFamily: 'Noto Kufi Arabic, sans-serif' }}>اتصال آمن ومشفر</span>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="w-full" style={{ backgroundColor: uaeColors.lightGray }}>
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm font-semibold hover:underline" style={{ color: uaeColors.accent, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
              الرئيسية
            </a>
            <a href="#" className="text-sm" style={{ color: uaeColors.gold, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
              الخدمات الإلكترونية
            </a>
            <a href="#" className="text-sm" style={{ color: uaeColors.accent, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
              حول دولة الإمارات
            </a>
            <a href="#" className="text-sm" style={{ color: uaeColors.accent, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
              سياسة الخصوصية
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Official Header Banner */}
          <div className="mb-6 p-6 rounded-lg" style={{ backgroundColor: uaeColors.lightGray }}>
            <div className="flex items-center gap-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: uaeColors.primary }}
              >
                <svg width="60" height="60" viewBox="0 0 100 100" className="text-white">
                  <text x="50" y="40" textAnchor="middle" fontSize="24" fontWeight="bold" fill="white" fontFamily="Noto Kufi Arabic">ع</text>
                  <text x="50" y="65" textAnchor="middle" fontSize="18" fill="white" fontFamily="Noto Kufi Arabic">دولة الإمارات</text>
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2" style={{ color: uaeColors.primary, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
                  الخدمات الحكومية الإلكترونية
                </h2>
                <p className="text-lg" style={{ color: uaeColors.secondary, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
                  منصة الإمارات الموحدة للمدفوعات الرقمية
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-xl border-2 overflow-hidden" style={{ borderColor: uaeColors.gold }}>
            {/* Official Government Header */}
            <div
              className="p-8 border-b-2 text-center"
              style={{
                background: `linear-gradient(135deg, ${uaeColors.primary}, ${uaeColors.secondary})`
              }}
            >
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <Shield className="w-10 h-10" style={{ color: uaeColors.primary }} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
                إتمام عملية السداد
              </h3>
              <p className="text-white opacity-90" style={{ fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
                الرجاء إدخال بيانات الفاتورة لإتمام عملية السداد بأمان
              </p>
            </div>

            {/* Payment Type Selection */}
            <div className="p-6 border-b" style={{ backgroundColor: `${uaeColors.lightGray}50` }}>
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <input type="radio" id="government" name="paymentType" defaultChecked className="w-5 h-5" />
                  <label htmlFor="government" className="text-lg font-semibold" style={{ color: uaeColors.accent, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
                    مدفوعات حكومية
                  </label>
                </div>
                <div className="w-px h-6" style={{ backgroundColor: uaeColors.border }}></div>
                <div className="flex items-center gap-2">
                  <input type="radio" id="public" name="paymentType" disabled className="w-5 h-5" />
                  <label htmlFor="public" className="text-lg font-semibold" style={{ color: '#999', fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
                    خدمات عامة (قريباً)
                  </label>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Invoice Number */}
              <div className="space-y-3">
                <Label
                  className="text-lg font-semibold block"
                  style={{ color: uaeColors.accent, fontFamily: 'Noto Kufi Arabic, sans-serif' }}
                >
                  <FileText className="w-5 h-5 inline ml-2" />
                  رقم الفاتورة أو المرجع *
                </Label>
                <Input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="أدخل رقم الفاتورة أو المرجع الخاص بك"
                  className="h-14 text-lg border-2 rounded-lg px-4 transition-all"
                  style={{
                    borderColor: uaeColors.border,
                    fontFamily: 'Noto Kufi Arabic, sans-serif'
                  }}
                  required
                />
              </div>

              {/* Payment Amount */}
              <div className="space-y-3">
                <Label
                  className="text-lg font-semibold block"
                  style={{ color: uaeColors.accent, fontFamily: 'Noto Kufi Arabic, sans-serif' }}
                >
                  <DollarSign className="w-5 h-5 inline ml-2" />
                  قيمة رسوم السداد (درهم إماراتي) *
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="0.00"
                    className="h-14 text-lg border-2 rounded-lg pl-16 pr-4 transition-all"
                    style={{
                      borderColor: uaeColors.border,
                      fontFamily: 'Noto Kufi Arabic, sans-serif'
                    }}
                    step="0.01"
                    min="0"
                    required
                  />
                  <span
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold"
                    style={{ color: uaeColors.gold, fontFamily: 'Noto Kufi Arabic, sans-serif' }}
                  >
                    AED
                  </span>
                </div>
              </div>

              {/* Security Notice */}
              <div
                className="rounded-lg p-6 border-2"
                style={{ backgroundColor: `${uaeColors.secondary}08`, borderColor: uaeColors.secondary }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: uaeColors.secondary }}
                  >
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold mb-2" style={{ color: uaeColors.accent, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
                      دفع آمن ومشفر 256-bit SSL
                    </h4>
                    <p className="text-sm mb-2" style={{ color: uaeColors.accent, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
                      جميع المعاملات محمية بأعلى معايير الأمان العالمية
                    </p>
                    <div className="flex items-center gap-4 text-xs" style={{ color: uaeColors.gold }}>
                      <span>✓ معتمد من المصرف المركزي الإمارات</span>
                      <span>✓ مشفر بتقنية TLS 1.3</span>
                      <span>✓ متوافق مع PCI DSS</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full h-16 text-xl font-bold text-white transition-all hover:shadow-lg"
                style={{
                  backgroundColor: uaeColors.gold,
                  fontFamily: 'Noto Kufi Arabic, sans-serif'
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white ml-2"></div>
                    <span>جاري الحفظ...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6 ml-2" />
                    <span>المتابعة والإكمال</span>
                    <ArrowLeft className="w-6 h-6 mr-2" />
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Official Government Footer */}
          <div className="mt-8 p-6 rounded-lg text-center" style={{ backgroundColor: uaeColors.lightGray }}>
            <div className="flex items-center justify-center gap-6 mb-4">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center" style={{ backgroundColor: uaeColors.primary }}>
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <p className="text-xs font-semibold" style={{ color: uaeColors.primary, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
                  المصرف المركزي الإمارات
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center" style={{ backgroundColor: uaeColors.gold }}>
                  <LockIcon className="w-8 h-8 text-white" />
                </div>
                <p className="text-xs font-semibold" style={{ color: uaeColors.gold, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
                  PCI DSS Certified
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center" style={{ backgroundColor: uaeColors.secondary }}>
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <p className="text-xs font-semibold" style={{ color: uaeColors.secondary, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
                  وزارة المالية
                </p>
              </div>
            </div>
            <p className="text-sm font-semibold" style={{ color: uaeColors.accent, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
              جميع الحقوق محفوظة © 2025 حكومة دولة الإمارات العربية المتحدة
            </p>
            <p className="text-xs mt-2" style={{ color: uaeColors.gold, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
              البوابة الإلكترونية الموحدة للخدمات الحكومية - وزارة المالية
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelection;
