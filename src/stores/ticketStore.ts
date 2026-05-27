import { create } from "zustand";
import type { TicketFilters, TicketPriority, TicketStatus } from "@/types/ticket";

interface TicketUiState {
  filters: TicketFilters;
  sortBy: "createdAt" | "priority" | "status";
  currentPage: number;
  selectedTicketId: string | null;
  setFilters: (filters: Partial<TicketFilters>) => void;
  setSort: (sortBy: TicketUiState["sortBy"]) => void;
  setPage: (page: number) => void;
  selectTicket: (ticketId: string | null) => void;
  resetFilters: () => void;
}

const defaultFilters: TicketFilters = {
  page: 1,
  limit: 20
};

export const useTicketStore = create<TicketUiState>((set) => ({
  filters: { ...defaultFilters },
  sortBy: "createdAt",
  currentPage: 1,
  selectedTicketId: null,

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters, page: filters.page ?? 1 },
      currentPage: filters.page ?? 1
    })),

  setSort: (sortBy) => set({ sortBy }),

  setPage: (page) =>
    set((state) => ({
      currentPage: page,
      filters: { ...state.filters, page }
    })),

  selectTicket: (ticketId) => set({ selectedTicketId: ticketId }),

  resetFilters: () =>
    set({
      filters: { ...defaultFilters },
      currentPage: 1,
      selectedTicketId: null
    })
}));

export type { TicketStatus, TicketPriority };
