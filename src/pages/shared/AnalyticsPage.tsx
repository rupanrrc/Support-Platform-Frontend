import { useState } from "react";
import {
  useAnalyticsOverview,
  useAgentPerformance,
  useCategoriesReport,
  useSlaReport,
  useTeamPerformance,
  useTicketVolume
} from "@/hooks/useAnalytics";
import { StatCard } from "@/components/molecules/StatCard";
import { DataTable } from "@/components/molecules/DataTable";
import { HorizontalBarChart } from "@/components/molecules/HorizontalBarChart";
import { Spinner } from "@/components/atoms/Spinner";
import type { AgentPerformanceRow, TeamPerformanceRow } from "@/types/analytics";

export function AnalyticsPage() {
  const [groupBy, setGroupBy] = useState<"day" | "week" | "month">("day");

  const overview = useAnalyticsOverview();
  const volume = useTicketVolume(groupBy);
  const agents = useAgentPerformance();
  const teams = useTeamPerformance();
  const sla = useSlaReport();
  const categories = useCategoriesReport();

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
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="mt-1 text-sm text-slate-600">Aggregated ticket metrics and team performance</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active" value={stats?.totalActive ?? 0} />
        <StatCard label="Open" value={stats?.open ?? 0} />
        <StatCard label="Escalated" value={stats?.escalated ?? 0} tone="warning" />
        <StatCard label="SLA breached (active)" value={stats?.slaBreached ?? 0} tone="warning" />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Ticket volume</h2>
          <select
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as "day" | "week" | "month")}
          >
            <option value="day">By day</option>
            <option value="week">By week</option>
            <option value="month">By month</option>
          </select>
        </div>
        {volume.isLoading ? (
          <Spinner />
        ) : (
          <HorizontalBarChart
            items={(volume.data || []).slice(-12).map((r) => ({ label: r.period, value: r.count }))}
          />
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Tickets by category</h2>
          {categories.isLoading ? (
            <Spinner />
          ) : (
            <HorizontalBarChart
              items={(categories.data || []).map((c) => ({ label: c.category, value: c.count }))}
            />
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">SLA compliance</h2>
          {sla.isLoading ? (
            <Spinner />
          ) : (
            <DataTable
              rows={sla.data || []}
              rowKey={(r) => `${String(r.teamId)}-${r.priority}`}
              emptyMessage="No SLA data"
              columns={[
                { key: "priority", header: "Priority", render: (r) => r.priority },
                { key: "total", header: "Total", render: (r) => r.total },
                { key: "breached", header: "Breached", render: (r) => r.breached },
                {
                  key: "rate",
                  header: "Compliance %",
                  render: (r) => `${r.complianceRate}%`
                }
              ]}
            />
          )}
        </section>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Agent leaderboard</h2>
        {agents.isLoading ? (
          <Spinner />
        ) : (
          <DataTable<AgentPerformanceRow>
            rows={agents.data || []}
            rowKey={(r) => r.agentId}
            columns={[
              { key: "name", header: "Agent", render: (r) => r.name },
              { key: "email", header: "Email", render: (r) => r.email },
              { key: "resolved", header: "Resolved", render: (r) => r.ticketsResolved },
              {
                key: "avg",
                header: "Avg hours",
                render: (r) => r.avgResolutionHours ?? "—"
              }
            ]}
          />
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Team performance</h2>
        {teams.isLoading ? (
          <Spinner />
        ) : (
          <DataTable<TeamPerformanceRow>
            rows={teams.data || []}
            rowKey={(r) => r.teamId}
            columns={[
              { key: "name", header: "Team", render: (r) => r.teamName },
              { key: "open", header: "Open", render: (r) => r.openTickets },
              { key: "resolved", header: "Resolved", render: (r) => r.resolvedTickets },
              { key: "esc", header: "Escalated", render: (r) => r.escalatedQueue },
              {
                key: "avg",
                header: "Avg resolution (hrs)",
                render: (r) => r.avgResolutionHours ?? "—"
              }
            ]}
          />
        )}
      </section>
    </div>
  );
}
