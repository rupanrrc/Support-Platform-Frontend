import type { TicketPriority, TicketStatus } from "@/types/ticket";

export const STATUS_LABELS: Record<TicketStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  pending: "Pending",
  escalated: "Escalated",
  resolved: "Resolved",
  closed: "Closed"
};

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical"
};

export const STATUS_BADGE: Record<TicketStatus, string> = {
  open: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
  in_progress: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200",
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  escalated: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200",
  resolved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  closed: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
};

export const PRIORITY_BADGE: Record<TicketPriority, string> = {
  low: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  medium: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
  high: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
  critical: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200"
};
