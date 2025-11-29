import axios, { type AxiosResponse } from 'axios';
import { type ProductSummary, type ProductFilters, type PaginationParams } from '../types';

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
  data: ProductSummary[];
  total: number;
  currentPage: number;
  itemsPerPage: number;
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
    this.baseUrl = import.meta.env.VITE_SEARCH_API_URL || '';
  }

  /**
   * Validar configuración de URL
   */
  private validateConfig(): void {
    if (!this.baseUrl) {
      throw new Error('VITE_SEARCH_API_URL no está configurada. Configura la variable de entorno para conectar con el microservicio de búsqueda.');
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
    if (pagination) {
      if (pagination.page != null) {
        payload.pageNumber = pagination.page;
      }
      if (pagination.limit != null) {
        payload.pageSize = pagination.limit;
      }
    }

    // Parámetros de ordenamiento
    if (sortBy) {
      if (sortBy === 'price_asc') {
        payload.orderBy = 'precio_asc';
      } else if (sortBy === 'price_desc') {
        payload.orderBy = 'precio_desc';
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
      if (filters.search && filters.search.trim() !== '') {
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
  ): Promise<SearchResponse> {
    this.validateConfig();

    try {
      const url = `${this.baseUrl}/api/search`;

      const payload = this.buildSearchPayload(pagination, filters, sortBy);

      console.log('🔍 Haciendo POST a:', url);
      console.log('📦 Payload:', payload);

      const response: AxiosResponse<SearchResponse> = await axios({
        method: 'POST',
        url: url,
        data: payload,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('✅ Respuesta recibida:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error searching products from API:', error);
      if (axios.isAxiosError(error)) {
        console.error('📋 Response:', error.response?.data);
        console.error('📊 Status:', error.response?.status);
        console.error('🔧 Method:', error.config?.method);
        console.error('🌐 URL:', error.config?.url);
      }
      throw new Error('No se pudieron buscar los productos desde el servidor. Verifica tu conexión.');
    }
  }

  /**
   * Obtener sugerencias de autocompletado
   * GET /api/search/autocomplete?q=
   */
  async autocomplete(query: string): Promise<AutocompleteItem[]> {
    this.validateConfig();

    if (!query || query.trim() === '') {
      return [];
    }

    try {
      const url = `${this.baseUrl}/api/search/autocomplete`;

      const response: AxiosResponse<AutocompleteItem[]> = await axios.get(url, {
        params: { q: query }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching autocomplete suggestions:', error);
      return [];
    }
  }

  /**
   * Obtener sugerencias de productos
   * GET /api/search/suggestions?q=
   */
  async suggestions(query: string): Promise<ProductSuggestion[]> {
    this.validateConfig();

    if (!query || query.trim() === '') {
      return [];
    }

    try {
      const url = `${this.baseUrl}/api/search/suggestions`;

      const response: AxiosResponse<ProductSuggestion[]> = await axios.get(url, {
        params: { q: query }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching product suggestions:', error);
      return [];
    }
  }
}