import { useParams } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useTicket } from "@/hooks/useTickets";
import { useTicketRoom } from "@/hooks/useSocket";
import { Badge } from "@/components/atoms/Badge";
import { Spinner } from "@/components/atoms/Spinner";
import { BackLink } from "@/components/molecules/BackLink";
import { ErrorAlert } from "@/components/molecules/ErrorAlert";
import { MessageThread } from "@/components/organisms/MessageThread";
import { TicketActionPanel } from "@/components/organisms/TicketActionPanel";
import { formatDate } from "@/utils/formatDate";
import { refName } from "@/utils/ticketDisplay";
import { getDashboardPath } from "@/utils/rolePaths";
import { getTicketsListPath } from "@/utils/ticketPaths";
import { PRIORITY_BADGE, PRIORITY_LABELS, STATUS_BADGE, STATUS_LABELS } from "@/utils/ticketStatus";

export function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);
  const { data: ticket, isLoading, isError, refetch } = useTicket(id);
  useTicketRoom(id);

  if (!user) return null;

  const backTo = getTicketsListPath(user.role) ?? getDashboardPath(user.role);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <Spinner className="h-8 w-8" />
        <p className="text-sm text-slate-500">Loading ticket…</p>
      </div>
    );
  }

  if (isError || !ticket) {
    return (
      <div className="mx-auto max-w-lg space-y-4">
        <BackLink to={backTo} label="Back to tickets" />
        <ErrorAlert
          title="Ticket unavailable"
          message="This ticket could not be loaded or you may not have access."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <BackLink to={backTo} label="Back to tickets" />

      <div>
        <p className="text-sm font-medium text-brand-600">{ticket.ticketNumber}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{ticket.title}</h1>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge className={STATUS_BADGE[ticket.status]}>{STATUS_LABELS[ticket.status]}</Badge>
          <Badge className={PRIORITY_BADGE[ticket.priority]}>{PRIORITY_LABELS[ticket.priority]}</Badge>
          {ticket.slaBreached ? <Badge className="bg-red-100 text-red-800">SLA breached</Badge> : null}
        </div>
      </div>

      <TicketActionPanel ticket={ticket} role={user.role} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 font-semibold text-slate-900">Description</h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
              {ticket.description}
            </p>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-semibold text-slate-900">Conversation</h2>
            <MessageThread ticketId={ticket._id} />
          </section>
        </div>

        <aside className="space-y-4">
          <MetaCard label="Category" value={ticket.category} />
          <MetaCard label="Customer" value={refName(ticket.customerId)} />
          <MetaCard label="Assigned agent" value={refName(ticket.assignedAgentId, "Unassigned")} />
          <MetaCard label="Team" value={refName(ticket.assignedTeamId, "—")} />
          <MetaCard label="SLA deadline" value={formatDate(ticket.slaDeadline)} />
          <MetaCard label="Created" value={formatDate(ticket.createdAt)} />
          <MetaCard label="Updated" value={formatDate(ticket.updatedAt)} />
          {ticket.escalationReason ? (
            <MetaCard label="Escalation" value={ticket.escalationReason} />
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm text-slate-800">{value}</p>
    </div>
  );
}
