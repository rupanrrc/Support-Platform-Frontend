import type { UserRole } from "@/types/user";

const ticketBaseByRole: Record<UserRole, string> = {
  customer: "/customer/tickets",
  agent: "/agent/tickets",
  manager: "/manager/tickets",
  admin: "/admin/tickets"
};

export function getTicketDetailPath(role: UserRole, ticketId: string): string {
  return `${ticketBaseByRole[role]}/${ticketId}`;
}

export function getTicketsListPath(role: UserRole): string | null {
  if (role === "customer") return "/customer/tickets";
  if (role === "agent") return "/agent/queue";
  if (role === "manager") return "/manager/escalations";
  if (role === "admin") return "/admin/tickets";
  return null;
}
