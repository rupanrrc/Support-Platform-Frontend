import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { getDashboardPath } from "@/utils/rolePaths";
import { ThemeToggle } from "@/components/atoms/ThemeToggle";

export function ForbiddenPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-6">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-sm">
        <p className="text-5xl font-bold text-amber-200 dark:text-amber-900">403</p>
        <h1 className="mt-2 text-xl font-semibold text-foreground">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">You do not have permission to view this page.</p>
        {user ? (
          <Link
            to={getDashboardPath(user.role)}
            className="mt-6 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Go to dashboard
          </Link>
        ) : (
          <Link
            to="/login"
            className="mt-6 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
}
