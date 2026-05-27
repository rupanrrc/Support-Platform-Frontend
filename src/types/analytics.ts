export interface TicketVolumeRow {
  period: string;
  count: number;
}

export interface AgentPerformanceRow {
  agentId: string;
  name: string;
  email: string;
  ticketsResolved: number;
  avgResolutionHours: number | null;
}

export interface TeamPerformanceRow {
  teamId: string;
  teamName: string;
  openTickets: number;
  resolvedTickets: number;
  escalatedQueue: number;
  avgResolutionHours: number | null;
}

export interface CategoryRow {
  category: string;
  count: number;
}

export interface SlaReportRow {
  teamId: string | null;
  priority: string;
  total: number;
  breached: number;
  complianceRate: number;
}

export interface ResolutionTimeRow {
  teamId: string | null;
  priority: string;
  count: number;
  avgResolutionHours: number;
}

export interface AnalyticsOverview {
  open: number;
  inProgress: number;
  pending: number;
  escalated: number;
  resolved: number;
  closed: number;
  slaBreached: number;
  totalActive: number;
}
