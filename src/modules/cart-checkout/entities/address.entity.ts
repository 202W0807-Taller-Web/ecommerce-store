/**
 * Entidades relacionadas con direcciones de envío
 */

export interface Address {
  id: number;
  direccionLinea1: string;
  direccionLinea2?: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  pais: string;
  principal: boolean;
  latitud?: number;
  longitud?: number;
  direccion?: string; // Dirección completa concatenada (opcional)
}

export type AddressForm = Omit<Address, "id">;
