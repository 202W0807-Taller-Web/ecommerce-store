const API_BASE = `${import.meta.env.VITE_AUTH_BACKEND}/api`;

const jsonHeaders = { "Content-Type": "application/json" };

export const getPreferences = async (usuarioId: number) => {
  const res = await fetch(`${API_BASE}/preferencias/usuario/${usuarioId}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("No se pudieron obtener preferencias");
  return res.json();
};

export const updatePreferences = async (usuarioId: number, payload: Record<string, unknown>) => {
  const res = await fetch(`${API_BASE}/preferencias/usuario/${usuarioId}`, {
    method: "PUT",
    headers: jsonHeaders,
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (!res.ok) throw new Error("No se pudieron guardar preferencias");
  return res.json();
};

export const listConsents = async () => {
  const res = await fetch(`${API_BASE}/consentimientos`, { credentials: "include" });
  if (!res.ok) throw new Error("No se pudieron listar consentimientos");
  return res.json();
};

export const getUserConsents = async (usuarioId: number) => {
  const res = await fetch(`${API_BASE}/consentimientos/usuario/${usuarioId}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("No se pudieron obtener consentimientos de usuario");
  return res.json();
};

export const updateUserConsents = async (
  usuarioId: number,
  consentimientos: { consentimiento_id: number; aceptado: boolean }[]
) => {
  const res = await fetch(`${API_BASE}/consentimientos/usuario/${usuarioId}`, {
    method: "PUT",
    headers: jsonHeaders,
    body: JSON.stringify({ consentimientos }),
    credentials: "include",
  });
  if (!res.ok) throw new Error("No se pudieron actualizar consentimientos");
  return res.json();
};

export const exportUserData = async (usuarioId: number) => {
  const res = await fetch(`${API_BASE}/usuarios/${usuarioId}/exportar`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("No se pudieron exportar los datos");
  return res.json();
};
