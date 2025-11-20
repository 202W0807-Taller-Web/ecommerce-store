// src/api/addresses.ts
import { api } from "./axios";

export type AddressPayload = {
  calle: string;
  ciudad: string;
  estado?: string;
  pais: string;
  codigo_postal?: string;
  isDefault?: boolean;
};

const API_URL = "/direcciones";

// Obtener direcciones de un usuario
export async function getUserAddresses(userId: number) {
  const res = await api.get(`${API_URL}/usuario/${userId}`);
  return res.data;
}

// Agregar dirección
export async function addAddress(userId: number, address: AddressPayload) {
  const res = await api.post(API_URL, {
    usuario_id: userId,
    ...address,
  });
  return res.data;
}

// Actualizar dirección
export async function updateAddress(id: number, address: Partial<AddressPayload>) {
  const res = await api.put(`${API_URL}/${id}`, address);
  return res.data;
}

// Eliminar dirección
export async function deleteAddress(id: number) {
  const res = await api.delete(`${API_URL}/${id}`);
  return res.data;
}

// Establecer como predeterminada
export async function setDefaultAddress(addressId: number) {
  const res = await api.patch(`/direcciones/${addressId}/set-default`);
  return res.data;
}

