import type { UserRole } from "@/types/user";

const dashboardByRole: Record<UserRole, string> = {
  customer: "/customer/dashboard",
  agent: "/agent/dashboard",
  manager: "/manager/dashboard",
  admin: "/admin/dashboard"
};

export function getDashboardPath(role: UserRole): string {
  return dashboardByRole[role];
}

export function getRoleBasePath(role: UserRole): string {
  return `/${role}`;
}
