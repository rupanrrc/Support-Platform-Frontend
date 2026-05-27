interface ErrorAlertProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorAlert({ title = "Something went wrong", message, onRetry }: ErrorAlertProps) {
  return (
    <div
      className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
      role="alert"
    >
      <p className="font-medium">{title}</p>
      <p className="mt-1">{message}</p>
      {onRetry ? (
        <button
          type="button"
          className="mt-2 font-medium underline hover:no-underline"
          onClick={onRetry}
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
