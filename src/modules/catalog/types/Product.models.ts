// Interfaces para la estructura real de la API

// Imagen del producto
export interface ProductoImagen {
  id: number;
  productoId: number;
  principal: boolean;
  imagen: string;
}

// Valor de un atributo
export interface AtributoValor {
  id: number;
  atributoId: number;
  valor: string;
}

// Atributo completo con sus valores posibles
export interface Atributo {
  id: number;
  nombre: string;
  atributoValores: AtributoValor[];
}

// Atributo del producto (asignado a un producto específico)
export interface ProductoAtributo {
  id: number;
  productoId: number;
  atributoId: number;
  atributoValorId: number;
  nombre: string;
  valor: string;
}

// Atributos que determinan variantes (Talla, Color, etc.)
export type AtributoVariante = 'Talla' | 'Color' | 'Unidad medida';

// Variante del producto (determinada por atributos de variante)
export interface ProductoVariante {
  id: number;
  productoId: number;
  precio: number;
  stock: number;
  // Atributos que definen esta variante específica
  talla?: string;
  color?: string;
  unidadMedida?: string;
  // Para compatibilidad con estructura anterior
  atributos: Array<{
    nombre: string;
    valor: string;
  }>;
}

// Respuesta detallada del producto (GET /product/:id)
export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  idPromocion: number | null;
  productoImagenes: ProductoImagen[];
  variantes: ProductoVariante[];
  productoAtributos: ProductoAtributo[];
  // Atributos para filtros (Categoría, Género, Deporte, Tipo, Colección)
  atributosFiltro: Record<string, string>;
  // Campos mockeados para las vistas
  precio: number;
  precioOriginal?: number;
  categoria: string;
  rating: number;
  reviewCount: number;
  isPromo: boolean;
  promotionId?: number;
}

// Respuesta resumida del producto (GET /products)
export interface ProductSummary {
  id?: number;
  nombre: string;
  descripcion: string;
  imagenesBase64: string[];
  // Atributos para filtros (Categoría, Género, Deporte, Tipo, Colección)
  atributosFiltro: Record<string, string>;
  // Campos mockeados para las vistas
  precio: number;
  precioOriginal?: number;
  categoria: string;
  rating: number;
  reviewCount: number;
  isPromo: boolean;
}

// Interfaces de compatibilidad para componentes existentes
export interface ProductAttribute {
  id: string;
  attributeName: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  price: number;
  inStock: boolean;
  stockCount: number;
  attributes: VariantAttribute[];
}

export interface VariantAttribute {
  attributeName: string;
  value: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  inStock?: boolean;
  tags?: string[];
  sortBy?: ProductSortBy;
  sortOrder?: SortOrder;
}

export type ProductSortBy = 
  | 'price' 
  | 'rating' 
  | 'createdAt' 
  | 'popularity';

export type SortOrder = 'asc' | 'desc';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
