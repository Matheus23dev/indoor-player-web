import { createContext, useContext, useState, ReactNode } from "react";
import Cookies from "js-cookie";
import instance from "../services/axios";
import { jwtDecode } from "jwt-decode";
import { useApp } from "./app.context";

type DecodedToken = {
  sub: string;
  roles: string[]
};

type UserType = {
  sector: any;
 
  data: any; id: number; name: string; email: string;  urlImageUser: string, portaria: { id: number; }
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: UserType | null;
  token: string | null;
  permissions: string[] | null;
  login: (token: string, navigate: (path: string) => void) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { showToast } = useApp();
  const [user, setUser] = useState<UserType | null>(() => {
    const cookieUser = Cookies.get("user");
    return cookieUser ? JSON.parse(cookieUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => Cookies.get("@TOKEN") || null);

  const [permissions, setPermissions] = useState<string[] | null>(() => {
    const cookiePerms = Cookies.get("permissions");
    return cookiePerms ? JSON.parse(cookiePerms) : null;
  });

  const isAuthenticated = !!token;

  const login = async (tokenData: string, navigate: (path: string) => void) => {
    setToken(tokenData);
    Cookies.set("@TOKEN", tokenData, { expires: 1 });

    try {
      const decoded: DecodedToken = jwtDecode(tokenData);
      const userId = Number(decoded.sub);
     console.log(decoded.roles);
      instance.defaults.headers.common["Authorization"] = `Bearer ${tokenData}`;

      const response = await instance.get(`/users/${decoded.roles[decoded.roles.length - 1]}/${userId}`);
      const user = response.data;
      console.log("Usuário carregado:", user);

      setUser(user);
      Cookies.set("user", JSON.stringify(user), { expires: 1 });

      const permissions = await fetchPermissions(userId); 
      setPermissions(permissions);
      Cookies.set("permissions", JSON.stringify(permissions), { expires: 7 });

      if (permissions.includes("checkincheckout:view")) {
        navigate("/home/checkincheckout");
      } else if (permissions.includes("history:view")) {
        navigate("/home/history");
      } else {
        showToast("Erro ao buscar dados do usuário", "error" );
        logout()
      }

    } catch (error) {
      showToast("Erro ao buscar dados do usuário", "error" );
      logout();
    }
  };

  const fetchPermissions = async (userId: number): Promise<string[]> => {
    const response = await instance.get(`/users/permissions/${userId}`);
    const permissions = response.data;

    if (!Array.isArray(permissions)) showToast("Permissões inválidas", "error" );
    return permissions;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setPermissions(null);

    Cookies.remove("user");
    Cookies.remove("@TOKEN");
    Cookies.remove("permissions");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, permissions, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
