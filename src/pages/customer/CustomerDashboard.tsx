import { Link } from "react-router-dom";
import { useTickets } from "@/hooks/useTickets";
import { StatCard } from "@/components/molecules/StatCard";
import { PageHeader } from "@/components/molecules/PageHeader";
import { TicketTable } from "@/components/organisms/TicketTable";
import { Button } from "@/components/atoms/Button";

export function CustomerDashboard() {
  const open = useTickets({ status: "open", limit: 1 });
  const inProgress = useTickets({ status: "in_progress", limit: 1 });
  const resolved = useTickets({ status: "resolved", limit: 1 });
  const recent = useTickets({ limit: 5 });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Customer dashboard"
        subtitle="Overview of your support tickets"
        actions={
          <Link to="/customer/tickets/new">
            <Button>New ticket</Button>
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Open" value={open.data?.total ?? 0} />
        <StatCard label="In progress" value={inProgress.data?.total ?? 0} />
        <StatCard label="Resolved" value={resolved.data?.total ?? 0} tone="success" />
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent tickets</h2>
          <Link to="/customer/tickets" className="text-sm text-brand-600 hover:underline">
            View all
          </Link>
        </div>
        <TicketTable tickets={recent.data?.items || []} role="customer" loading={recent.isLoading} />
      </section>
    </div>
  );
}
