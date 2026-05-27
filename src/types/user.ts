export type UserRole = "customer" | "agent" | "manager" | "admin";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  teamId?: string | null;
  isActive: boolean;
  avatar?: string;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse extends AuthTokens {
  user: User;
}
