import api from "./axios";

export async function loginUser(credentials: { correo: string; password: string }) {
  const res = await api.post("/auth/login", {
    correo: credentials.correo,
    contraseña: credentials.password,
  });

  return res.data;
}

export async function getCurrentUser() {
  const res = await api.get("/auth/me");
  return res.data.user;
}