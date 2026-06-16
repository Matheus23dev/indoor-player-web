import { createContext, useContext, useState, type ReactNode } from "react";
import Cookies from "js-cookie";
import instance from "../services/axios";
import { jwtDecode } from "jwt-decode";
import { useApp } from "./app.context";

type DecodedToken = {
  sub: string;
};

type UserType = {
  nome: any;
  sector: any;
 
  data: any; id: number; name: string; email: string;  urlImageUser: string, portaria: { id: number; }
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: UserType | null;
  token: string | null;
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


  const isAuthenticated = !!token;

  const login = async (tokenData: string, navigate: (path: string) => void) => {
    setToken(tokenData);
    Cookies.set("@TOKEN", tokenData, { expires: 1 });

    try {
      const decoded: DecodedToken = jwtDecode(tokenData);
      const userId = decoded.sub;
      instance.defaults.headers.common["Authorization"] = `Bearer ${tokenData}`;

      const response = await instance.get(`/users/${userId}`);
      const user = response.data;
      console.log("Usuário carregado:", user);

      setUser(user);
      Cookies.set("user", JSON.stringify(user), { expires: 1 });

      navigate("/home");


    } catch (error) {
      showToast("Erro ao buscar dados do usuário", "error" );
      logout();

    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    Cookies.remove("user");
    Cookies.remove("@TOKEN");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
