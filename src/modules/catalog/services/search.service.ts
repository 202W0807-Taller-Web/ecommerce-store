import axios, { type AxiosResponse } from "axios";
import {
  type ProductSummary,
  type ProductFilters,
  type PaginationParams,
  type FrontendProductSummary,
  type PaginationResult,
} from "../types";

function formatearProducto(producto: ProductSummary): FrontendProductSummary {
  const tienePromocion = producto.tienePromocion;

  return {
    id: producto.id,
    nombre: producto.nombre,
    precio: producto.precio,
    imagen: producto.imagen,
    tienePromocion,
    precioOriginal: tienePromocion ? producto.precio * 1.3 : undefined,
    rating: 0,
    reviewCount: 0,
    isPromo: tienePromocion,
  };
}

/**
 * Payload para la búsqueda de productos
 */
export interface SearchPayload {
  pageNumber?: number;
  pageSize?: number;
  orderBy?: string;
  precioMin?: number;
  precioMax?: number;
  tienePromocion?: boolean;
  categoria?: string[];
  genero?: string[];
  deporte?: string[];
  tipo?: string[];
  coleccion?: string[];
  colores?: string[];
  tallas?: string[];
  searchText?: string;
}

/**
 * Respuesta de búsqueda de productos
 */
export interface SearchResponse {
  items: ProductSummary[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Sugerencia de autocompletado
 */
export interface AutocompleteItem {
  text: string;
  type?: string;
}

/**
 * Sugerencia de producto
 */
export interface ProductSuggestion {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
}

export class SearchService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_SEARCH_API_URL || "";
  }

  /**
   * Validar configuración de URL
   */
  private validateConfig(): void {
    if (!this.baseUrl) {
      throw new Error(
        "VITE_SEARCH_API_URL no está configurada. Configura la variable de entorno para conectar con el microservicio de búsqueda."
      );
    }
  }

  /**
   * Construir payload desde filtros y paginación
   */
  private buildSearchPayload(
    pagination?: PaginationParams,
    filters?: ProductFilters,
    sortBy?: string
  ): SearchPayload {
    const payload: SearchPayload = {};

    // Parámetros de paginación
    
    payload.pageNumber = pagination?.page ?? 1
      
    payload.pageSize = pagination?.limit ?? 9
      
    

    // Parámetros de ordenamiento
    if (sortBy) {
      if (sortBy === "price asc") {
        payload.orderBy = "precio-asc";
      } else if (sortBy === "price desc") {
        payload.orderBy = "precio-desc";
      }
    }

    // Parámetros de filtros
    if (filters) {
      // Categorías y tags
      const categorias: string[] = [];
      if (filters.category && filters.category.length > 0) {
        categorias.push(...filters.category);
      }
      if (filters.tags && filters.tags.length > 0) {
        categorias.push(...filters.tags);
      }
      if (categorias.length > 0) {
        payload.categoria = categorias;
      }

      // Colores
      if (filters.color && filters.color.length > 0) {
        payload.colores = filters.color;
      }

      // Tallas
      if (filters.size && filters.size.length > 0) {
        payload.tallas = filters.size;
      }

      // Rango de precios
      if (filters.priceMin != null) {
        payload.precioMin = filters.priceMin;
      }
      if (filters.priceMax != null) {
        payload.precioMax = filters.priceMax;
      }

      // Texto de búsqueda (NUEVO)
      if (filters.search && filters.search.trim() !== "") {
        payload.searchText = filters.search;
      }
    }

    return payload;
  }

  /**
   * Buscar productos con filtros
   * POST /api/search
   */
  async searchProducts(
    pagination?: PaginationParams,
    filters?: ProductFilters,
    sortBy?: string
  ):  Promise<PaginationResult<FrontendProductSummary>>{
    this.validateConfig();

    try {
      const url = `${this.baseUrl}/api/search`;

      const payload = this.buildSearchPayload(pagination, filters, sortBy);

      console.log("🔍 Haciendo POST a:", url);
      console.log("📦 Payload:", payload);

      const response: AxiosResponse<SearchResponse> = await axios({
        method: "POST",
        url: url,
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const productSummaries: FrontendProductSummary[] = response.data.items.map(
        (apiProduct) => formatearProducto(apiProduct)
      );
      return {
        data: productSummaries,
      total: response.data.totalCount,
      page: response.data.currentPage,
      limit: response.data.pageSize,
      totalPages: response.data.totalPages,
      hasNext: response.data.currentPage < response.data.totalPages,
      hasPrev: response.data.currentPage > 1
      };
    } catch (error) {
      console.error("❌ Error searching products from API:", error);
      throw new Error(
        "No se pudieron buscar los productos desde el servidor. Verifica tu conexión."
      );
    }
  }


  async onlySearch(
    query: string,
    filters?: ProductFilters,
    sortBy?: string
  ):   Promise<FrontendProductSummary[]>{
    this.validateConfig();

    try {
      const url = `${this.baseUrl}/api/search`;
      
      if(filters){
        filters.search = query
      }
        
      const payloadFilters = filters ?? {search : query}
      const payload = this.buildSearchPayload({ page: 1, limit: 9 }, payloadFilters, sortBy);

      console.log("🔍 Haciendo POST a:", url);
      console.log("📦 Payload:", payload);

      const response: AxiosResponse<SearchResponse> = await axios({
        method: "POST",
        url: url,
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const productSummaries: FrontendProductSummary[] = response.data.items.map(
        (apiProduct) => formatearProducto(apiProduct)
      );
      return productSummaries
     
    } catch (error) {
      console.error("❌ Error searching products from API:", error);
      throw new Error(
        "No se pudieron buscar los productos desde el servidor. Verifica tu conexión."
      );
    }
  }

  /**
   * Obtener sugerencias de autocompletado
   * GET /api/search/autocomplete?q=
   */
  async autocomplete(query: string): Promise<string[]> {
    this.validateConfig();

    if (!query || query.trim() === "") {
      return [];
    }

    try {
      const url = `${this.baseUrl}/api/search/autocomplete`;

      console.log(`🔍 Autocomplete request: ${query}`);

      const response: AxiosResponse<string[]> = await axios.get(url, {
        params: { q: query.trim() },
        // Timeout corto para autocomplete (3 segundos)
        timeout: 3000,
      });

      console.log(`✅ Autocomplete results: ${response.data.length} items`);

      return response.data;
    } catch (error) {
      console.error("Error fetching autocomplete suggestions:", error);
      return [];
    }
  }

  /**
   * Obtener sugerencias de productos
   * GET /api/search/suggestions?q=
   */
  async suggestions(query: string): Promise<ProductSuggestion[]> {
    this.validateConfig();

    if (!query || query.trim() === "") {
      return [];
    }

    try {
      const url = `${this.baseUrl}/api/search/suggestions`;

      const response: AxiosResponse<ProductSuggestion[]> = await axios.get(
        url,
        {
          params: { q: query },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching product suggestions:", error);
      return [];
    }
  }
}
