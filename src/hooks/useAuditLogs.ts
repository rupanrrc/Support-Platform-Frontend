import { useQuery } from "@tanstack/react-query";
import { auditLogsApi } from "@/api/auditLogsApi";

export function useAuditLogs(params?: {
  page?: number;
  limit?: number;
  targetModel?: string;
  action?: string;
}) {
  return useQuery({
    queryKey: ["auditlogs", params],
    queryFn: () => auditLogsApi.list(params)
  });
}
