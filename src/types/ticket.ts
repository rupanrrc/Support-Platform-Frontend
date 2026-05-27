export type TicketStatus =
  | "open"
  | "in_progress"
  | "pending"
  | "escalated"
  | "resolved"
  | "closed";

export type TicketPriority = "low" | "medium" | "high" | "critical";

export interface TicketAttachment {
  filename: string;
  url: string;
  mimetype: string;
  size: number;
}

export interface Ticket {
  _id: string;
  ticketNumber: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  customerId: string | { _id: string; name: string; email: string };
  assignedAgentId?: string | { _id: string; name: string; email: string } | null;
  assignedTeamId?: string | { _id: string; name: string; slug: string } | null;
  escalatedToTeamId?: string | null;
  escalationReason?: string;
  escalatedAt?: string | null;
  watchers?: string[];
  attachments?: TicketAttachment[];
  tags?: string[];
  resolvedAt?: string | null;
  closedAt?: string | null;
  slaDeadline: string;
  slaBreached: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TicketListResponse {
  items: Ticket[];
  total: number;
  page: number;
  limit: number;
}

export interface TicketFilters {
  status?: TicketStatus;
  priority?: TicketPriority;
  teamId?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}
