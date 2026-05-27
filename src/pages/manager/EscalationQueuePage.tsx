import { useState } from "react";
import { useTickets } from "@/hooks/useTickets";
import { useAuthStore } from "@/stores/authStore";
import { TicketTable } from "@/components/organisms/TicketTable";
import { Pagination } from "@/components/molecules/Pagination";
import type { TicketFilters } from "@/types/ticket";

export function EscalationQueuePage() {
  const user = useAuthStore((s) => s.user);
  const [filters, setFilters] = useState<TicketFilters>({
    status: "escalated",
    page: 1,
    limit: 15
  });
  const { data, isLoading } = useTickets(filters);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Escalations</h1>
        <p className="mt-1 text-sm text-slate-600">Tickets escalated to your team</p>
      </div>

      <TicketTable
        tickets={data?.items || []}
        role={user.role}
        loading={isLoading}
        showCustomer
        showAgent
      />

      {data ? (
        <Pagination
          page={data.page}
          limit={data.limit}
          total={data.total}
          onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
        />
      ) : null}
    </div>
  );
}
