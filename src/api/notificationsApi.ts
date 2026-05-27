import { axiosInstance } from "./axiosInstance";
import type { NotificationListResponse } from "@/types/notification";
import type { Notification } from "@/types/notification";

export const notificationsApi = {
  list: (params?: { page?: number; limit?: number; isRead?: boolean }) =>
    axiosInstance
      .get<NotificationListResponse>("/api/notifications", { params })
      .then((r) => r.data),

  markRead: (id: string) =>
    axiosInstance
      .patch<{ notification: Notification }>(`/api/notifications/${id}/read`)
      .then((r) => r.data.notification),

  markAllRead: () =>
    axiosInstance.patch<{ modifiedCount: number }>("/api/notifications/read-all").then((r) => r.data),

  remove: (id: string) => axiosInstance.delete(`/api/notifications/${id}`)
};
