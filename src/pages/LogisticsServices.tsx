import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Country, getCountryByCode } from "@/lib/countries";
import { ArrowRight, Truck, Package, MapPin, Clock, Shield, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCreateLink } from "@/hooks/useSupabase";

const LogisticsServices = () => {
  const { country } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const selectedCountry = getCountryByCode(country || "");
  const createLink = useCreateLink();

  const [bookingData, setBookingData] = useState({
    senderName: "",
    senderPhone: "",
    senderAddress: "",
    receiverName: "",
    receiverPhone: "",
    receiverAddress: "",
    packageType: "",
    packageWeight: "",
    packageDimensions: "",
    serviceType: "",
    insuranceValue: "",
    pickupDate: "",
    deliveryInstructions: "",
  });

  const packageTypes = [
    { value: "documents", label: "وثائق ومستندات", icon: "📄" },
    { value: "electronics", label: "أجهزة إلكترونية", icon: "💻" },
    { value: "clothing", label: "ملابس وأزياء", icon: "👕" },
    { value: "food", label: "مواد غذائية", icon: "🍎" },
    { value: "furniture", label: "أثاث منزلي", icon: "🪑" },
    { value: "medical", label: "أدوية ومستلزمات طبية", icon: "💊" },
    { value: "automotive", label: "قطع غيار سيارات", icon: "🚗" },
    { value: "industrial", label: "مواد صناعية", icon: "⚙️" },
    { value: "other", label: "أخرى", icon: "📦" },
  ];

  const serviceTypes = [
    {
      value: "express",
      label: "توصيل سريع (24-48 ساعة)",
      icon: "⚡",
      description: "خدمة سريعة للشحنات العاجلة",
    },
    {
      value: "standard",
      label: "توصيل قياسي (3-5 أيام)",
      icon: "📦",
      description: "خدمة متوازنة بالتكلفة والسرعة",
    },
    {
      value: "economy",
      label: "توصيل اقتصادي (5-7 أيام)",
      icon: "💰",
      description: "خدمة موفرة للشحنات غير العاجلة",
    },
    {
      value: "same_day",
      label: "توصيل نفس اليوم",
      icon: "🚀",
      description: "خدمة فورية للشحنات في نفس اليوم",
    },
  ];

  const logisticsProviders = [
    {
      name: "شركة الشحن المتقدمة",
      nameEn: "Advanced Logistics",
      services: ["توصيل داخلي", "توصيل دولي", "تعبئة وتغليف"],
      rating: 4.8,
      logo: "🚚",
      features: ["تتبع مباشر", "تأمين على البضائع"],
    },
    {
      name: "الشحن الذكي",
      nameEn: "Smart Shipping",
      services: ["شحن جوي", "شحن بحري", "شحن بري"],
      rating: 4.7,
      logo: "✈️",
      features: ["شبكة واسعة", "أسعار تنافسية"],
    },
    {
      name: "خدمات اللوجستية المتكاملة",
      nameEn: "Integrated Logistics Services",
      services: ["إدارة المخازن", "توزيع", "خدمات القيمة المضافة"],
      rating: 4.9,
      logo: "📊",
      features: ["حلول مخصصة", "دعم 24/7"],
    },
    {
      name: "جيناكم",
      nameEn: "Genacom Oman",
      services: ["شحن بري", "شحن بحري", "خدمات لوجستية"],
      rating: 4.8,
      logo: "🏢",
      features: ["تغطية واسعة", "خدمة عملاء ممتازة"],
    },
    {
      name: "مجموعة البركة",
      nameEn: "Al Baraka Group",
      services: ["خدمات مالية", "خدمات لوجستية", "شحن"],
      rating: 4.7,
      logo: "💰",
      features: ["حلول متكاملة", "أسعار منافسة"],
    },
    {
      name: "مجموعة الفطيم",
      nameEn: "Al Futtaim Logistics",
      services: ["حلول لوجستية", "توزيع", "إدارة سلسلة الإمداد"],
      rating: 4.9,
      logo: "📦",
      features: ["تقنيات متطورة", "شبكة واسعة"],
    },
    {
      name: "مجموعة الشايع",
      nameEn: "Alshaya Group",
      services: ["شحن وتوزيع", "خدمات تجارية", "حلول متكاملة"],
      rating: 4.6,
      logo: "🏪",
      features: ["خبرة عريقة", "تغطية إقليمية"],
    },
    {
      name: "الشركة الوطنية للشحن",
      nameEn: "Bahri",
      services: ["شحن بحري", "شحن بري", "خدمات لوجستية"],
      rating: 4.8,
      logo: "🚢",
      features: ["شحن بحري", "شبكة محلية"],
    },
    {
      name: "ShipCo Transport",
      nameEn: "ShipCo Transport",
      services: ["شحن دولي", "شحن بحري", "شحن جوي"],
      rating: 4.7,
      logo: "🌍",
      features: ["شبكة عالمية", "تتبع مباشر"],
    },
    {
      name: "Hellmann Worldwide Logistics",
      nameEn: "Hellmann Worldwide Logistics",
      services: ["لوجستيات عالمية", "شحن دولي", "خدمات متكاملة"],
      rating: 4.8,
      logo: "✈️",
      features: ["شبكة دولية", "حلول مخصصة"],
    },
    {
      name: "DSV Logistics",
      nameEn: "DSV Logistics",
      services: ["شحن جوي", "شحن بحري", "نقل بري"],
      rating: 4.9,
      logo: "🚛",
      features: ["خدمات متكاملة", "تقنيات حديثة"],
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const logisticsPayload = {
      sender_name: bookingData.senderName,
      sender_phone: bookingData.senderPhone,
      sender_address: bookingData.senderAddress,
      receiver_name: bookingData.receiverName,
      receiver_phone: bookingData.receiverPhone,
      receiver_address: bookingData.receiverAddress,
      package_type: bookingData.packageType,
      package_weight: bookingData.packageWeight,
      package_dimensions: bookingData.packageDimensions,
      insurance_value: bookingData.insuranceValue,
      pickup_date: bookingData.pickupDate,
      delivery_instructions: bookingData.deliveryInstructions,
      package_type_label: packageTypes.find(p => p.value === bookingData.packageType)?.label || '',
      package_type_icon: packageTypes.find(p => p.value === bookingData.packageType)?.icon || '',
      service_type: bookingData.serviceType,
      service_type_label: serviceTypes.find(s => s.value === bookingData.serviceType)?.label || '',
      service_type_icon: serviceTypes.find(s => s.value === bookingData.serviceType)?.icon || '',
    };

    try {
      // Create link in Supabase
      const link = await createLink.mutateAsync({
        type: "logistics",
        country_code: country || "SA",
        payload: logisticsPayload,
      });

      toast({
        title: "تم إنشاء طلب الشحن بنجاح!",
        description: "يمكنك مشاركة الرابط مع المرسل والمستلم",
      });

      // Navigate to microsite
      navigate(link.microsite_url);
    } catch (error) {
      console.error("Error creating logistics booking:", error);
    }
  };

  if (!selectedCountry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>دولة غير صحيحة</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6" dir="rtl">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(`/services`)}
            className="mb-4"
          >
            <ArrowRight className="w-4 h-4 ml-2" />
            العودة للخدمات
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">الخدمات اللوجستية المتكاملة</h1>
              <p className="text-sm text-muted-foreground">
                {selectedCountry.nameAr}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Sender Information */}
              <Card className="p-6 mb-6">
                <h2 className="text-lg font-bold mb-4">بيانات المرسل</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="senderName">اسم المرسل *</Label>
                    <Input
                      id="senderName"
                      value={bookingData.senderName}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, senderName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="senderPhone">رقم الهاتف *</Label>
                    <Input
                      id="senderPhone"
                      type="tel"
                      value={bookingData.senderPhone}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, senderPhone: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="senderAddress">عنوان الاستلام *</Label>
                    <Textarea
                      id="senderAddress"
                      value={bookingData.senderAddress}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, senderAddress: e.target.value })
                      }
                      required
                      rows={2}
                    />
                  </div>
                </div>
              </Card>

              {/* Receiver Information */}
              <Card className="p-6 mb-6">
                <h2 className="text-lg font-bold mb-4">بيانات المستلم</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="receiverName">اسم المستلم *</Label>
                    <Input
                      id="receiverName"
                      value={bookingData.receiverName}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, receiverName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="receiverPhone">رقم الهاتف *</Label>
                    <Input
                      id="receiverPhone"
                      type="tel"
                      value={bookingData.receiverPhone}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, receiverPhone: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="receiverAddress">عنوان التوصيل *</Label>
                    <Textarea
                      id="receiverAddress"
                      value={bookingData.receiverAddress}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, receiverAddress: e.target.value })
                      }
                      required
                      rows={2}
                    />
                  </div>
                </div>
              </Card>

              {/* Package Details */}
              <Card className="p-6 mb-6">
                <h2 className="text-lg font-bold mb-4">تفاصيل الشحنة</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="packageType">نوع الشحنة *</Label>
                    <Select
                      value={bookingData.packageType}
                      onValueChange={(value) =>
                        setBookingData({ ...bookingData, packageType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع الشحنة..." />
                      </SelectTrigger>
                      <SelectContent>
                        {packageTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <span className="flex items-center gap-2">
                              <span>{type.icon}</span>
                              <span>{type.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="packageWeight">الوزن (كيلوجرام) *</Label>
                    <Input
                      id="packageWeight"
                      type="number"
                      value={bookingData.packageWeight}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, packageWeight: e.target.value })
                      }
                      min="0.1"
                      step="0.1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="packageDimensions">الأبعاد (الطول × العرض × الارتفاع)</Label>
                    <Input
                      id="packageDimensions"
                      value={bookingData.packageDimensions}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, packageDimensions: e.target.value })
                      }
                      placeholder="مثال: 50 × 30 × 20 سم"
                    />
                  </div>
                  <div>
                    <Label htmlFor="insuranceValue">قيمة التأمين ({selectedCountry.currency})</Label>
                    <Input
                      id="insuranceValue"
                      type="number"
                      value={bookingData.insuranceValue}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, insuranceValue: e.target.value })
                      }
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </Card>

              {/* Service Type */}
              <Card className="p-6 mb-6">
                <h2 className="text-lg font-bold mb-4">نوع الخدمة</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="serviceType">اختر الخدمة *</Label>
                    <Select
                      value={bookingData.serviceType}
                      onValueChange={(value) =>
                        setBookingData({ ...bookingData, serviceType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع الخدمة..." />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map((service) => (
                          <SelectItem key={service.value} value={service.value}>
                            <span className="flex items-center gap-2">
                              <span>{service.icon}</span>
                              <span>{service.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pickupDate">تاريخ الاستلام المفضل</Label>
                    <Input
                      id="pickupDate"
                      type="date"
                      value={bookingData.pickupDate}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, pickupDate: e.target.value })
                      }
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="deliveryInstructions">تعليمات التوصيل</Label>
                    <Textarea
                      id="deliveryInstructions"
                      value={bookingData.deliveryInstructions}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, deliveryInstructions: e.target.value })
                      }
                      rows={3}
                      placeholder="ملاحظات خاصة بالتوصيل..."
                    />
                  </div>
                </div>
              </Card>

              <Button type="submit" size="lg" className="w-full">
                <Package className="w-4 h-4 ml-2" />
                إنشاء طلب الشحن
              </Button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Logistics Providers */}
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">شركاء الخدمات اللوجستية</h2>
              <div className="space-y-4">
                {logisticsProviders.map((provider, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{provider.logo}</span>
                      <div>
                        <h3 className="font-bold text-sm">{provider.name}</h3>
                        <p className="text-xs text-muted-foreground">{provider.nameEn}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {provider.services.map((service, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        ⭐ {provider.rating}
                      </span>
                      <div className="flex gap-1">
                        {provider.features.map((feature, i) => (
                          <span key={i} className="text-green-600" title={feature}>
                            ✓
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Features */}
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">مميزات الخدمة</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Globe className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">تغطية عالمية</p>
                    <p className="text-xs text-muted-foreground">
                      خدمات شحن لجميع أنحاء العالم
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">تتبع مباشر</p>
                    <p className="text-xs text-muted-foreground">
                      راقب شحنتك خطوة بخطوة
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">تأمين شامل</p>
                    <p className="text-xs text-muted-foreground">
                      حماية كاملة لشحنتك
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">مواعيد دقيقة</p>
                    <p className="text-xs text-muted-foreground">
                      توصيل في الوقت المحدد
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tracking Info */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <h2 className="text-lg font-bold mb-4 text-blue-800">
                تتبع الشحنات
              </h2>
              <p className="text-sm text-blue-700 mb-3">
                تتبع شحنتك في الوقت الفعلي
              </p>
              <Button variant="outline" className="w-full border-blue-300 text-blue-700">
                <MapPin className="w-4 h-4 ml-2" />
                تتبع شحنة موجودة
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsServices;
