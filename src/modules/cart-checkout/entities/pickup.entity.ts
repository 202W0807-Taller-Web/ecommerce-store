/**
 * Entidades relacionadas con recojo en tienda
 */

import type { AlmacenOrigen } from "./shipping.entity";

export interface Store {
  id: number;
  nombre: string;
  imagen: string | null;
  direccion: string;
  latitud: number;
  longitud: number;
  distancia_km: number;
}

export interface RecojoTienda {
  tipo_envio: string;
  costo_envio: number;
  tiempo_estimado_dias: number;
  fecha_entrega_estimada: string;
  descripcion: string;
  disponible: boolean;
  tiendas: Store[];
  mensaje: string;
}

export interface PickupQuoteResponse {
  success: boolean;
  distancia_km: number;
  almacen_origen: AlmacenOrigen;
  recojo_tienda: RecojoTienda;
}
