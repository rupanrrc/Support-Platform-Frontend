export type NotificationType =
  | "ticket_created"
  | "ticket_assigned"
  | "ticket_escalated"
  | "ticket_resolved"
  | "message_received"
  | "mention"
  | "sla_breach_warning"
  | "team_assigned";

export interface Notification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  ticketId?: string | null;
  createdAt: string;
}

export interface NotificationListResponse {
  items: Notification[];
  total: number;
  page: number;
  limit: number;
  unreadCount: number;
}
