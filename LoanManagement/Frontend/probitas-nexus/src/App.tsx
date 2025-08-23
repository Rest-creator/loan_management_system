import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LoginPage from "@/components/auth/LoginPage";

// Admin Pages
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import LoanApplicationsPage from "@/pages/admin/LoanApplicationsPage";
import ClientsPage from "@/pages/admin/ClientsPage";
import ReportsPage from "@/pages/admin/ReportsPage";
import RepaymentsPage from "@/pages/admin/RepaymentsPage";
import PerformancePage from "@/pages/admin/PerformancePage";
import AuditTrailPage from "@/pages/admin/AuditTrailPage";
import SettingsPage from "@/pages/admin/SettingsPage";
import AgentsPage from "@/pages/admin/AgentsPage";
import AdminRegisterPage from "@/pages/admin/AdminRegisterPage";

// Agent Pages
import AgentDashboardPage from "@/pages/agent/AgentDashboardPage";
import AgentLoanApplicationsPage from "@/pages/agent/AgentLoanApplicationsPage";
import AgentClientsPage from "@/pages/agent/AgentClientsPage";
import AgentReportsPage from "@/pages/agent/AgentReportsPage";
import AgentRepaymentsPage from "@/pages/agent/AgentRepaymentsPage";
import LoanCalculatorPage from "@/pages/agent/LoanCalculatorPage";
import AgentSettingsPage from "@/pages/agent/AgentSettingsPage";
import AgentRegisterPage from "@/pages/agent/AgentRegisterPage";

import NotFound from "./pages/NotFound";
import ClientProfilePage from "./pages/ClientProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            
            {/* Admin Routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/loan-applications" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <LoanApplicationsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/clients" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <ClientsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/reports" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <ReportsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/repayments" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <RepaymentsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/performance" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <PerformancePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/audit" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AuditTrailPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/settings" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <SettingsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/agents" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AgentsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/register" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminRegisterPage />
                </ProtectedRoute>
              } 
            />

            {/* Agent Routes */}
            <Route 
              path="/agent/dashboard" 
              element={
                <ProtectedRoute requiredRole="agent">
                  <AgentDashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agent/loan-applications" 
              element={
                <ProtectedRoute requiredRole="agent">
                  <AgentLoanApplicationsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agent/clients" 
              element={
                <ProtectedRoute requiredRole="agent">
                  <AgentClientsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agent/reports" 
              element={
                <ProtectedRoute requiredRole="agent">
                  <AgentReportsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agent/repayments" 
              element={
                <ProtectedRoute requiredRole="agent">
                  <AgentRepaymentsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agent/calculator" 
              element={
                <ProtectedRoute requiredRole="agent">
                  <LoanCalculatorPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agent/settings" 
              element={
                <ProtectedRoute requiredRole="agent">
                  <AgentSettingsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agent/register" 
              element={
                <ProtectedRoute requiredRole="agent">
                  <AgentRegisterPage />
                </ProtectedRoute>
              } 
            />

            {/* Shared Routes */}
            <Route 
              path="/client-profile/:id" 
              element={<ClientProfilePage />} 
            />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
