import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import ApplicationDetail from "./pages/ApplicationDetail";
import OfficeDetail from "./pages/OfficeDetail";
import IssuedDocuments from "./pages/IssuedDocuments";
import Officers from "./pages/Officers";
import Settings from "./pages/Settings";
import RequestAccount from "./pages/RequestAccount";
import OfficerRequests from "./pages/admin/OfficerRequests";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./components/constants/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes: no layout */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/request-account" element={<RequestAccount />} />

            {/* Protected Routes: use Layout */}
            <Route path="/" element={<Layout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="applications" element={<Applications />} />
              <Route path="applications/:id" element={<ApplicationDetail />} />
              <Route path="offices/:officeId" element={<OfficeDetail />} />
              <Route path="issued-documents" element={<IssuedDocuments />} />
              <Route path="officers" element={<Officers />} />
              <Route
                path="admin/officer-requests"
                element={<OfficerRequests />}
              />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
