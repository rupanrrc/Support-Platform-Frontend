import { axiosInstance } from "./axiosInstance";
import type {
  AgentPerformanceRow,
  AnalyticsOverview,
  CategoryRow,
  ResolutionTimeRow,
  SlaReportRow,
  TeamPerformanceRow,
  TicketVolumeRow
} from "@/types/analytics";

export const analyticsApi = {
  overview: () => axiosInstance.get<AnalyticsOverview>("/api/analytics/overview").then((r) => r.data),

  ticketVolume: (params?: { from?: string; to?: string; groupBy?: string }) =>
    axiosInstance
      .get<{ data: TicketVolumeRow[] }>("/api/analytics/ticket-volume", { params })
      .then((r) => r.data.data),

  resolutionTime: (params?: Record<string, string | undefined>) =>
    axiosInstance
      .get<{ data: ResolutionTimeRow[] }>("/api/analytics/resolution-time", { params })
      .then((r) => r.data.data),

  agentPerformance: () =>
    axiosInstance
      .get<{ data: AgentPerformanceRow[] }>("/api/analytics/agent-performance")
      .then((r) => r.data.data),

  teamPerformance: () =>
    axiosInstance
      .get<{ data: TeamPerformanceRow[] }>("/api/analytics/team-performance")
      .then((r) => r.data.data),

  sla: (params?: Record<string, string | undefined>) =>
    axiosInstance.get<{ data: SlaReportRow[] }>("/api/analytics/sla", { params }).then((r) => r.data.data),

  categories: () =>
    axiosInstance.get<{ data: CategoryRow[] }>("/api/analytics/categories").then((r) => r.data.data)
};
