import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import * as authApi from "../api/authApi";
import type { ReactNode } from "react";

/*
interface User {
  id: number;
  nombres: string;
  apellido_p: string;
  apellido_m?: string;
  correo: string;
  created_at: string;
  celular: string;
  //roles?: any[];
}
*/

interface User {
  id: number;
  nombres: string;
  apellido_p: string;
  apellido_m?: string;

  correo: string;

  // Campos personales
  pais_celular?: string | null;
  celular?: string | null;
  f_nacimiento?: string | null;
  genero?: string | null;
  direccion?: string | null;

  // Documentos
  tipo_documento: string;
  nro_documento: string;

  // Estado y rol
  activo: boolean;
  rolInt: number;

  // Opcionales del backend
  avatar?: string | null;
  avatar_url?: string | null;

  // Fechas
  created_at: string;
  updated_at: string;
}

interface AuthContextProps {
  user: User | null;
  isAuth: boolean;
  loading: boolean;
  login: (data: authApi.LoginData) => Promise<authApi.LoginData>;
  register: (data: authApi.RegisterData) => Promise<authApi.RegisterData>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const verifySession = useCallback(async () => {
    try {
      const res = await authApi.checkAuth();
      console.log("res:", res);
      if (res.isAuthenticated) {
        const userRes = await authApi.getCurrentUser();
        if (userRes.success) {
          setUser(userRes.user);
          setIsAuth(true);
        } else {
          setIsAuth(false);
          setUser(null);
        }
      } else {
        setIsAuth(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Error verificando sesión:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    verifySession();
  }, [verifySession]);

  const handleLogin = async (data: authApi.LoginData) => {
    const res = await authApi.login(data);
    if (res.success) {
      setUser(res.user);
      setIsAuth(true);
    }
    return res;
  };

  const handleRegister = async (data: authApi.RegisterData) => {
    const res = await authApi.register(data);
    if (res.success) {
      setUser(res.user);
      setIsAuth(true);
    }
    return res;
  };

  const handleLogout = async () => {
    const res = await authApi.logout();
    if (res.success) {
      setUser(null);
      setIsAuth(false);
    }
    return res;
  };

  const value: AuthContextProps = {
    user,
    isAuth,
    loading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshUser: verifySession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
