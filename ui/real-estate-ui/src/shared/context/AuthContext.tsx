// src/shared/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { login as loginApi } from "../../infrastructure/api-client/authApi";
import { jwtDecode } from "jwt-decode";

// Senin JWT'deki role alanı
const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
const ID_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
const NAME_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";

interface UserType {
  id: string;
  username: string;
  role: string; 
}

interface AuthContextType {
  user: UserType | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [error, setError] = useState<string | null>(null);

  // Login fonksiyonu
  const login = async (username: string, password: string): Promise<boolean> => {
    setError(null);
    try {
      const res = await loginApi({ username, password });
      setToken(res.token);
      localStorage.setItem("token", res.token);

      // Token'dan user ve rol çekme (her ihtimale karşı claim isimleriyle)
      const decoded: any = jwtDecode(res.token);
      setUser({
        id: decoded.sub || decoded[ID_CLAIM] || "",
        username: decoded.username || decoded[NAME_CLAIM] || username,
        role: (decoded.role || decoded[ROLE_CLAIM] || "").toLowerCase()
      });

      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      return false;
    }
  };

  // Logout fonksiyonu
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  // Sayfa yenilenince token'dan user'ı tekrar oluştur
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) {
      setToken(t);
      try {
        const decoded: any = jwtDecode(t);
        setUser({
          id: decoded.sub || decoded[ID_CLAIM] || "",
          username: decoded.username || decoded[NAME_CLAIM] || "",
          role: decoded.role || decoded[ROLE_CLAIM] || "",
        });
      } catch {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
      }
    }
  }, []);

  // İstediğin yerde loglamayı açabilirsin
  // console.log("Decoded User:", user);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
