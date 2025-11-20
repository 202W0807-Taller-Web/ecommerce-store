import axios from "axios";

// Crear instancia preconfigurada de Axios
export const api = axios.create({
  baseURL: "http://localhost:3000/api", // Ruta base del backend
  withCredentials: true,                // Enviar cookies (sesiones)
  headers: {
    "Content-Type": "application/json",
  },
});

// (Opcional) Interceptor para ver errores en consola
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ⬇️ Interceptor para añadir token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;