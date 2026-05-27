import { useState } from "react";
import { Link } from "react-router-dom";
import { useTickets } from "@/hooks/useTickets";
import { useAuthStore } from "@/stores/authStore";
import { TicketTable } from "@/components/organisms/TicketTable";
import { TicketFiltersBar } from "@/components/molecules/TicketFiltersBar";
import { Pagination } from "@/components/molecules/Pagination";
import { Button } from "@/components/atoms/Button";
import type { TicketFilters } from "@/types/ticket";

export function MyTicketsPage() {
  const user = useAuthStore((s) => s.user);
  const [filters, setFilters] = useState<TicketFilters>({ page: 1, limit: 10 });
  const { data, isLoading } = useTickets(filters);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">My tickets</h1>
          <p className="mt-1 text-sm text-slate-600">Track and manage your support requests</p>
        </div>
        <Link to="/customer/tickets/new">
          <Button>New ticket</Button>
        </Link>
      </div>

      <TicketFiltersBar filters={filters} onChange={setFilters} />

      <TicketTable tickets={data?.items || []} role={user.role} loading={isLoading} />

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
