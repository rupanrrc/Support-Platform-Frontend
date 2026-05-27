import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { AuthCard } from "@/components/molecules/AuthCard";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { useForgotPassword } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/api/axiosInstance";
import { useUiStore } from "@/stores/uiStore";

export function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword();
  const pushToast = useUiStore((s) => s.pushToast);

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    setError(undefined);

    try {
      await forgotPassword.mutateAsync(email.trim());
      setSubmitted(true);
      pushToast({
        type: "success",
        message: "If an account exists, reset instructions were sent."
      });
    } catch (err) {
      pushToast({ type: "error", message: getApiErrorMessage(err) });
    }
  };

  if (submitted) {
    return (
      <AuthCard
        title="Check your email"
        subtitle="If an account exists for that address, we sent password reset instructions."
        footer={
          <Link to="/login" className="font-medium text-brand-600 hover:underline">
            Back to sign in
          </Link>
        }
      >
        <p className="text-center text-sm text-slate-600">
          Did not receive an email? Check spam or try again with another address.
        </p>
        <Button
          type="button"
          variant="secondary"
          className="mt-4 w-full"
          onClick={() => setSubmitted(false)}
        >
          Try another email
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot password"
      subtitle="Enter your email and we will send a reset link if the account exists."
      footer={
        <Link to="/login" className="font-medium text-brand-600 hover:underline">
          Back to sign in
        </Link>
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
          error={error}
          placeholder="you@company.com"
        />
        <Button type="submit" className="w-full" loading={forgotPassword.isPending}>
          Send reset link
        </Button>
      </form>
    </AuthCard>
  );
}
