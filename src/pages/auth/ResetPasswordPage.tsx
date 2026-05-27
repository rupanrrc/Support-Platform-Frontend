import { FormEvent, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthCard } from "@/components/molecules/AuthCard";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { useResetPassword } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/api/axiosInstance";
import { useUiStore } from "@/stores/uiStore";
import { PASSWORD_HINT, validatePassword } from "@/utils/passwordRules";

export function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const resetPassword = useResetPassword();
  const pushToast = useUiStore((s) => s.pushToast);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  if (!token || token.length < 32) {
    return (
      <AuthCard title="Invalid link" subtitle="This password reset link is invalid or incomplete.">
        <Link to="/forgot-password" className="block text-center text-brand-600 hover:underline">
          Request a new reset link
        </Link>
      </AuthCard>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    const pwError = validatePassword(password);
    if (pwError) nextErrors.password = pwError;
    if (password !== confirmPassword) nextErrors.confirmPassword = "Passwords do not match";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      await resetPassword.mutateAsync({ token, password });
      setDone(true);
      pushToast({ type: "success", message: "Password updated. You can sign in now." });
    } catch (err) {
      pushToast({ type: "error", message: getApiErrorMessage(err) });
    }
  };

  if (done) {
    return (
      <AuthCard
        title="Password updated"
        subtitle="Your password has been reset successfully."
        footer={
          <Link to="/login" className="font-medium text-brand-600 hover:underline">
            Sign in
          </Link>
        }
      >
        <Button type="button" className="w-full" onClick={() => navigate("/login", { replace: true })}>
          Go to sign in
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Set new password"
      subtitle="Choose a strong password for your account."
      footer={
        <Link to="/login" className="font-medium text-brand-600 hover:underline">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="New password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <p className="-mt-2 text-xs text-slate-500">{PASSWORD_HINT}</p>
        <Input
          label="Confirm password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
        />
        <Button type="submit" className="w-full" loading={resetPassword.isPending}>
          Update password
        </Button>
      </form>
    </AuthCard>
  );
}
