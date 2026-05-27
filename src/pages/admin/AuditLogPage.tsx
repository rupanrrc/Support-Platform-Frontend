import { useState } from "react";
import { useAuditLogs } from "@/hooks/useAuditLogs";
import { DataTable } from "@/components/molecules/DataTable";
import { Pagination } from "@/components/molecules/Pagination";
import { Spinner } from "@/components/atoms/Spinner";
import { formatDate } from "@/utils/formatDate";
import type { AuditLogEntry } from "@/api/auditLogsApi";

export function AuditLogPage() {
  const [page, setPage] = useState(1);
  const [targetModel, setTargetModel] = useState("");
  const { data, isLoading } = useAuditLogs({
    page,
    limit: 20,
    targetModel: targetModel || undefined
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Audit logs</h1>
        <p className="mt-1 text-sm text-slate-600">Immutable record of platform actions (admin only)</p>
      </div>

      <label className="text-sm">
        <span className="text-slate-600">Target model</span>
        <select
          className="ml-2 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          value={targetModel}
          onChange={(e) => {
            setTargetModel(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All</option>
          <option value="Ticket">Ticket</option>
          <option value="User">User</option>
          <option value="Team">Team</option>
        </select>
      </label>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <>
          <DataTable<AuditLogEntry>
            rows={data?.items || []}
            rowKey={(l) => l._id}
            columns={[
              { key: "when", header: "When", render: (l) => formatDate(l.createdAt) },
              { key: "action", header: "Action", render: (l) => l.action },
              { key: "actor", header: "Actor role", render: (l) => l.actorRole || "—" },
              { key: "target", header: "Target", render: (l) => `${l.targetModel}:${l.targetId.slice(-6)}` }
            ]}
          />
          {data ? (
            <Pagination page={data.page} limit={data.limit} total={data.total} onPageChange={setPage} />
          ) : null}
        </>
      )}
    </div>
  );
}
