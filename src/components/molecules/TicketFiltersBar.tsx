import type { TicketFilters, TicketPriority, TicketStatus } from "@/types/ticket";

interface TicketFiltersBarProps {
  filters: TicketFilters;
  onChange: (next: TicketFilters) => void;
  showTeam?: boolean;
  teams?: { _id: string; name: string }[];
}

const statuses: (TicketStatus | "")[] = [
  "",
  "open",
  "in_progress",
  "pending",
  "escalated",
  "resolved",
  "closed"
];

const priorities: (TicketPriority | "")[] = ["", "low", "medium", "high", "critical"];

export function TicketFiltersBar({ filters, onChange, showTeam, teams }: TicketFiltersBarProps) {
  return (
    <div className="flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <label className="text-sm">
        <span className="mb-1 block text-slate-600">Status</span>
        <select
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          value={filters.status || ""}
          onChange={(e) =>
            onChange({ ...filters, status: (e.target.value as TicketStatus) || undefined, page: 1 })
          }
        >
          {statuses.map((s) => (
            <option key={s || "all"} value={s}>
              {s ? s.replace("_", " ") : "All statuses"}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        <span className="mb-1 block text-slate-600">Priority</span>
        <select
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          value={filters.priority || ""}
          onChange={(e) =>
            onChange({
              ...filters,
              priority: (e.target.value as TicketPriority) || undefined,
              page: 1
            })
          }
        >
          {priorities.map((p) => (
            <option key={p || "all"} value={p}>
              {p || "All priorities"}
            </option>
          ))}
        </select>
      </label>
      {showTeam && teams?.length ? (
        <label className="text-sm">
          <span className="mb-1 block text-slate-600">Team</span>
          <select
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={filters.teamId || ""}
            onChange={(e) => onChange({ ...filters, teamId: e.target.value || undefined, page: 1 })}
          >
            <option value="">All teams</option>
            {teams.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
      ) : null}
    </div>
  );
}
