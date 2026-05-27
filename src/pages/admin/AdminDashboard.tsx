import { Link } from "react-router-dom";
import { useAnalyticsOverview } from "@/hooks/useAnalytics";
import { StatCard } from "@/components/molecules/StatCard";
import { Spinner } from "@/components/atoms/Spinner";

export function AdminDashboard() {
  const { data, isLoading } = useAnalyticsOverview();

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Admin dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">System-wide support metrics</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active tickets" value={data?.totalActive ?? 0} />
        <StatCard label="Open" value={data?.open ?? 0} />
        <StatCard label="In progress" value={data?.inProgress ?? 0} />
        <StatCard label="SLA breached" value={data?.slaBreached ?? 0} tone="warning" />
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <Link to="/admin/tickets" className="font-medium text-brand-600 hover:underline">
          All tickets
        </Link>
        <Link to="/admin/users" className="font-medium text-brand-600 hover:underline">
          User management
        </Link>
        <Link to="/admin/teams" className="font-medium text-brand-600 hover:underline">
          Teams
        </Link>
        <Link to="/admin/analytics" className="font-medium text-brand-600 hover:underline">
          Analytics dashboard
        </Link>
        <Link to="/admin/audit-logs" className="font-medium text-brand-600 hover:underline">
          Audit logs
        </Link>
      </div>
    </div>
  );
}
