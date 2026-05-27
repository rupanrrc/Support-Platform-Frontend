import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useAnalyticsOverview } from "@/hooks/useAnalytics";
import { useTickets } from "@/hooks/useTickets";
import { StatCard } from "@/components/molecules/StatCard";
import { TicketTable } from "@/components/organisms/TicketTable";
import { Spinner } from "@/components/atoms/Spinner";

export function ManagerDashboard() {
  const user = useAuthStore((s) => s.user);
  const overview = useAnalyticsOverview();
  const escalated = useTickets({ status: "escalated", limit: 6 });

  if (!user) return null;

  if (overview.isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  const stats = overview.data;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Manager dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Team performance and escalations</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active tickets" value={stats?.totalActive ?? 0} />
        <StatCard label="Open" value={stats?.open ?? 0} />
        <StatCard label="Escalated" value={stats?.escalated ?? 0} tone="warning" />
        <StatCard label="SLA at risk" value={stats?.slaBreached ?? 0} tone="warning" />
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        {user.teamId ? (
          <Link
            to={`/manager/teams/${user.teamId}`}
            className="font-medium text-brand-600 hover:underline"
          >
            Team overview
          </Link>
        ) : null}
        <Link to="/manager/escalations" className="font-medium text-brand-600 hover:underline">
          View escalations
        </Link>
        <Link to="/manager/analytics" className="font-medium text-brand-600 hover:underline">
          Analytics
        </Link>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Recent escalations</h2>
        <TicketTable
          tickets={escalated.data?.items || []}
          role={user.role}
          loading={escalated.isLoading}
          showCustomer
          showAgent
        />
      </section>
    </div>
  );
}
