import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/api/analyticsApi";

export function useAnalyticsOverview() {
  return useQuery({
    queryKey: ["analytics", "overview"],
    queryFn: () => analyticsApi.overview()
  });
}

export function useTicketVolume(groupBy: "day" | "week" | "month" = "day") {
  return useQuery({
    queryKey: ["analytics", "ticket-volume", groupBy],
    queryFn: () => analyticsApi.ticketVolume({ groupBy })
  });
}

export function useAgentPerformance() {
  return useQuery({
    queryKey: ["analytics", "agent-performance"],
    queryFn: () => analyticsApi.agentPerformance()
  });
}

export function useTeamPerformance() {
  return useQuery({
    queryKey: ["analytics", "team-performance"],
    queryFn: () => analyticsApi.teamPerformance()
  });
}

export function useSlaReport() {
  return useQuery({
    queryKey: ["analytics", "sla"],
    queryFn: () => analyticsApi.sla()
  });
}

export function useCategoriesReport() {
  return useQuery({
    queryKey: ["analytics", "categories"],
    queryFn: () => analyticsApi.categories()
  });
}
