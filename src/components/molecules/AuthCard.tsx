import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-8 shadow-md ring-1 ring-black/10 dark:ring-white/10">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
          SP
        </div>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {children}
      {footer ? (
        <div className="mt-6 border-t border-border pt-4 text-center text-sm text-muted-foreground">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
