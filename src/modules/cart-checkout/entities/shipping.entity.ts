/**
 * Entidades relacionadas con envíos y carriers
 */

export interface Carrier {
  carrier_id: number;
  carrier_nombre: string;
  carrier_codigo: string;
  carrier_tipo: string;
  logo_url: string | null;
  costo_envio: number;
  tiempo_estimado_dias: number;
  fecha_entrega_estimada: string;
  distancia_km: number;
  peso_maximo_kg: number;
  cobertura_nacional: boolean;
  cobertura_internacional: boolean;
  cotizacion_id: string;
  valida_hasta: string;
}

export interface AlmacenOrigen {
  id: number;
  nombre: string;
  direccion: string;
  latitud: number;
  longitud: number;
}

export interface ShippingQuoteResponse {
  success: boolean;
  distancia_km: number;
  almacen_origen: AlmacenOrigen;
  domicilio: {
    disponible: boolean;
    carriers: Carrier[];
    total_opciones: number;
  };
}
