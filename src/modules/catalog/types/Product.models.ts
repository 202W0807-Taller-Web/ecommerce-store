// Interfaces basadas en la estructura real de la API

// GET /atributos - Atributo completo con sus valores posibles
export interface Atributo {
  id: number;
  nombre: string;
  atributoValores: AtributoValor[];
}

// Valor de un atributo
export interface AtributoValor {
  id: number;
  atributoId: number;
  valor: string;
}

// GET /product/:id - Imagen del producto
export interface ProductoImagen {
  id: number;
  productoId: number;
  principal: boolean;
  imagen: string;
}

// Imagen de una variante específica
export interface VarianteImagen {
  id: number;
  varianteId: number;
  imagen: string;
}

// Atributo de una variante específica
export interface VarianteAtributo {
  id: number;
  varianteId: number;
  atributoValorId: number;
  atributoValor: string;
}

// Variante del producto (GET /product/:id)
export interface Variante {
  id: number;
  productoId: number;
  precio: number;
  sku: string;
  stock?: number; // Stock disponible para esta variante
  varianteImagenes: VarianteImagen[];
  varianteAtributos: VarianteAtributo[];
}

// Atributo asignado a un producto específico
export interface ProductoAtributo {
  id: number;
  productoId: number;
  atributoValorId: number;
  valor: string;
}

// GET /product/:id - Respuesta detallada del producto
export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  idPromocion: number | null;
  productoImagenes: ProductoImagen[];
  variantes: Variante[];
  productoAtributos: ProductoAtributo[];
}

// GET /product/listado - Respuesta resumida del producto
export interface ProductSummary {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  tienePromocion: boolean;
}

// Interfaces extendidas para funcionalidad de la UI
export interface ProductWithUI extends Product {
  // Campos calculados para la UI
  precioMinimo: number;
  precioMaximo: number;
  coloresDisponibles: string[];
  tallasDisponibles: string[];
  imagenPrincipal: string;
  todasLasImagenes: string[];
  varianteSeleccionada?: Variante;
  colorSeleccionado?: string;
  tallaSeleccionada?: string;
}

export interface ProductSummaryWithUI extends ProductSummary {
  // Campos calculados para la UI
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
