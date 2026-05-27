import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/api/authApi";
import { useAuthStore } from "@/stores/authStore";

export function useMe() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const accessToken = useAuthStore((s) => s.accessToken);

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authApi.me(),
    enabled: Boolean(isAuthenticated && accessToken),
    select: (data) => data.user
  });
}

export function useLogin() {
  const login = useAuthStore((s) => s.login);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    }
  });
}

export function useRegister() {
  const register = useAuthStore((s) => s.register);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: {
      name: string;
      email: string;
      password: string;
      role?: string;
      teamId?: string | null;
    }) => register(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    }
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword({ email })
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (body: { token: string; password: string }) => authApi.resetPassword(body)
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      queryClient.clear();
    }
  });
}
