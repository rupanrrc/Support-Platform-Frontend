import { axiosInstance } from "./axiosInstance";
import type { Ticket, TicketFilters, TicketListResponse } from "@/types/ticket";

export const ticketsApi = {
  list: (params?: TicketFilters) =>
    axiosInstance.get<TicketListResponse>("/api/tickets", { params }).then((r) => r.data),

  getById: (id: string) =>
    axiosInstance.get<{ ticket: Ticket }>(`/api/tickets/${id}`).then((r) => r.data.ticket),

  create: (body: Record<string, unknown>) =>
    axiosInstance.post<{ ticket: Ticket }>("/api/tickets", body).then((r) => r.data.ticket),

  update: (id: string, body: Record<string, unknown>) =>
    axiosInstance.patch<{ ticket: Ticket }>(`/api/tickets/${id}`, body).then((r) => r.data.ticket),

  remove: (id: string) => axiosInstance.delete(`/api/tickets/${id}`).then((r) => r.data),

  assign: (id: string, body: { agentId: string; teamId: string }) =>
    axiosInstance.patch<{ ticket: Ticket }>(`/api/tickets/${id}/assign`, body).then((r) => r.data.ticket),

  escalate: (id: string, body: { targetTeamId: string; reason: string }) =>
    axiosInstance.patch<{ ticket: Ticket }>(`/api/tickets/${id}/escalate`, body).then((r) => r.data.ticket),

  resolve: (id: string) =>
    axiosInstance.patch<{ ticket: Ticket }>(`/api/tickets/${id}/resolve`).then((r) => r.data.ticket),

  reopen: (id: string) =>
    axiosInstance.patch<{ ticket: Ticket }>(`/api/tickets/${id}/reopen`).then((r) => r.data.ticket),

  close: (id: string) =>
    axiosInstance.patch<{ ticket: Ticket }>(`/api/tickets/${id}/close`).then((r) => r.data.ticket),

  addWatcher: (id: string, userId: string) =>
    axiosInstance.post<{ ticket: Ticket }>(`/api/tickets/${id}/watchers`, { userId }).then((r) => r.data.ticket),

  removeWatcher: (id: string, userId: string) =>
    axiosInstance
      .delete<{ ticket: Ticket }>(`/api/tickets/${id}/watchers/${userId}`)
      .then((r) => r.data.ticket),

  history: (id: string) =>
    axiosInstance.get<{ logs: unknown[] }>(`/api/tickets/${id}/history`).then((r) => r.data.logs)
};
