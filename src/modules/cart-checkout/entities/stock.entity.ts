/**
 * Entidades relacionadas con validación de stock e inventario
 */

export interface StockInfo {
  id_producto: number;
  stock_total: number;
  stock_disponible_total: number;
  stock_reservado_total: number;
  almacenes: {
    id_almacen: number;
    stock_disponible: number;
    stock_reservado: number;
    stock_total: number;
  }[];
}

export interface ProductStockStatus {
  idProducto: number;
  stockDisponible: number;
  tieneStock: boolean;
  excedeCantidad: boolean;
  cantidadMaxima: number;
}
