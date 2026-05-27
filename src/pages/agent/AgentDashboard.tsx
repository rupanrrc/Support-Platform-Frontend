import { Link } from "react-router-dom";
import { useTickets } from "@/hooks/useTickets";
import { StatCard } from "@/components/molecules/StatCard";
import { TicketTable } from "@/components/organisms/TicketTable";

export function AgentDashboard() {
  const open = useTickets({ status: "open", limit: 1 });
  const inProgress = useTickets({ status: "in_progress", limit: 1 });
  const escalated = useTickets({ status: "escalated", limit: 1 });
  const queue = useTickets({ limit: 8 });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Agent dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Your assigned workload at a glance</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Open" value={open.data?.total ?? 0} />
        <StatCard label="In progress" value={inProgress.data?.total ?? 0} />
        <StatCard label="Escalated" value={escalated.data?.total ?? 0} tone="warning" />
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Queue preview</h2>
          <Link to="/agent/queue" className="text-sm text-brand-600 hover:underline">
            Open full queue
          </Link>
        </div>
        <TicketTable
          tickets={queue.data?.items || []}
          role="agent"
          loading={queue.isLoading}
          showCustomer
        />
      </section>
    </div>
  );
}
