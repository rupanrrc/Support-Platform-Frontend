import type { Message } from "./message";
import type { Notification } from "./notification";
import type { Ticket } from "./ticket";

export interface SocketTicketPayload {
  ticket: Partial<Ticket> & { _id: string; ticketNumber?: string };
}

export interface SocketMessagePayload {
  message: Message;
}

export interface SocketNotificationPayload {
  notification: Notification;
}

export interface TicketUpdatedPayload {
  ticketId: string;
  changes: Record<string, unknown>;
}

export interface TicketStatusPayload {
  ticketId: string;
  status: string;
}

export interface TicketResolvedPayload {
  ticketId: string;
}

export interface TypingPayload {
  ticketId: string;
  user: { id: string; name: string };
}

export interface StopTypingPayload {
  ticketId: string;
  userId: string;
}
