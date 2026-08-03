import { createContext } from "react";

export type UserRole = "OWNER" | "ADMIN" | "OPERATOR";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId?: string;
}

export interface AuthContextValue {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  login: (token: string, navigate: (path: string) => void) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
