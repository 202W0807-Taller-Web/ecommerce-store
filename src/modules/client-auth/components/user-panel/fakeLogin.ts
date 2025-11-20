import api from "../../api/axios";

export async function fakeLogin() {
  try {
    const res = await api.post("/auth/login", {
      correo: "admin@test.com",
      contraseña: "1234",
    });

    console.log("⚡ Usuario logueado automáticamente:", res.data);
    return res.data;
  } catch (error: any) {
    console.error(
      "❌ Error en fake login:",
      error.response?.data || error.message
    );
  }
}