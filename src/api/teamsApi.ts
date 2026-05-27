import { axiosInstance } from "./axiosInstance";
import type { Team } from "@/types/team";
import type { Ticket } from "@/types/ticket";

export const teamsApi = {
  list: () => axiosInstance.get<{ teams: Team[] }>("/api/teams").then((r) => r.data.teams),

  getById: (id: string) =>
    axiosInstance.get<{ team: Team }>(`/api/teams/${id}`).then((r) => r.data.team),

  create: (body: { name: string; description?: string; managerId?: string | null }) =>
    axiosInstance.post<{ team: Team }>("/api/teams", body).then((r) => r.data.team),

  update: (id: string, body: Record<string, unknown>) =>
    axiosInstance.patch<{ team: Team }>(`/api/teams/${id}`, body).then((r) => r.data.team),

  remove: (id: string) =>
    axiosInstance.delete<{ team: Team }>(`/api/teams/${id}`).then((r) => r.data.team),

  addMember: (id: string, userId: string) =>
    axiosInstance.post<{ team: Team }>(`/api/teams/${id}/members`, { userId }).then((r) => r.data.team),

  removeMember: (id: string, uid: string) =>
    axiosInstance.delete<{ team: Team }>(`/api/teams/${id}/members/${uid}`).then((r) => r.data.team),

  queue: (id: string, params?: { status?: string }) =>
    axiosInstance
      .get<{ tickets: Ticket[] }>(`/api/teams/${id}/queue`, { params })
      .then((r) => r.data.tickets),

  stats: (id: string) =>
    axiosInstance.get<Record<string, unknown>>(`/api/teams/${id}/stats`).then((r) => r.data)
};
