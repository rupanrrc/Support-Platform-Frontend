import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { teamsApi } from "@/api/teamsApi";
import { useAuthStore } from "@/stores/authStore";
import { StatCard } from "@/components/molecules/StatCard";
import { TicketTable } from "@/components/organisms/TicketTable";
import { Spinner } from "@/components/atoms/Spinner";
import { getDashboardPath } from "@/utils/rolePaths";

export function TeamOverviewPage() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);

  const teamQuery = useQuery({
    queryKey: ["team", id],
    queryFn: () => teamsApi.getById(id!),
    enabled: Boolean(id)
  });

  const statsQuery = useQuery({
    queryKey: ["team", id, "stats"],
    queryFn: () => teamsApi.stats(id!),
    enabled: Boolean(id)
  });

  const queueQuery = useQuery({
    queryKey: ["team", id, "queue"],
    queryFn: () => teamsApi.queue(id!, { status: "open" }),
    enabled: Boolean(id)
  });

  if (!user) return null;

  if (teamQuery.isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  const team = teamQuery.data;
  if (!team) {
    return (
      <div>
        <h1 className="text-2xl font-semibold">Team not found</h1>
        <Link to={getDashboardPath(user.role)} className="mt-4 inline-block text-brand-600">
          Back
        </Link>
      </div>
    );
  }

  const stats = statsQuery.data as Record<string, number> | undefined;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">{team.name}</h1>
        <p className="mt-1 text-sm text-slate-600">{team.description || "Team overview"}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open tickets" value={stats?.openTickets ?? 0} />
        <StatCard label="Resolved" value={stats?.resolvedTickets ?? 0} tone="success" />
        <StatCard label="Escalated queue" value={stats?.escalatedQueue ?? 0} tone="warning" />
        <StatCard
          label="Avg resolution (hrs)"
          value={stats?.avgResolutionHours ?? "—"}
        />
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Open queue</h2>
        <TicketTable
          tickets={queueQuery.data || []}
          role={user.role}
          loading={queueQuery.isLoading}
          showCustomer
          showAgent
        />
      </section>
    </div>
  );
}
