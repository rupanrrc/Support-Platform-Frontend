import { useState } from "react";
import { useTickets } from "@/hooks/useTickets";
import { useTeams } from "@/hooks/useTeams";
import { TicketTable } from "@/components/organisms/TicketTable";
import { TicketFiltersBar } from "@/components/molecules/TicketFiltersBar";
import { Pagination } from "@/components/molecules/Pagination";
import type { TicketFilters } from "@/types/ticket";

export function AdminTicketsPage() {
  const [filters, setFilters] = useState<TicketFilters>({ page: 1, limit: 15 });
  const { data, isLoading } = useTickets(filters);
  const { data: teams } = useTeams();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">All tickets</h1>
        <p className="mt-1 text-sm text-slate-600">Platform-wide ticket list</p>
      </div>

      <TicketFiltersBar
        filters={filters}
        onChange={setFilters}
        showTeam
        teams={(teams || []).map((t) => ({ _id: t._id, name: t.name }))}
      />

      <TicketTable
        tickets={data?.items || []}
        role="admin"
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
