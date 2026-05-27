import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { getDashboardPath } from "@/utils/rolePaths";

export function HomeRedirect() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getDashboardPath(user.role)} replace />;
}
