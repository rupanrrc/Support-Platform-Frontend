import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { getDashboardPath } from "@/utils/rolePaths";
import type { UserRole } from "@/types/user";

interface NavItem {
  label: string;
  to: string;
}

function navForRole(role: UserRole, teamId?: string | null): NavItem[] {
  const base = getDashboardPath(role);
  switch (role) {
    case "customer":
      return [
        { label: "Dashboard", to: base },
        { label: "My tickets", to: "/customer/tickets" },
        { label: "New ticket", to: "/customer/tickets/new" }
      ];
    case "agent":
      return [
        { label: "Dashboard", to: base },
        { label: "Queue", to: "/agent/queue" }
      ];
    case "manager":
      return [
        { label: "Dashboard", to: base },
        { label: "Analytics", to: "/manager/analytics" },
        { label: "Escalations", to: "/manager/escalations" },
        ...(teamId ? [{ label: "My team", to: `/manager/teams/${teamId}` }] : [])
      ];
    case "admin":
      return [
        { label: "Dashboard", to: base },
        { label: "All tickets", to: "/admin/tickets" },
        { label: "Analytics", to: "/admin/analytics" },
        { label: "Users", to: "/admin/users" },
        { label: "Teams", to: "/admin/teams" },
        { label: "Audit logs", to: "/admin/audit-logs" }
      ];
    default:
      return [{ label: "Dashboard", to: base }];
  }
}

const linkIdle = "text-foreground hover:bg-muted";
const linkActive = "bg-brand-50 font-medium text-brand-700 dark:bg-brand-950 dark:text-brand-300";

export function DashboardNav() {
  const user = useAuthStore((s) => s.user);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const location = useLocation();

  if (!user) return null;

  const items = navForRole(user.role, user.teamId);

  return (
    <nav className="space-y-1 p-3 text-sm">
      {items.map((item) => {
        const active = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`block rounded-lg px-3 py-2 ${active ? linkActive : linkIdle}`}
          >
            {item.label}
          </Link>
        );
      })}
      <Link
        to="/profile"
        className={`block rounded-lg px-3 py-2 ${
          location.pathname === "/profile" ? linkActive : linkIdle
        }`}
      >
        Profile
      </Link>
      <Link
        to="/notifications"
        className={`flex items-center justify-between rounded-lg px-3 py-2 ${
          location.pathname === "/notifications" ? linkActive : linkIdle
        }`}
      >
        <span>Notifications</span>
        {unreadCount > 0 ? (
          <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs font-medium text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </Link>
    </nav>
  );
}
