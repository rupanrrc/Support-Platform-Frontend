import { axiosInstance } from "./axiosInstance";
import type { Message } from "@/types/message";

export const messagesApi = {
  list: (ticketId: string) =>
    axiosInstance
      .get<{ messages: Message[] }>(`/api/tickets/${ticketId}/messages`)
      .then((r) => r.data.messages),

  create: (ticketId: string, body: { content: string; isInternal?: boolean }) =>
    axiosInstance
      .post<{ message: Message }>(`/api/tickets/${ticketId}/messages`, body)
      .then((r) => r.data.message),

  markRead: (ticketId: string) =>
    axiosInstance.post(`/api/tickets/${ticketId}/messages/read`).then((r) => r.data),

  update: (ticketId: string, messageId: string, content: string) =>
    axiosInstance
      .patch<{ message: Message }>(`/api/tickets/${ticketId}/messages/${messageId}`, { content })
      .then((r) => r.data.message),

  remove: (ticketId: string, messageId: string) =>
    axiosInstance.delete(`/api/tickets/${ticketId}/messages/${messageId}`)
};
