interface StatCardProps {
  label: string;
  value: number | string;
  hint?: string;
  tone?: "default" | "warning" | "success";
}

const toneClasses = {
  default: "border-border bg-card",
  warning: "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50",
  success: "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/50"
};

export function StatCard({ label, value, hint, tone = "default" }: StatCardProps) {
  return (
    <div className={`rounded-xl border p-4 shadow-sm ${toneClasses[tone]}`}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
