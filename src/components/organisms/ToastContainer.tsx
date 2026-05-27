import { useUiStore } from "@/stores/uiStore";

export function ToastContainer() {
  const toasts = useUiStore((s) => s.toastQueue);
  const dismissToast = useUiStore((s) => s.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-50 flex max-w-sm flex-col gap-2"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex animate-[slideIn_0.2s_ease-out] items-start justify-between gap-3 rounded-lg px-4 py-3 text-sm shadow-lg ring-1 ring-black/5 ${
            t.type === "error"
              ? "bg-red-600 text-white"
              : t.type === "success"
                ? "bg-emerald-600 text-white"
                : "bg-slate-800 text-white"
          }`}
        >
          <span className="leading-snug">{t.message}</span>
          <button
            type="button"
            className="shrink-0 rounded p-0.5 opacity-80 hover:bg-white/10 hover:opacity-100"
            aria-label="Dismiss"
            onClick={() => dismissToast(t.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
