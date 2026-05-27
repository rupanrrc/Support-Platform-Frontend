import { Link } from "react-router-dom";
import { useNotifications, useMarkNotificationRead } from "@/hooks/useNotifications";
import { useNotificationStore } from "@/stores/notificationStore";
import { useAuthStore } from "@/stores/authStore";
import { Spinner } from "@/components/atoms/Spinner";
import { Button } from "@/components/atoms/Button";
import { formatRelative } from "@/utils/formatDate";
import { getTicketDetailPath } from "@/utils/ticketPaths";
import { notificationsApi } from "@/api/notificationsApi";
import { useUiStore } from "@/stores/uiStore";
import { getApiErrorMessage } from "@/api/axiosInstance";

export function NotificationsPage() {
  const user = useAuthStore((s) => s.user);
  const notifications = useNotificationStore((s) => s.notifications);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const setNotifications = useNotificationStore((s) => s.setNotifications);
  const setUnreadCount = useNotificationStore((s) => s.setUnreadCount);
  const pushToast = useUiStore((s) => s.pushToast);

  const { isLoading } = useNotifications({ limit: 50 });
  const markRead = useMarkNotificationRead();

  const handleMarkAll = async () => {
    try {
      await notificationsApi.markAllRead();
      markAllRead();
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      pushToast({ type: "success", message: "All notifications marked read" });
    } catch (err) {
      pushToast({ type: "error", message: getApiErrorMessage(err) });
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Notifications</h1>
          <p className="mt-1 text-sm text-slate-600">Live updates via Socket.IO</p>
        </div>
        <Button variant="secondary" onClick={handleMarkAll}>
          Mark all read
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : notifications.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center text-sm text-slate-600">
          No notifications yet.
        </p>
      ) : (
        <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
          {notifications.map((n) => (
            <li
              key={n._id}
              className={`px-4 py-3 ${n.isRead ? "bg-white" : "bg-brand-50/40"}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-slate-900">{n.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{n.body}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {formatRelative(n.createdAt)} · {n.type.replace(/_/g, " ")}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {n.ticketId ? (
                    <Link
                      to={getTicketDetailPath(user.role, n.ticketId)}
                      className="text-sm text-brand-600 hover:underline"
                    >
                      View ticket
                    </Link>
                  ) : null}
                  {!n.isRead ? (
                    <button
                      type="button"
                      className="text-sm text-slate-600 hover:underline"
                      onClick={() => markRead.mutate(n._id)}
                    >
                      Mark read
                    </button>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
