import { useCallback, useMemo, useState, type ReactNode } from "react";
import Cookies from "js-cookie";

import instance from "../services/axios";
import { useApp } from "./useApp";
import { AuthContext, type AuthUser } from "./auth-context";

const TOKEN_COOKIE = "@TOKEN";
const USER_COOKIE = "user";

function readStoredUser(): AuthUser | null {
  const value = Cookies.get(USER_COOKIE);

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
    Cookies.remove(USER_COOKIE);
  }

  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { showToast } = useApp();
  const [user, setUser] = useState<AuthUser | null>(readStoredUser);
  const [token, setToken] = useState<string | null>(() => Cookies.get(TOKEN_COOKIE) ?? null);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    Cookies.remove(USER_COOKIE);
    Cookies.remove(TOKEN_COOKIE);
  }, []);

  const login = useCallback(
    async (tokenData: string, navigate: (path: string) => void) => {
      Cookies.set(TOKEN_COOKIE, tokenData, {
        expires: 1,
        sameSite: "strict",
      });

      try {
        const response = await instance.get<AuthUser>("/users/me");
        const authenticatedUser = response.data;

        setToken(tokenData);
        setUser(authenticatedUser);
        Cookies.set(USER_COOKIE, JSON.stringify(authenticatedUser), {
          expires: 1,
          sameSite: "strict",
        });

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
      isAuthenticated: Boolean(token),
      user,
      token,
      login,
      logout,
    }),
    [login, logout, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
