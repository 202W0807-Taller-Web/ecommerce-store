/**
 * Punto de entrada central para todas las entidades del módulo cart-checkout
 */

// Carrito
export type { CartItem, Carrito } from "./cart.entity";

// Direcciones
export type { Address, AddressForm } from "./address.entity";

// Usuarios
export type { ShippingUser, ShippingUserForm } from "./user.entity";

// Ubicación
export type { UserLocation } from "./location.entity";

// Stock
export type { StockInfo, ProductStockStatus } from "./stock.entity";

// Envíos
export type {
  Carrier,
  AlmacenOrigen,
  ShippingQuoteResponse
} from "./shipping.entity";

// Recojo en tienda
export type {
  Store,
  RecojoTienda,
  PickupQuoteResponse
} from "./pickup.entity";
