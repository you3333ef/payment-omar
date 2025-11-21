import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Country, COUNTRIES, getCountryByCode } from "@/lib/countries";
import { ArrowRight, FileText, Plus, Trash2, Download, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCreateLink } from "@/hooks/useSupabase";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

const CreateInvoice = () => {
  const { country } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const selectedCountry = getCountryByCode(country || "");
  const createLink = useCreateLink();

  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: `INV-${Date.now()}`,
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",
    clientTaxNumber: "",
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: "",
    currency: selectedCountry?.currency || "SAR",
    vatRate: 15,
    notes: "",
    logo: "",
    seal: "",
    signature: "",
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: "1",
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    },
  ]);

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "quantity" || field === "unitPrice") {
            updated.total = updated.quantity * updated.unitPrice;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const vatAmount = (subtotal * invoiceData.vatRate) / 100;
  const total = subtotal + vatAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create invoice record
    const invoicePayload = {
      invoice_number: invoiceData.invoiceNumber,
      client_name: invoiceData.clientName,
      client_email: invoiceData.clientEmail,
      client_phone: invoiceData.clientPhone,
      client_address: invoiceData.clientAddress,
      client_tax_number: invoiceData.clientTaxNumber,
      issue_date: invoiceData.issueDate,
      due_date: invoiceData.dueDate,
      currency: invoiceData.currency,
      vat_rate: invoiceData.vatRate,
      items: items,
      subtotal: subtotal,
      vat_amount: vatAmount,
      total: total,
      notes: invoiceData.notes,
      service_type: 'invoices',
    };

    try {
      // Create link in Supabase
      const link = await createLink.mutateAsync({
        type: "invoices",
        country_code: country || "SA",
        payload: invoicePayload,
      });

      toast({
        title: "تم إنشاء فاتورة بنجاح!",
        description: "يمكنك مشاركة الرابط مع العميل",
      });

      // Navigate to microsite
      navigate(link.microsite_url);
    } catch (error) {
      console.error("Error creating invoice:", error);
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
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">إنشاء فاتورة جديدة</h1>
              <p className="text-sm text-muted-foreground">
                {selectedCountry.nameAr}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Invoice Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Client Information */}
              <Card className="p-6">
                <h2 className="text-lg font-bold mb-4">بيانات العميل</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clientName">اسم العميل *</Label>
                    <Input
                      id="clientName"
                      value={invoiceData.clientName}
                      onChange={(e) =>
                        setInvoiceData({ ...invoiceData, clientName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientEmail">البريد الإلكتروني *</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={invoiceData.clientEmail}
                      onChange={(e) =>
                        setInvoiceData({ ...invoiceData, clientEmail: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientPhone">رقم الهاتف *</Label>
                    <Input
                      id="clientPhone"
                      value={invoiceData.clientPhone}
                      onChange={(e) =>
                        setInvoiceData({ ...invoiceData, clientPhone: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientTaxNumber">الرقم الضريبي</Label>
                    <Input
                      id="clientTaxNumber"
                      value={invoiceData.clientTaxNumber}
                      onChange={(e) =>
                        setInvoiceData({ ...invoiceData, clientTaxNumber: e.target.value })
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="clientAddress">العنوان *</Label>
                    <Textarea
                      id="clientAddress"
                      value={invoiceData.clientAddress}
                      onChange={(e) =>
                        setInvoiceData({ ...invoiceData, clientAddress: e.target.value })
                      }
                      required
                      rows={2}
                    />
                  </div>
                </div>
              </Card>

              {/* Invoice Items */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">عناصر الفاتورة</h2>
                  <Button type="button" onClick={addItem} size="sm">
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة عنصر
                  </Button>
                </div>

                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="grid md:grid-cols-12 gap-3 p-4 bg-muted/30 rounded-lg"
                    >
                      <div className="md:col-span-5">
                        <Label>الوصف *</Label>
                        <Input
                          value={item.description}
                          onChange={(e) =>
                            updateItem(item.id, "description", e.target.value)
                          }
                          placeholder="وصف المنتج/الخدمة"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>الكمية *</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)
                          }
                          min="1"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>السعر ({invoiceData.currency})</Label>
                        <Input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) =>
                            updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)
                          }
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>الإجمالي</Label>
                        <Input value={item.total.toFixed(2)} readOnly />
                      </div>
                      <div className="md:col-span-1 flex items-end">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          disabled={items.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Notes */}
              <Card className="p-6">
                <h2 className="text-lg font-bold mb-4">ملاحظات</h2>
                <Textarea
                  value={invoiceData.notes}
                  onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
                  rows={4}
                  placeholder="ملاحظات إضافية..."
                />
              </Card>
            </div>

            {/* Invoice Summary */}
            <div className="space-y-6">
              {/* Invoice Settings */}
              <Card className="p-6">
                <h2 className="text-lg font-bold mb-4">إعدادات الفاتورة</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="invoiceNumber">رقم الفاتورة</Label>
                    <Input
                      id="invoiceNumber"
                      value={invoiceData.invoiceNumber}
                      onChange={(e) =>
                        setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="issueDate">تاريخ الإصدار</Label>
                    <Input
                      id="issueDate"
                      type="date"
                      value={invoiceData.issueDate}
                      onChange={(e) =>
                        setInvoiceData({ ...invoiceData, issueDate: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="dueDate">تاريخ الاستحقاق</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={invoiceData.dueDate}
                      onChange={(e) =>
                        setInvoiceData({ ...invoiceData, dueDate: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="vatRate">معدل الضريبة (%)</Label>
                    <Input
                      id="vatRate"
                      type="number"
                      value={invoiceData.vatRate}
                      onChange={(e) =>
                        setInvoiceData({
                          ...invoiceData,
                          vatRate: parseFloat(e.target.value) || 0,
                        })
                      }
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </Card>

              {/* Invoice Total */}
              <Card className="p-6">
                <h2 className="text-lg font-bold mb-4">إجمالي الفاتورة</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>المجموع الفرعي:</span>
                    <span>
                      {subtotal.toFixed(2)} {invoiceData.currency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>الضريبة ({invoiceData.vatRate}%):</span>
                    <span>
                      {vatAmount.toFixed(2)} {invoiceData.currency}
                    </span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>الإجمالي:</span>
                    <span className="text-primary">
                      {total.toFixed(2)} {invoiceData.currency}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Actions */}
              <div className="space-y-3">
                <Button type="submit" className="w-full" size="lg">
                  <Send className="w-4 h-4 ml-2" />
                  إنشاء الفاتورة
                </Button>
                <Button type="button" variant="outline" className="w-full" size="lg">
                  <Download className="w-4 h-4 ml-2" />
                  حفظ كمسودة
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoice;
