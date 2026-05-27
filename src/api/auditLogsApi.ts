import { axiosInstance } from "./axiosInstance";

export interface AuditLogEntry {
  _id: string;
  action: string;
  actorId?: string;
  actorRole?: string;
  targetId: string;
  targetModel: string;
  before?: unknown;
  after?: unknown;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface AuditLogListResponse {
  items: AuditLogEntry[];
  total: number;
  page: number;
  limit: number;
}

export const auditLogsApi = {
  list: (params?: Record<string, string | number | undefined>) =>
    axiosInstance.get<AuditLogListResponse>("/api/auditlogs", { params }).then((r) => r.data),

  getById: (id: string) =>
    axiosInstance.get<{ log: AuditLogEntry }>(`/api/auditlogs/${id}`).then((r) => r.data.log)
};
