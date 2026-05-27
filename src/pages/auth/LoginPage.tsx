import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthCard } from "@/components/molecules/AuthCard";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { useLogin } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/api/axiosInstance";
import { getDashboardPath } from "@/utils/rolePaths";
import { useAuthStore } from "@/stores/authStore";
import { useUiStore } from "@/stores/uiStore";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useLogin();
  const pushToast = useUiStore((s) => s.pushToast);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    if (!email.trim()) nextErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Enter a valid email";
    if (!password) nextErrors.password = "Password is required";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      await login.mutateAsync({ email: email.trim(), password });
      const user = useAuthStore.getState().user;
      if (user) {
        const target = from && !from.startsWith("/login") ? from : getDashboardPath(user.role);
        navigate(target, { replace: true });
      }
    } catch (err) {
      pushToast({ type: "error", message: getApiErrorMessage(err) });
    }
  };

  return (
    <AuthCard
      title="Sign in"
      subtitle="Access your support dashboard"
      footer={
        <p className="text-slate-600">
          New installation?{" "}
          <Link to="/register" className="font-medium text-brand-600 hover:underline">
            Create admin account
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          placeholder="you@company.com"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm text-brand-600 hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full" loading={login.isPending}>
          Sign in
        </Button>
      </form>
    </AuthCard>
  );
}
