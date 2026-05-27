import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ticketsApi } from "@/api/ticketsApi";
import type { TicketFilters } from "@/types/ticket";

export function useTickets(filters?: TicketFilters) {
  return useQuery({
    queryKey: ["tickets", filters],
    queryFn: () => ticketsApi.list(filters)
  });
}

export function useTicket(id: string | undefined) {
  return useQuery({
    queryKey: ["ticket", id],
    queryFn: () => ticketsApi.getById(id!),
    enabled: Boolean(id)
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ticketsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    }
  });
}

export function useAssignTicket(ticketId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { agentId: string; teamId: string }) => ticketsApi.assign(ticketId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    }
  });
}

function useTicketMutation(ticketId: string, fn: (id: string) => Promise<unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => fn(ticketId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    }
  });
}

export function useResolveTicket(ticketId: string) {
  return useTicketMutation(ticketId, ticketsApi.resolve);
}

export function useCloseTicket(ticketId: string) {
  return useTicketMutation(ticketId, ticketsApi.close);
}

export function useReopenTicket(ticketId: string) {
  return useTicketMutation(ticketId, ticketsApi.reopen);
}

export function useEscalateTicket(ticketId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { targetTeamId: string; reason: string }) => ticketsApi.escalate(ticketId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    }
  });
}
