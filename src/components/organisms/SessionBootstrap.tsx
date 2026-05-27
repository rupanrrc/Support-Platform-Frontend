import { useEffect } from "react";
import { useMe } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/authStore";

/** Refreshes the persisted user profile from the API on load. */
export function SessionBootstrap() {
  const { data: user } = useMe();
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    if (user) setUser(user);
  }, [user, setUser]);

  return null;
}
