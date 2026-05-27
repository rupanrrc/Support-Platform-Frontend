import { Link } from "react-router-dom";

interface BackLinkProps {
  to: string;
  label?: string;
}

export function BackLink({ to, label = "Back" }: BackLinkProps) {
  return (
    <Link
      to={to}
      className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-600 transition hover:text-brand-600"
    >
      <span aria-hidden>←</span>
      {label}
    </Link>
  );
}
