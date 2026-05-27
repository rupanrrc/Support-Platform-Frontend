import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { SocketConnection } from "@/components/organisms/SocketConnection";
import { SessionBootstrap } from "@/components/organisms/SessionBootstrap";

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const accessToken = useAuthStore((s) => s.accessToken);
  const location = useLocation();

  if (!isAuthenticated || !accessToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <>
      <SessionBootstrap />
      <SocketConnection />
      <Outlet />
    </>
  );
}
