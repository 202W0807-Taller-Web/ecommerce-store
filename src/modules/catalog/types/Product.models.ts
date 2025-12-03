// GET /atributos - 
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

export interface ProductoImagen {
  id: number;
  productoId: number;
  principal: boolean;
  imagen: string;
}

export interface VarianteImagen {
  id: number;
  varianteId: number;
  imagen: string;
}

export interface VarianteAtributo {
  id: number;
  varianteId: number;
  atributoValorId: number;
  atributoValor: string | null; 
}

// Variante del producto (GET /product/:id)
export interface Variante {
  id: number;
  productoId: number;
  precio: number;
  sku: string;
  stock?: number; 
  varianteImagenes: VarianteImagen[];
  varianteAtributos: VarianteAtributo[];
}

// Atributo asignado a un producto específico
export interface ProductoAtributo {
  id: number;
  productoId: number;
  atributoValorId: number;
  atributoValor: string | null;
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

// GET /product/listado -
export interface ProductSummary {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  tienePromocion: boolean;
}

// Interfaces extendidas para funcionalidad de la UI
export interface FrontendProduct extends Product {
  // Campos calculados para la UI
  precioMinimo: number;
  precioMaximo: number;
  coloresDisponibles: string[];
  tallasDisponibles: string[];
  imagenPrincipal: string;
  todasLasImagenes: string[];
}

export interface FrontendProductSummary extends ProductSummary {
  // Campos calculados para la UI
  precioOriginal?: number;
  rating: number;
  reviewCount: number;
  isPromo: boolean;
}


export interface ProductFilters {
  search?: string;
  category?: string[]; // Cualquier atributo que no sea talla, color, unidad de medida
  color?: string[];
  size?: string[]; // talla
  unit?: string[]; // unidad de medida
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
