import type { UserRole } from "./user";

export interface MessageAttachment {
  filename: string;
  url: string;
  mimetype: string;
  size?: number;
}

export interface Message {
  _id: string;
  ticketId: string;
  senderId: string | { _id: string; name: string; email: string; role: UserRole };
  senderRole: UserRole;
  content: string;
  isInternal: boolean;
  attachments?: MessageAttachment[];
  readBy?: string[];
  createdAt: string;
}
