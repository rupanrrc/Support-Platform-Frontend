import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthCard } from "@/components/molecules/AuthCard";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { useRegister } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/api/axiosInstance";
import { getDashboardPath } from "@/utils/rolePaths";
import { useAuthStore } from "@/stores/authStore";
import { useUiStore } from "@/stores/uiStore";
import { PASSWORD_HINT, validatePassword } from "@/utils/passwordRules";

export function RegisterPage() {
  const navigate = useNavigate();
  const register = useRegister();
  const pushToast = useUiStore((s) => s.pushToast);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (!name.trim()) nextErrors.name = "Name is required";
    if (!email.trim()) nextErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Enter a valid email";

    const pwError = validatePassword(password);
    if (pwError) nextErrors.password = pwError;
    if (password !== confirmPassword) nextErrors.confirmPassword = "Passwords do not match";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      await register.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        password
      });
      const user = useAuthStore.getState().user;
      pushToast({ type: "success", message: "Account created successfully" });
      if (user) {
        navigate(getDashboardPath(user.role), { replace: true });
      }
    } catch (err) {
      const message = getApiErrorMessage(err);
      pushToast({ type: "error", message });
      if (message.toLowerCase().includes("admin")) {
        setErrors({
          form: "Registration is limited. Use seed credentials or ask an administrator to create your account."
        });
      }
    }
  };

  return (
    <AuthCard
      title="Create account"
      subtitle="On a new installation, the first account becomes the platform administrator."
      footer={
        <p className="text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-brand-600 hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.form ? (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{errors.form}</p>
        ) : null}
        <Input
          label="Full name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          autoComplete="name"
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="email"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="new-password"
        />
        <p className="-mt-2 text-xs text-slate-500">{PASSWORD_HINT}</p>
        <Input
          label="Confirm password"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />
        <Button type="submit" className="w-full" loading={register.isPending}>
          Create account
        </Button>
      </form>
    </AuthCard>
  );
}
