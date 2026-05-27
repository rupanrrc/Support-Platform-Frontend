import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useAuthStore } from "@/stores/authStore";
import { useUiStore } from "@/stores/uiStore";
import { useLogout } from "@/hooks/useAuth";
import { DashboardNav } from "@/components/organisms/DashboardNav";
import { Button } from "@/components/atoms/Button";
import { ThemeToggle } from "@/components/atoms/ThemeToggle";

export function DashboardLayout() {
  const user = useAuthStore((s) => s.user);
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const socketConnected = useUiStore((s) => s.socketConnected);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const setSidebarOpen = useUiStore((s) => s.setSidebarOpen);
  const logout = useLogout();
  const navigate = useNavigate();
  const location = useLocation();

  const segment = location.pathname.split("/").filter(Boolean)[1] ?? "dashboard";
  useDocumentTitle(segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "));

  const handleLogout = async () => {
    await logout.mutateAsync();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col overflow-hidden border-r border-border bg-card transition-all duration-200 lg:static ${
          sidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-14 items-center gap-2 border-b border-border px-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-xs font-bold text-white">
            SP
          </span>
          <span className="font-semibold text-brand-600 dark:text-brand-400">Support Platform</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <DashboardNav />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur">
          <button
            type="button"
            onClick={toggleSidebar}
            className="rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted lg:hidden"
            aria-expanded={sidebarOpen}
          >
            Menu
          </button>
          <div className="hidden text-sm font-medium text-muted-foreground lg:block">Help desk</div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span
              className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:inline-flex"
              title={socketConnected ? "Real-time connected" : "Real-time disconnected"}
            >
              <span
                className={`h-2 w-2 rounded-full ${socketConnected ? "bg-emerald-500" : "bg-amber-400"}`}
              />
              {socketConnected ? "Live" : "Offline"}
            </span>
            {user ? (
              <span className="max-w-[12rem] truncate text-sm text-muted-foreground sm:max-w-none">
                {user.name}
                <span className="hidden capitalize opacity-80 sm:inline"> · {user.role}</span>
              </span>
            ) : null}
            <Button variant="ghost" onClick={handleLogout} loading={logout.isPending}>
              Logout
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
