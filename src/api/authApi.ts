import { axiosInstance } from "./axiosInstance";
import type { LoginResponse, User } from "@/types/user";

export interface RegistrationStatus {
  open: boolean;
  mode: "bootstrap" | "customer";
  allowedRoles: string[];
  message: string;
}

export const authApi = {
  registrationStatus: () =>
    axiosInstance
      .get<RegistrationStatus>("/api/auth/registration-status")
      .then((r) => r.data),
  login: (body: { email: string; password: string }) =>
    axiosInstance.post<LoginResponse>("/api/auth/login", body).then((r) => r.data),

  logout: (body: { refreshToken: string }) =>
    axiosInstance.post("/api/auth/logout", body).then((r) => r.data),

  refresh: (body: { refreshToken: string }) =>
    axiosInstance
      .post<{ accessToken: string; refreshToken: string }>("/api/auth/refresh", body)
      .then((r) => r.data),

  register: (body: {
    name: string;
    email: string;
    password: string;
    role?: string;
    teamId?: string | null;
  }) => axiosInstance.post<LoginResponse>("/api/auth/register", body).then((r) => r.data),

  forgotPassword: (body: { email: string }) =>
    axiosInstance.post<{ message: string }>("/api/auth/forgot-password", body).then((r) => r.data),

  resetPassword: (body: { token: string; password: string }) =>
    axiosInstance.post<{ message: string }>("/api/auth/reset-password", body).then((r) => r.data),

  me: () => axiosInstance.get<{ user: User }>("/api/auth/me").then((r) => r.data)
};
