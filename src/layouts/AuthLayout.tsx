import { Outlet } from "react-router-dom";
import { ThemeToggle } from "@/components/atoms/ThemeToggle";

export function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-brand-50 p-4 dark:from-slate-950 dark:to-slate-900">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
