// src/api/direcciones.ts
import { apiFetch } from "./api";

// Obtener las direcciones de un usuario
export function getDirecciones(usuario_id: number) {
  return apiFetch(`/direcciones/usuario/${usuario_id}`);
}

// Crear una nueva dirección
export function crearDireccion(data: any) {
  return apiFetch("/direcciones", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Actualizar una dirección por ID
export function actualizarDireccion(id: number, data: any) {
  return apiFetch(`/direcciones/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// Eliminar una dirección por ID
export function eliminarDireccion(id: number) {
  return apiFetch(`/direcciones/${id}`, {
    method: "DELETE",
  });
}