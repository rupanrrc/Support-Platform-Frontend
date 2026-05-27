import { Route, Routes } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { RoleGuard } from "@/routes/RoleGuard";
import { GuestRoute } from "@/routes/GuestRoute";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "@/pages/auth/ResetPasswordPage";
import { HomeRedirect } from "@/pages/shared/HomeRedirect";
import { ForbiddenPage } from "@/pages/shared/ForbiddenPage";
import { NotFoundPage } from "@/pages/shared/NotFoundPage";
import { ProfilePage } from "@/pages/shared/ProfilePage";
import { NotificationsPage } from "@/pages/shared/NotificationsPage";
import { TicketDetailPage } from "@/pages/shared/TicketDetailPage";
import { CustomerDashboard } from "@/pages/customer/CustomerDashboard";
import { MyTicketsPage } from "@/pages/customer/MyTicketsPage";
import { CreateTicketPage } from "@/pages/customer/CreateTicketPage";
import { AgentDashboard } from "@/pages/agent/AgentDashboard";
import { AgentTicketQueue } from "@/pages/agent/AgentTicketQueue";
import { ManagerDashboard } from "@/pages/manager/ManagerDashboard";
import { TeamOverviewPage } from "@/pages/manager/TeamOverviewPage";
import { EscalationQueuePage } from "@/pages/manager/EscalationQueuePage";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { AdminTicketsPage } from "@/pages/admin/AdminTicketsPage";
import { UserManagementPage } from "@/pages/admin/UserManagementPage";
import { TeamManagementPage } from "@/pages/admin/TeamManagementPage";
import { AuditLogPage } from "@/pages/admin/AuditLogPage";
import { AnalyticsPage } from "@/pages/shared/AnalyticsPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />

      <Route element={<AuthLayout />}>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />

          <Route element={<RoleGuard allowed={["customer"]} />}>
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/tickets" element={<MyTicketsPage />} />
            <Route path="/customer/tickets/new" element={<CreateTicketPage />} />
            <Route path="/customer/tickets/:id" element={<TicketDetailPage />} />
          </Route>

          <Route element={<RoleGuard allowed={["agent"]} />}>
            <Route path="/agent/dashboard" element={<AgentDashboard />} />
            <Route path="/agent/queue" element={<AgentTicketQueue />} />
            <Route path="/agent/tickets/:id" element={<TicketDetailPage />} />
          </Route>

          <Route element={<RoleGuard allowed={["manager"]} />}>
            <Route path="/manager/dashboard" element={<ManagerDashboard />} />
            <Route path="/manager/analytics" element={<AnalyticsPage />} />
            <Route path="/manager/teams/:id" element={<TeamOverviewPage />} />
            <Route path="/manager/escalations" element={<EscalationQueuePage />} />
            <Route path="/manager/tickets/:id" element={<TicketDetailPage />} />
          </Route>

          <Route element={<RoleGuard allowed={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/tickets" element={<AdminTicketsPage />} />
            <Route path="/admin/tickets/:id" element={<TicketDetailPage />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/teams" element={<TeamManagementPage />} />
            <Route path="/admin/audit-logs" element={<AuditLogPage />} />
            <Route path="/admin/analytics" element={<AnalyticsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
