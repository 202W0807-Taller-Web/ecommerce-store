/**
 * Entidades relacionadas con el carrito de compras
 */

export interface CartItem {
  idProducto: number;
  idVariante?: number | null;
  nombre: string;
  precio: number;
  cantidad: number;
  imagenUrl?: string;
}

export interface Carrito {
  id: number;
  idUsuario?: number | null;
  items: CartItem[];
}
