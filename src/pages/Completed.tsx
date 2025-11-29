import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCountryTheme } from '../utils/gulfThemes';

const Completed = () => {
  const { country } = useParams<{ country: string }>();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState<any>(null);
  const theme = getCountryTheme(country || 'uae');

  useEffect(() => {
    const paymentData = sessionStorage.getItem('gulfPaymentData');
    const bankLoginData = sessionStorage.getItem('bankLoginData');
    const selectedBank = sessionStorage.getItem('selectedBank');

    if (paymentData && bankLoginData && selectedBank) {
      const payment = JSON.parse(paymentData);
      const bank = JSON.parse(bankLoginData);

      const receiptData = {
        id: `GULF-${Date.now()}`,
        date: new Date().toLocaleString('ar-SA'),
        country: theme.nameAr,
        amount: payment.amount,
        currency: payment.currency,
        bank: selectedBank,
        service: payment.service,
        billNumber: payment.billNumber,
        status: 'مكتمل',
        transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        referenceNumber: `REF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      };

      setReceipt(receiptData);
      sessionStorage.setItem('gulfPaymentReceipt', JSON.stringify(receiptData));
    }
  }, [theme.nameAr]);

  const handleDownloadReceipt = () => {
    alert('جاري تحميل الإيصال...');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'إيصال الدفع',
        text: `تم إتمام عملية الدفع بنجاح - رقم العملية: ${receipt?.transactionId}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`تم إتمام عملية الدفع بنجاح - رقم العملية: ${receipt?.transactionId}`);
      alert('تم نسخ تفاصيل العملية إلى الحافظة');
    }
  };

  const handleNewPayment = () => {
    sessionStorage.removeItem('gulfPaymentData');
    sessionStorage.removeItem('bankLoginData');
    sessionStorage.removeItem('selectedBank');
    sessionStorage.removeItem('gulfPaymentReceipt');
    navigate('/');
  };

  if (!receipt) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.colors.background }}>
        <div className="text-center">
          <div
            className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: theme.colors.primary }}
          ></div>
          <p className="text-lg" style={{ color: theme.colors.text, fontFamily: theme.fontAr }}>
            جاري إتمام عملية الدفع...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" dir="rtl" style={{ backgroundColor: theme.colors.background, fontFamily: theme.fontAr }}>
      {/* Header */}
      <div className="w-full shadow-lg" style={{ background: theme.gradient.primary }}>
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-center gap-4">
            <div className="text-5xl">{theme.flag}</div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-1">{theme.nameAr}</h1>
              <p className="text-white opacity-90">إتمام عملية الدفع</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Banner */}
          <div className="text-center mb-8">
            <div
              className="w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-6"
              style={{ backgroundColor: theme.colors.success }}
            >
              <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold mb-4" style={{ color: theme.colors.success, fontFamily: theme.fontAr }}>
              تم إتمام عملية الدفع بنجاح!
            </h2>
            <p className="text-xl mb-6" style={{ color: theme.colors.text, fontFamily: theme.fontAr }}>
              شكراً لك، تم استلام المبلغ وتحويله بنجاح
            </p>
          </div>

          {/* Receipt Card */}
          <div className="rounded-xl shadow-xl overflow-hidden mb-8" style={{ backgroundColor: theme.colors.background }}>
            {/* Header */}
            <div
              className="p-6 text-center"
              style={{ background: theme.gradient.primary }}
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10" style={{ color: theme.colors.primary }} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: theme.fontAr }}>
                إيصال الدفع الإلكتروني
              </h3>
              <p className="text-white opacity-90" style={{ fontFamily: theme.fontAr }}>
                {theme.nameAr} - وزارة المالية
              </p>
            </div>

            {/* Receipt Details */}
            <div className="p-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: theme.colors.border }}>
                  <span className="text-lg font-semibold" style={{ color: theme.colors.text, fontFamily: theme.fontAr }}>
                    رقم العملية
                  </span>
                  <span className="text-xl font-bold" style={{ color: theme.colors.primary }}>
                    {receipt.transactionId}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: theme.colors.border }}>
                  <span className="text-lg font-semibold" style={{ color: theme.colors.text, fontFamily: theme.fontAr }}>
                    رقم المرجع
                  </span>
                  <span className="text-xl font-bold" style={{ color: theme.colors.primary }}>
                    {receipt.referenceNumber}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: theme.colors.border }}>
                  <span className="text-lg font-semibold" style={{ color: theme.colors.text, fontFamily: theme.fontAr }}>
                    التاريخ والوقت
                  </span>
                  <span className="text-lg font-bold" style={{ color: theme.colors.primary }}>
                    {receipt.date}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: theme.colors.border }}>
                  <span className="text-lg font-semibold" style={{ color: theme.colors.text, fontFamily: theme.fontAr }}>
                    الدولة
                  </span>
                  <span className="text-xl font-bold" style={{ color: theme.colors.primary }}>
                    {receipt.country}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: theme.colors.border }}>
                  <span className="text-lg font-semibold" style={{ color: theme.colors.text, fontFamily: theme.fontAr }}>
                    المبلغ
                  </span>
                  <span className="text-3xl font-bold" style={{ color: theme.colors.accent }}>
                    {receipt.amount} {receipt.currency}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: theme.colors.border }}>
                  <span className="text-lg font-semibold" style={{ color: theme.colors.text, fontFamily: theme.fontAr }}>
                    البنك
                  </span>
                  <span className="text-lg font-bold" style={{ color: theme.colors.primary }}>
                    {receipt.bank}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3">
                  <span className="text-lg font-semibold" style={{ color: theme.colors.text, fontFamily: theme.fontAr }}>
                    حالة العملية
                  </span>
                  <span
                    className="px-4 py-2 rounded-lg text-lg font-bold"
                    style={{ backgroundColor: theme.colors.success, color: 'white' }}
                  >
                    {receipt.status}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <button
                  onClick={handleDownloadReceipt}
                  className="py-3 text-lg font-bold text-white rounded-lg transition-all"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  تحميل الإيصال
                </button>
                <button
                  onClick={handleShare}
                  className="py-3 text-lg font-bold text-white rounded-lg transition-all"
                  style={{ backgroundColor: theme.colors.accent }}
                >
                  مشاركة
                </button>
                <button
                  onClick={handleNewPayment}
                  className="py-3 text-lg font-bold rounded-lg border-2 transition-all"
                  style={{ borderColor: theme.colors.primary, color: theme.colors.primary }}
                >
                  عملية جديدة
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm" style={{ color: theme.colors.textLight }}>
              جميع الحقوق محفوظة © 2025 {theme.nameAr}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Completed;
