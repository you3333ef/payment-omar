import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Country, getCountryByCode } from "@/lib/countries";
import { ArrowRight, Heart, Shield, Clock, Award, Phone, MapPin, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCreateLink } from "@/hooks/useSupabase";

const HealthServices = () => {
  const { country } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const selectedCountry = getCountryByCode(country || "");
  const createLink = useCreateLink();

  const [bookingData, setBookingData] = useState({
    patientName: "",
    patientId: "",
    phone: "",
    email: "",
    appointmentDate: "",
    appointmentTime: "",
    serviceType: "",
    doctorName: "",
    notes: "",
  });

  const serviceTypes = [
    { value: "consultation", label: "استشارة طبية", icon: "👨‍⚕️" },
    { value: "checkup", label: "فحص دوري", icon: "🔬" },
    { value: "vaccination", label: "تطعيم", icon: "💉" },
    { value: "lab", label: "تحاليل مخبرية", icon: "🧪" },
    { value: "dental", label: "طب الأسنان", icon: "🦷" },
    { value: "eye", label: "طب العيون", icon: "👁️" },
    { value: "physiotherapy", label: "علاج طبيعي", icon: "💪" },
    { value: "mental", label: "صحة نفسية", icon: "🧠" },
  ];

  const accreditedProviders = [
    {
      name: "مستشفى الملك فيصل التخصصي",
      nameEn: "King Faisal Specialist Hospital",
      specialty: "تخصصي",
      rating: 4.9,
      location: selectedCountry?.mainCity || "الرياض",
      phone: "+966-11-464-7272",
      verified: true,
    },
    {
      name: "مستشفى الملك عبدالعزيز الجامعي",
      nameEn: "King Abdulaziz University Hospital",
      specialty: "جامعي",
      rating: 4.8,
      location: selectedCountry?.mainCity || "جدة",
      phone: "+966-12-640-8000",
      verified: true,
    },
    {
      name: "مستشفى الأمير محمد بن عبدالعزيز",
      nameEn: "Prince Mohammad Bin Abdulaziz Hospital",
      specialty: "عام",
      rating: 4.7,
      location: selectedCountry?.mainCity || "الدمام",
      phone: "+966-13-844-9000",
      verified: true,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const bookingPayload = {
      patient_name: bookingData.patientName,
      patient_id: bookingData.patientId,
      phone: bookingData.phone,
      email: bookingData.email,
      service_type: bookingData.serviceType,
      doctor_name: bookingData.doctorName,
      appointment_date: bookingData.appointmentDate,
      appointment_time: bookingData.appointmentTime,
      notes: bookingData.notes,
      service_type_label: serviceTypes.find(s => s.value === bookingData.serviceType)?.label || '',
      service_type_icon: serviceTypes.find(s => s.value === bookingData.serviceType)?.icon || '',
      service_category: 'health',
    };

    try {
      // Create link in Supabase
      const link = await createLink.mutateAsync({
        type: "health",
        country_code: country || "SA",
        payload: bookingPayload,
      });

      toast({
        title: "تم إرسال طلب الحجز بنجاح!",
        description: "يمكنك مشاركة الرابط مع المريض",
      });

      // Navigate to microsite
      navigate(link.microsite_url);
    } catch (error) {
      console.error("Error creating booking:", error);
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
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">الخدمات الصحية المعتمدة</h1>
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
              <Card className="p-6 mb-6">
                <h2 className="text-lg font-bold mb-4">بيانات المريض</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patientName">الاسم الكامل *</Label>
                    <Input
                      id="patientName"
                      value={bookingData.patientName}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, patientName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="patientId">رقم الهوية/الإقامة *</Label>
                    <Input
                      id="patientId"
                      value={bookingData.patientId}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, patientId: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">رقم الهاتف *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={bookingData.phone}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, phone: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      value={bookingData.email}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, email: e.target.value })
                      }
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6 mb-6">
                <h2 className="text-lg font-bold mb-4">تفاصيل الموعد</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="serviceType">نوع الخدمة *</Label>
                    <Select
                      value={bookingData.serviceType}
                      onValueChange={(value) =>
                        setBookingData({ ...bookingData, serviceType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الخدمة..." />
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
                    <Label htmlFor="doctorName">الطبيب المفضل (اختياري)</Label>
                    <Input
                      id="doctorName"
                      value={bookingData.doctorName}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, doctorName: e.target.value })
                      }
                      placeholder="اسم الطبيب..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="appointmentDate">تاريخ الموعد *</Label>
                    <Input
                      id="appointmentDate"
                      type="date"
                      value={bookingData.appointmentDate}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, appointmentDate: e.target.value })
                      }
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="appointmentTime">الوقت المفضل *</Label>
                    <Select
                      value={bookingData.appointmentTime}
                      onValueChange={(value) =>
                        setBookingData({ ...bookingData, appointmentTime: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الوقت..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="09:00">09:00 صباحاً</SelectItem>
                        <SelectItem value="10:00">10:00 صباحاً</SelectItem>
                        <SelectItem value="11:00">11:00 صباحاً</SelectItem>
                        <SelectItem value="12:00">12:00 ظهراً</SelectItem>
                        <SelectItem value="14:00">02:00 بعد الظهر</SelectItem>
                        <SelectItem value="15:00">03:00 بعد الظهر</SelectItem>
                        <SelectItem value="16:00">04:00 بعد الظهر</SelectItem>
                        <SelectItem value="17:00">05:00 بعد الظهر</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              <Button type="submit" size="lg" className="w-full">
                <FileText className="w-4 h-4 ml-2" />
                حجز الموعد
              </Button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Accredited Providers */}
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">مقدمو الخدمة المعتمدون</h2>
              <div className="space-y-4">
                {accreditedProviders.map((provider, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-sm">{provider.name}</h3>
                      {provider.verified && (
                        <Badge variant="secondary" className="text-xs">
                          <Shield className="w-3 h-3 ml-1" />
                          معتمد
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {provider.nameEn}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{provider.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Award className="w-3 h-3" />
                      <span>{provider.rating} ⭐</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3"
                      onClick={() =>
                        setBookingData({
                          ...bookingData,
                          doctorName: provider.name,
                        })
                      }
                    >
                      اختيار هذا الطبيب
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Features */}
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">مميزات الخدمة</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">مقدمو خدمة معتمدون</p>
                    <p className="text-xs text-muted-foreground">
                      جميع المستشفيات والمراكز معتمدة
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">حجز سريع ومرن</p>
                    <p className="text-xs text-muted-foreground">
                      احجز موعدك في دقائق
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">أعلى معايير الجودة</p>
                    <p className="text-xs text-muted-foreground">
                      رعاية طبية متميزة
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Emergency Contact */}
            <Card className="p-6 bg-red-50 border-red-200">
              <h2 className="text-lg font-bold mb-4 text-red-800">
                في حالة الطوارئ
              </h2>
              <p className="text-sm text-red-700 mb-3">
                للطوارئ الطبية، اتصل مباشرة:
              </p>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => (window.location.href = "tel:997")}
              >
                <Phone className="w-4 h-4 ml-2" />
                997 - الإسعاف
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthServices;
