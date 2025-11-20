// src/api/api.ts
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",   // 👈 MUY IMPORTANTE PARA ENVIAR COOKIES
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Error en la petición");
  }

  return res.json();
}

