import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthCard } from "@/components/molecules/AuthCard";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Spinner } from "@/components/atoms/Spinner";
import { useRegister, useRegistrationStatus } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/api/axiosInstance";
import { getDashboardPath } from "@/utils/rolePaths";
import { useAuthStore } from "@/stores/authStore";
import { useUiStore } from "@/stores/uiStore";
import { PASSWORD_HINT, validatePassword } from "@/utils/passwordRules";

export function RegisterPage() {
  const navigate = useNavigate();
  const register = useRegister();
  const registrationStatus = useRegistrationStatus();
  const pushToast = useUiStore((s) => s.pushToast);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mode = registrationStatus.data?.mode;
  const statusMessage = registrationStatus.data?.message;
  const isBootstrap = mode === "bootstrap";

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
      setErrors({ form: message });
    }
  };

  if (registrationStatus.isLoading) {
    return (
      <AuthCard title="Create account" subtitle="Loading registration options…">
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      </AuthCard>
    );
  }

  const title = isBootstrap ? "Create administrator account" : "Create customer account";
  const submitLabel = isBootstrap ? "Create administrator account" : "Create account";

  return (
    <AuthCard
      title={title}
      subtitle={statusMessage}
      footer={
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
            Sign in
          </Link>
        </p>
      }
    >
      {!isBootstrap ? (
        <p className="mb-4 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
          <strong className="text-foreground">Need agent or manager access?</strong> Ask your organization&apos;s
          administrator to create your account under <strong>Admin → Users</strong>.
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.form ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">
            {errors.form}
          </p>
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
        <p className="-mt-2 text-xs text-muted-foreground">{PASSWORD_HINT}</p>
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
          {submitLabel}
        </Button>
      </form>
    </AuthCard>
  );
}
