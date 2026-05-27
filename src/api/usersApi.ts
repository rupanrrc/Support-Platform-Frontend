import { axiosInstance } from "./axiosInstance";
import type { User } from "@/types/user";

export interface UserListResponse {
  items: User[];
  total: number;
  page: number;
  limit: number;
}

export const usersApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) =>
    axiosInstance.get<UserListResponse>("/api/users", { params }).then((r) => r.data),

  getById: (id: string) =>
    axiosInstance.get<{ user: User }>(`/api/users/${id}`).then((r) => r.data.user),

  create: (body: Record<string, unknown>) =>
    axiosInstance.post<{ user: User }>("/api/users", body).then((r) => r.data.user),

  update: (id: string, body: Record<string, unknown>) =>
    axiosInstance.patch<{ user: User }>(`/api/users/${id}`, body).then((r) => r.data.user),

  remove: (id: string) =>
    axiosInstance.delete<{ user: User }>(`/api/users/${id}`).then((r) => r.data.user),

  updateRole: (id: string, role: string) =>
    axiosInstance.patch<{ user: User }>(`/api/users/${id}/role`, { role }).then((r) => r.data.user),

  assignTeam: (id: string, teamId: string | null) =>
    axiosInstance.patch<{ user: User }>(`/api/users/${id}/team`, { teamId }).then((r) => r.data.user),

  updateProfile: (body: { name?: string; avatar?: string }) =>
    axiosInstance.patch<{ user: User }>("/api/users/me/profile", body).then((r) => r.data.user),

  changePassword: (body: { currentPassword: string; newPassword: string }) =>
    axiosInstance.patch<{ success: boolean }>("/api/users/me/password", body).then((r) => r.data)
};
