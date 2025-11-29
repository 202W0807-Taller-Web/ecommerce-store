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

export async function forgotPassword(correo: string) {
  const res = await api.post("/auth/forgot", { correo });
  return res.data;
}

export async function validateResetToken(token: string) {
  const res = await api.get("/auth/reset/validate", { params: { token } });
  return res.data;
}

export async function resetPassword(payload: { token: string; nuevaContrasena: string }) {
  const res = await api.post("/auth/reset", payload);
  return res.data;
}
