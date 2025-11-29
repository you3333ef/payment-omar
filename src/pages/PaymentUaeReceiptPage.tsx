import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock as LockIcon, CheckCircle, Download, ArrowLeft, Building2 } from "lucide-react";

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

const PaymentUaeReceiptPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bankId = searchParams.get('bank') || '';
  const invoiceNumber = searchParams.get('invoice') || '';
  const paymentAmount = searchParams.get('amount') || '';

  const selectedBank = uaeBanks.find(bank => bank.id === bankId);
  const transactionId = `TXN-${Date.now()}`;

  const handleDownload = () => {
    const receiptContent = `
إيصال دفع - حكومة الإمارات العربية المتحدة
==============================================

رقم المعاملة: ${transactionId}
رقم الفاتورة: ${invoiceNumber}
التاريخ: ${new Date().toLocaleString('ar-AE')}
المبلغ: ${paymentAmount} درهم إماراتي

البنك: ${selectedBank?.name || ''}
حالة الدفع: مكتمل

البوابة الرسمية للسداد
وزارة التجارة والصناعة - دولة الإمارات العربية المتحدة
`;

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
          {/* Success Icon */}
          <div className="text-center mb-6">
            <div
              className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${uaeColors.secondary}, ${uaeColors.primary})`
              }}
            >
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-3" style={{ color: uaeColors.secondary, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
              تم الدفع بنجاح!
            </h1>
            <p className="text-lg" style={{ color: uaeColors.gold, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
              شكراً لاستخدامك الخدمات الحكومية الإلكترونية
            </p>
          </div>

          {/* Receipt */}
          <div className="bg-white rounded-lg shadow-xl border-2 overflow-hidden mb-6" style={{ borderColor: uaeColors.gold }}>
            {/* Receipt Header */}
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
              <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
                إيصال الدفع - حكومة الإمارات
              </h2>
              <p className="text-white opacity-90" style={{ fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
                البوابة الإلكترونية الموحدة للخدمات الحكومية
              </p>
            </div>

            {/* Receipt Details */}
            <div className="p-8 space-y-4">
              {/* Transaction ID */}
              <div className="flex items-center justify-between py-4 border-b" style={{ borderColor: uaeColors.border }}>
                <span className="text-base font-semibold" style={{ color: uaeColors.accent, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>رقم المعاملة</span>
                <span className="font-mono text-base font-bold" style={{ color: uaeColors.gold }}>
                  {transactionId}
                </span>
              </div>

              {/* Invoice Number */}
              <div className="flex items-center justify-between py-4 border-b" style={{ borderColor: uaeColors.border }}>
                <span className="text-base font-semibold" style={{ color: uaeColors.accent, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>رقم الفاتورة</span>
                <span className="font-mono text-base font-bold" style={{ color: uaeColors.gold }}>
                  {invoiceNumber}
                </span>
              </div>

              {/* Date */}
              <div className="flex items-center justify-between py-4 border-b" style={{ borderColor: uaeColors.border }}>
                <span className="text-base font-semibold" style={{ color: uaeColors.accent, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>التاريخ والوقت</span>
                <span className="text-base" style={{ color: uaeColors.accent, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>{new Date().toLocaleString('ar-AE')}</span>
              </div>

              {/* Bank */}
              <div className="flex items-center justify-between py-4 border-b" style={{ borderColor: uaeColors.border }}>
                <span className="text-base font-semibold" style={{ color: uaeColors.accent, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>البنك المستخدم</span>
                <span className="text-base font-semibold" style={{ color: uaeColors.secondary, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
                  {selectedBank?.name || ''}
                </span>
              </div>

              {/* Amount */}
              <div
                className="flex items-center justify-between py-6 border-t-2 mt-6"
                style={{ borderColor: uaeColors.gold }}
              >
                <span className="text-xl font-bold" style={{ color: uaeColors.accent, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>إجمالي المبلغ المدفوع</span>
                <span className="text-4xl font-bold" style={{ color: uaeColors.primary, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
                  {paymentAmount} درهم إماراتي
                </span>
              </div>
            </div>

            {/* Status */}
            <div
              className="p-6 border-t-2 flex items-center justify-center gap-3"
              style={{ backgroundColor: `${uaeColors.secondary}08`, borderColor: uaeColors.secondary }}
            >
              <CheckCircle className="w-8 h-8" style={{ color: uaeColors.secondary }} />
              <span className="text-xl font-bold" style={{ color: uaeColors.secondary, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
                تم الدفع بنجاح - مكتمل
              </span>
            </div>

            {/* Action Buttons */}
            <div className="p-8 space-y-4" style={{ backgroundColor: `${uaeColors.gold}08` }}>
              <Button
                onClick={handleDownload}
                variant="outline"
                className="w-full h-14 text-lg font-semibold border-2"
                style={{
                  borderColor: uaeColors.gold,
                  color: uaeColors.accent,
                  fontFamily: 'Noto Kufi Arabic, sans-serif'
                }}
              >
                <Download className="w-6 h-6 ml-2" />
                تحميل الإيصال
              </Button>

              <Button
                onClick={() => navigate('/pay/uae')}
                className="w-full h-14 text-xl font-bold text-white transition-all hover:shadow-lg"
                style={{
                  backgroundColor: uaeColors.gold,
                  fontFamily: 'Noto Kufi Arabic, sans-serif'
                }}
              >
                <span className="ml-2">دفع فاتورة جديدة</span>
                <ArrowLeft className="w-6 h-6" />
              </Button>
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

          <p className="text-sm text-center mb-6" style={{ color: uaeColors.accent, fontFamily: 'Noto Kufi Arabic, sans-serif' }}>
            سيتم إرسال إيصال الدفع إلى بريدك الإلكتروني المسجل لدى البنك
          </p>
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

export default PaymentUaeReceiptPage;
