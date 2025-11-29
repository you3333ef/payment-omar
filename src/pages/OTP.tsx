import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCountryTheme } from '../utils/gulfThemes';

const OTP = () => {
  const { country } = useParams<{ country: string }>();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(120);
  const [isLoading, setIsLoading] = useState(false);
  const theme = getCountryTheme(country || 'uae');

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      alert('الرجاء إدخال الرمز المكون من 6 أرقام');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      navigate(`/gulf/${country}/completed`);
    }, 1500);
  };

  const handleResend = () => {
    setCountdown(120);
    setOtp('');
    alert('تم إعادة إرسال الرمز');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen" dir="rtl" style={{ backgroundColor: theme.colors.background, fontFamily: theme.fontAr }}>
      {/* Header */}
      <div className="w-full shadow-lg" style={{ background: theme.gradient.primary }}>
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-center gap-4">
            <div className="text-5xl">{theme.flag}</div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-1">{theme.nameAr}</h1>
              <p className="text-white opacity-90">تحقق من هويتك</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* OTP Form Card */}
          <div className="rounded-xl shadow-xl p-8" style={{ backgroundColor: theme.colors.background }}>
            {/* Icon */}
            <div className="text-center mb-8">
              <div
                className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: theme.colors.primary }}
              >
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: theme.colors.text }}>
                تحقق من هويتك
              </h2>
              <p className="text-lg" style={{ color: theme.colors.textLight }}>
                تم إرسال رمز التحقق إلى هاتفك المحمول
              </p>
            </div>

            {/* Success Info */}
            <div className="p-4 rounded-lg mb-8" style={{ backgroundColor: theme.colors.surface }}>
              <div className="flex items-center gap-3">
                <svg className="w-8 h-8" style={{ color: theme.colors.success }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold" style={{ color: theme.colors.text }}>
                    تم إرسال رمز التحقق
                  </p>
                  <p className="text-sm" style={{ color: theme.colors.textLight }}>
                    يرجى إدخال الرمز المرسل للتحقق من هويتك
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleVerify}>
              {/* OTP Input */}
              <div className="mb-6">
                <label className="block text-lg font-semibold mb-4 text-center" style={{ color: theme.colors.text }}>
                  رمز التحقق (6 أرقام)
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="••••••"
                  maxLength={6}
                  className="w-full px-4 py-4 text-3xl font-bold text-center rounded-lg border-2 focus:outline-none tracking-widest"
                  style={{
                    borderColor: theme.colors.border,
                    fontFamily: theme.fontAr
                  }}
                />
              </div>

              {/* Timer */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2" style={{ color: countdown < 30 ? theme.colors.error : theme.colors.textLight }}>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xl font-bold">
                    ينتهي خلال: {formatTime(countdown)}
                  </span>
                </div>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={otp.length !== 6 || isLoading}
                className={`w-full py-4 text-xl font-bold text-white rounded-lg ${otp.length === 6 && !isLoading ? theme.buttonStyle.primary : 'opacity-50 cursor-not-allowed'}`}
              >
                {isLoading ? 'جارٍ التحقق...' : 'تأكيد وإتمام الدفع'}
              </button>

              {/* Resend Button */}
              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={countdown > 0}
                  className={`text-lg font-semibold hover:underline ${countdown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{ color: countdown > 0 ? theme.colors.textLight : theme.colors.primary }}
                >
                  لم يصلك الرمز؟ إعادة الإرسال
                </button>
              </div>
            </form>

            {/* Security Notice */}
            <div className="mt-8 p-4 rounded-lg" style={{ backgroundColor: theme.colors.surface }}>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 flex-shrink-0" style={{ color: theme.colors.warning }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-semibold" style={{ color: theme.colors.text }}>
                    لا تشارك هذا الرمز مع أحد
                  </p>
                  <p className="text-xs" style={{ color: theme.colors.textLight }}>
                    رمز التحقق صالح لمدة {formatTime(countdown)} فقط
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: theme.colors.textLight }}>
                    <span>✓ مشفر بتقنية TLS 1.3</span>
                    <span>✓ آمن ومحمي</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTP;
