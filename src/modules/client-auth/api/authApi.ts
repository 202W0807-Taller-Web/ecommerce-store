const API_URL = `${import.meta.env.VITE_AUTH_BACKEND}/api/auth`;

export interface LoginData {
  correo: string;
  contraseña: string;
}

export interface RegisterData {
  nombres: string;
  apellido_p: string;
  apellido_m?: string;
  correo: string;
  contraseña: string;
  tipo_documento: string;
  nro_documento: string;
}

export const register = async (data: RegisterData) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  return res.json();
};

export const login = async (data: LoginData) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  return res.json();
};

export const logout = async () => {
  const res = await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
};

export const checkAuth = async () => {
  const res = await fetch(`${API_URL}/check`, {
    credentials: "include",
  });
  return res.json();
};

export const getCurrentUser = async () => {
  const res = await fetch(`${API_URL}/me`, {
    credentials: "include",
  });
  return res.json();
};
