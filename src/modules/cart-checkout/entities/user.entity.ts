/**
 * Entidades relacionadas con usuarios de envío
 */

export interface ShippingUser {
  id: number;
  idUsuario: number;
  email: string;
  nombreCompleto: string;
  telefono: string;
}

export type ShippingUserForm = Omit<ShippingUser, "id">;
