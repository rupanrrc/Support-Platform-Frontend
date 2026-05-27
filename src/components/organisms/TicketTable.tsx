import { Link } from "react-router-dom";
import type { Ticket } from "@/types/ticket";
import type { UserRole } from "@/types/user";
import { Badge } from "@/components/atoms/Badge";
import { Spinner } from "@/components/atoms/Spinner";
import { EmptyState } from "@/components/molecules/EmptyState";
import { formatDate, formatRelative } from "@/utils/formatDate";
import { getTicketDetailPath } from "@/utils/ticketPaths";
import { refName } from "@/utils/ticketDisplay";
import { PRIORITY_BADGE, PRIORITY_LABELS, STATUS_BADGE, STATUS_LABELS } from "@/utils/ticketStatus";

interface TicketTableProps {
  tickets: Ticket[];
  role: UserRole;
  loading?: boolean;
  showCustomer?: boolean;
  showAgent?: boolean;
}

export function TicketTable({
  tickets,
  role,
  loading,
  showCustomer = false,
  showAgent = false
}: TicketTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (tickets.length === 0) {
    return <EmptyState title="No tickets" description="Nothing matches your filters yet." />;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Ticket</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Priority</th>
            {showCustomer ? <th className="px-4 py-3">Customer</th> : null}
            {showAgent ? <th className="px-4 py-3">Agent</th> : null}
            <th className="px-4 py-3">Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tickets.map((ticket) => (
            <tr key={ticket._id} className="hover:bg-slate-50">
              <td className="px-4 py-3">
                <Link
                  to={getTicketDetailPath(role, ticket._id)}
                  className="font-medium text-brand-600 hover:underline"
                >
                  {ticket.ticketNumber}
                </Link>
                <p className="mt-0.5 max-w-xs truncate text-slate-700">{ticket.title}</p>
              </td>
              <td className="px-4 py-3">
                <Badge className={STATUS_BADGE[ticket.status]}>{STATUS_LABELS[ticket.status]}</Badge>
              </td>
              <td className="px-4 py-3">
                <Badge className={PRIORITY_BADGE[ticket.priority]}>
                  {PRIORITY_LABELS[ticket.priority]}
                </Badge>
                {ticket.slaBreached ? (
                  <Badge className="ml-1 bg-red-100 text-red-800">SLA</Badge>
                ) : null}
              </td>
              {showCustomer ? (
                <td className="px-4 py-3 text-slate-600">{refName(ticket.customerId)}</td>
              ) : null}
              {showAgent ? (
                <td className="px-4 py-3 text-slate-600">{refName(ticket.assignedAgentId, "Unassigned")}</td>
              ) : null}
              <td className="px-4 py-3 text-slate-600">
                <span title={formatDate(ticket.updatedAt)}>{formatRelative(ticket.updatedAt)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
