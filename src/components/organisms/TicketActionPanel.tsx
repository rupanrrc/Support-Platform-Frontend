import { FormEvent, useState } from "react";
import type { Ticket } from "@/types/ticket";
import type { UserRole } from "@/types/user";
import { Button } from "@/components/atoms/Button";
import { Modal, ModalActions } from "@/components/molecules/Modal";
import {
  useAssignTicket,
  useCloseTicket,
  useEscalateTicket,
  useReopenTicket,
  useResolveTicket
} from "@/hooks/useTickets";
import { useTeams } from "@/hooks/useTeams";
import { useAgents } from "@/hooks/useUsers";
import { useAuthStore } from "@/stores/authStore";
import { getApiErrorMessage } from "@/api/axiosInstance";
import { useUiStore } from "@/stores/uiStore";
import { refId } from "@/utils/ticketDisplay";

interface TicketActionPanelProps {
  ticket: Ticket;
  role: UserRole;
}

export function TicketActionPanel({ ticket, role }: TicketActionPanelProps) {
  const pushToast = useUiStore((s) => s.pushToast);
  const isStaff = role === "agent" || role === "manager" || role === "admin";
  const isTerminal = ticket.status === "resolved" || ticket.status === "closed";

  const resolve = useResolveTicket(ticket._id);
  const close = useCloseTicket(ticket._id);
  const reopen = useReopenTicket(ticket._id);
  const assign = useAssignTicket(ticket._id);
  const escalate = useEscalateTicket(ticket._id);

  const [assignOpen, setAssignOpen] = useState(false);
  const [escalateOpen, setEscalateOpen] = useState(false);
  const [agentId, setAgentId] = useState(refId(ticket.assignedAgentId) || "");
  const [teamId, setTeamId] = useState(refId(ticket.assignedTeamId) || "");
  const [targetTeamId, setTargetTeamId] = useState("");
  const [escalationReason, setEscalationReason] = useState("");

  const currentUser = useAuthStore((s) => s.user);
  const { data: teams } = useTeams();
  const canListAgents = role === "manager" || role === "admin";
  const { data: agents } = useAgents(canListAgents);
  const agentOptions =
    role === "agent" && currentUser ? [currentUser] : agents || [];

  if (!isStaff) return null;

  const run = async (fn: () => Promise<unknown>, success: string) => {
    try {
      await fn();
      pushToast({ type: "success", message: success });
    } catch (err) {
      pushToast({ type: "error", message: getApiErrorMessage(err) });
    }
  };

  const handleAssign = async (e: FormEvent) => {
    e.preventDefault();
    if (!agentId || !teamId) return;
    try {
      await assign.mutateAsync({ agentId, teamId });
      pushToast({ type: "success", message: "Ticket assigned" });
      setAssignOpen(false);
    } catch (err) {
      pushToast({ type: "error", message: getApiErrorMessage(err) });
    }
  };

  const handleEscalate = async (e: FormEvent) => {
    e.preventDefault();
    if (!targetTeamId || escalationReason.trim().length < 3) return;
    try {
      await escalate.mutateAsync({ targetTeamId, reason: escalationReason.trim() });
      pushToast({ type: "success", message: "Ticket escalated" });
      setEscalateOpen(false);
    } catch (err) {
      pushToast({ type: "error", message: getApiErrorMessage(err) });
    }
  };

  return (
    <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-4">
      {!isTerminal && ticket.status !== "resolved" ? (
        <Button onClick={() => run(() => resolve.mutateAsync(), "Ticket resolved")} loading={resolve.isPending}>
          Resolve
        </Button>
      ) : null}
      {ticket.status === "resolved" ? (
        <Button onClick={() => run(() => close.mutateAsync(), "Ticket closed")} loading={close.isPending}>
          Close
        </Button>
      ) : null}
      {(ticket.status === "resolved" || ticket.status === "closed") ? (
        <Button
          variant="secondary"
          onClick={() => run(() => reopen.mutateAsync(), "Ticket reopened")}
          loading={reopen.isPending}
        >
          Reopen
        </Button>
      ) : null}
      <Button variant="secondary" onClick={() => setAssignOpen(true)}>
        Assign
      </Button>
      <Button variant="secondary" onClick={() => setEscalateOpen(true)}>
        Escalate
      </Button>

      <Modal
        open={assignOpen}
        title="Assign ticket"
        onClose={() => setAssignOpen(false)}
        footer={
          <ModalActions
            onCancel={() => setAssignOpen(false)}
            onConfirm={() => {
              const form = document.getElementById("assign-form") as HTMLFormElement | null;
              form?.requestSubmit();
            }}
            confirmLabel="Assign"
            loading={assign.isPending}
          />
        }
      >
        <form id="assign-form" onSubmit={handleAssign} className="space-y-3">
          <label className="block text-sm">
            <span className="text-slate-600">Team</span>
            <select
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              required
            >
              <option value="">Select team</option>
              {(teams || []).map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-slate-600">Agent</span>
            <select
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              required
            >
              <option value="">Select agent</option>
              {agentOptions.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.name} ({a.email})
                </option>
              ))}
            </select>
          </label>
        </form>
      </Modal>

      <Modal
        open={escalateOpen}
        title="Escalate ticket"
        onClose={() => setEscalateOpen(false)}
        footer={
          <ModalActions
            onCancel={() => setEscalateOpen(false)}
            onConfirm={() => {
              const form = document.getElementById("escalate-form") as HTMLFormElement | null;
              form?.requestSubmit();
            }}
            confirmLabel="Escalate"
            loading={escalate.isPending}
          />
        }
      >
        <form id="escalate-form" onSubmit={handleEscalate} className="space-y-3">
          <label className="block text-sm">
            <span className="text-slate-600">Target team</span>
            <select
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={targetTeamId}
              onChange={(e) => setTargetTeamId(e.target.value)}
              required
            >
              <option value="">Select team</option>
              {(teams || []).map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-slate-600">Reason</span>
            <textarea
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              rows={3}
              value={escalationReason}
              onChange={(e) => setEscalationReason(e.target.value)}
              required
            />
          </label>
        </form>
      </Modal>
    </div>
  );
}
