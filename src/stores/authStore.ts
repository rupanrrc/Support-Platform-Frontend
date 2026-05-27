import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/user";
import { authApi } from "@/api/authApi";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (body: {
    name: string;
    email: string;
    password: string;
    role?: string;
    teamId?: string | null;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<string | null>;
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const data = await authApi.login({ email, password });
        set({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          isAuthenticated: true
        });
      },

      register: async (body) => {
        const data = await authApi.register(body);
        set({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          isAuthenticated: true
        });
      },

      logout: async () => {
        const refreshToken = get().refreshToken;
        try {
          if (refreshToken) {
            await authApi.logout({ refreshToken });
          }
        } finally {
          get().clearAuth();
        }
      },

      refreshAccessToken: async () => {
        const refreshToken = get().refreshToken;
        if (!refreshToken) {
          get().clearAuth();
          return null;
        }
        try {
          const data = await authApi.refresh({ refreshToken });
          set({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            isAuthenticated: true
          });
          return data.accessToken;
        } catch {
          get().clearAuth();
          return null;
        }
      },

      setUser: (user) => set({ user }),
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken, isAuthenticated: true }),
      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false
        })
    }),
    {
      name: "support-auth",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
