import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", id, ...props }: InputProps) {
  const inputId = id || props.name;
  return (
    <div className="space-y-1">
      {label ? (
        <label htmlFor={inputId} className="block text-sm font-medium text-foreground">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className={`w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground shadow-sm transition placeholder:text-muted-foreground focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""} ${className}`}
        {...props}
      />
      {error ? <p className="text-xs text-red-600 dark:text-red-400">{error}</p> : null}
    </div>
  );
}
