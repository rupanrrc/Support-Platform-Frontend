import { create } from "zustand";
import { applyTheme, getInitialTheme, type Theme } from "@/lib/theme";

export interface ToastItem {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface UiState {
  sidebarOpen: boolean;
  theme: Theme;
  activeModal: string | null;
  toastQueue: ToastItem[];
  socketConnected: boolean;
  activeTicketId: string | null;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSocketConnected: (connected: boolean) => void;
  setActiveTicketId: (ticketId: string | null) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  openModal: (id: string) => void;
  closeModal: () => void;
  pushToast: (toast: Omit<ToastItem, "id">) => void;
  dismissToast: (id: string) => void;
}

let toastCounter = 0;

export const useUiStore = create<UiState>((set, get) => ({
  sidebarOpen: true,
  theme: getInitialTheme(),
  activeModal: null,
  toastQueue: [],
  socketConnected: false,
  activeTicketId: null,

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSocketConnected: (connected) => set({ socketConnected: connected }),
  setActiveTicketId: (ticketId) => set({ activeTicketId: ticketId }),

  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },

  toggleTheme: () => {
    const next = get().theme === "light" ? "dark" : "light";
    applyTheme(next);
    set({ theme: next });
  },

  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),

  pushToast: (toast) => {
    const id = `toast-${++toastCounter}`;
    set((s) => ({
      toastQueue: [...s.toastQueue, { ...toast, id }]
    }));
    setTimeout(() => {
      useUiStore.getState().dismissToast(id);
    }, 5000);
  },

  dismissToast: (id) =>
    set((s) => ({
      toastQueue: s.toastQueue.filter((t) => t.id !== id)
    }))
}));
