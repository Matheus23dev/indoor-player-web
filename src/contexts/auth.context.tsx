import { useCallback, useMemo, useState, type ReactNode } from "react";

import instance from "../services/axios";
import {
  clearAuthSession,
  readAuthToken,
  readAuthUser,
  storeAuthToken,
  storeAuthUser,
} from "../lib/authSession";
import { useApp } from "./useApp";
import { AuthContext, type AuthUser } from "./auth-context";

interface AuthSessionState {
  token: string | null;
  user: AuthUser | null;
}

const EMPTY_SESSION: AuthSessionState = {
  token: null,
  user: null,
};

function readStoredUser(): AuthUser | null {
  const value = readAuthUser();

  if (!value) {
    return null;
  }

  try {
    const user = JSON.parse(value) as Partial<AuthUser>;

    if (
      typeof user.id === "string" &&
      typeof user.name === "string" &&
      typeof user.email === "string" &&
      (user.role === "OWNER" || user.role === "ADMIN" || user.role === "OPERATOR")
    ) {
      return user as AuthUser;
    }
  } catch {
    return null;
  }

  return null;
}

function readStoredSession(): AuthSessionState {
  const token = readAuthToken();
  const user = readStoredUser();

  if (!token || !user) {
    clearAuthSession();
    return EMPTY_SESSION;
  }

  return { token, user };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { showToast } = useApp();
  const [session, setSession] = useState<AuthSessionState>(readStoredSession);

  const logout = useCallback(() => {
    setSession(EMPTY_SESSION);
    clearAuthSession();
  }, []);

  const login = useCallback(
    async (tokenData: string, navigate: (path: string) => void) => {
      storeAuthToken(tokenData);

      try {
        const response = await instance.get<AuthUser>("/users/me");
        const authenticatedUser = response.data;

        storeAuthUser(JSON.stringify(authenticatedUser));
        setSession({ token: tokenData, user: authenticatedUser });

        navigate("/home/dashboard");
      } catch (error) {
        logout();
        showToast("Erro ao buscar dados do usuário", "error");
        throw error;
      }
    },
    [logout, showToast],
  );

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(session.token && session.user),
      user: session.user,
      token: session.token,
      login,
      logout,
    }),
    [login, logout, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
