import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCountryTheme } from '../utils/gulfThemes';

const PaymentPage = () => {
  const { country } = useParams<{ country: string }>();
  const navigate = useNavigate();
  const [billNumber, setBillNumber] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [amount, setAmount] = useState('');
  const theme = getCountryTheme(country || 'uae');

  const handleContinue = () => {
    if (!billNumber || !selectedService || !amount) {
      alert('Please fill in all fields');
      return;
    }

    // Store payment data
    sessionStorage.setItem('gulfPaymentData', JSON.stringify({
      billNumber,
      service: selectedService,
      amount,
      country,
      currency: country === 'saudi' ? 'SAR' : country === 'kuwait' ? 'KWD' : country === 'qatar' ? 'QAR' : country === 'bahrain' ? 'BHD' : country === 'oman' ? 'OMR' : 'AED'
    }));

    navigate(`/gulf/${country}/bank-select`);
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
              <p className="text-white opacity-90">نظام الدفع الإلكتروني الحكومي</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Payment Form Card */}
          <div className="rounded-xl shadow-xl p-8" style={{ backgroundColor: theme.colors.background }}>
            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2" style={{ color: theme.colors.text }}>
                {theme.nameAr} - {theme.styleReference}
              </h2>
              <p className="text-lg" style={{ color: theme.colors.textLight }}>
                خدمة الدفع الآمن والسريع
              </p>
            </div>

            {/* Bill Number */}
            <div className="mb-6">
              <label className="block text-lg font-semibold mb-3" style={{ color: theme.colors.text }}>
                رقم الفاتورة أو المرجع
              </label>
              <input
                type="text"
                value={billNumber}
                onChange={(e) => setBillNumber(e.target.value)}
                placeholder="أدخل رقم الفاتورة"
                className="w-full px-4 py-4 text-lg rounded-lg border-2 focus:outline-none transition-all"
                style={{
                  borderColor: theme.colors.border,
                  fontFamily: theme.fontAr
                }}
              />
            </div>

            {/* Service Selection */}
            <div className="mb-6">
              <label className="block text-lg font-semibold mb-3" style={{ color: theme.colors.text }}>
                نوع الخدمة الحكومية
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-4 py-4 text-lg rounded-lg border-2 focus:outline-none transition-all"
                style={{
                  borderColor: theme.colors.border,
                  fontFamily: theme.fontAr,
                  backgroundColor: theme.colors.background
                }}
              >
                <option value="">اختر الخدمة</option>
                {theme.governmentServices.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.nameAr}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div className="mb-8">
              <label className="block text-lg font-semibold mb-3" style={{ color: theme.colors.text }}>
                المبلغ المستحق
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-4 text-lg rounded-lg border-2 focus:outline-none transition-all"
                  style={{
                    borderColor: theme.colors.border,
                    fontFamily: theme.fontAr
                  }}
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 font-bold text-lg" style={{ color: theme.colors.textLight }}>
                  {country === 'saudi' ? 'ر.س' :
                   country === 'kuwait' ? 'د.ك' :
                   country === 'qatar' ? 'ر.ق' :
                   country === 'bahrain' ? 'د.ب' :
                   country === 'oman' ? 'ر.ع' : 'د.إ'}
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              className={`w-full py-4 text-xl font-bold text-white rounded-lg ${theme.buttonStyle.primary}`}
            >
              متابعة لاختيار البنك
            </button>

            {/* Security Notice */}
            <div className="mt-8 p-4 rounded-lg" style={{ backgroundColor: theme.colors.surface }}>
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" style={{ color: theme.colors.success }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm" style={{ color: theme.colors.text }}>
                  <strong>دفع آمن ومضمون:</strong> جميع المعاملات محمية بتشفير SSL 256-bit ومعتمدة من الحكومة
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm" style={{ color: theme.colors.textLight }}>
              جميع الحقوق محفوظة © 2025 {theme.nameAr}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
