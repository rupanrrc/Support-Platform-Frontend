import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import type { UserRole } from "@/types/user";

interface RoleGuardProps {
  allowed: UserRole[];
}

export function RoleGuard({ allowed }: RoleGuardProps) {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowed.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
