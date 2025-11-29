import { useState, useCallback, useMemo } from "react";
import { CatalogService } from "../services/catalog.service";
import { SearchService } from "../services/search.service";
import { SERVICE_CONFIG } from "../config/service.config";
import { 
  type ProductFilters, 
  type FrontendProductSummary, 
  type PaginationResult 
} from "../types";
import type { AutocompleteItem, ProductSuggestion } from "../services/search.service";

// Formatear producto para listado con datos de UI
function formatearProducto(producto: any): FrontendProductSummary {
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
    isPromo: tienePromocion
  };
}

export interface UseCatalogResult {
  // Productos
  products: PaginationResult<FrontendProductSummary>;
  loading: boolean;
  error: string | null;
  
  // Acciones
  fetchProducts: (filters: ProductFilters, pagination: { page: number; limit: number }, sortBy?: string) => Promise<void>;
  searchProducts: (query: string, filters?: Partial<ProductFilters>, sortBy?: string) => Promise<FrontendProductSummary[]>;
  
  // Nuevas funcionalidades del microservicio de búsqueda
  autocomplete: (query: string) => Promise<AutocompleteItem[]>;
  getProductSuggestions: (query: string) => Promise<ProductSuggestion[]>;
}

export const useCatalog = (): UseCatalogResult => {
  const [products, setProducts] = useState<PaginationResult<FrontendProductSummary>>({
    data: [],
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const catalogService = useMemo(() => new CatalogService(), []);
  const searchService = useMemo(() => new SearchService(), []);

  /**
   * Obtener productos - usa el servicio configurado
   */
  const fetchProducts = useCallback(async (
    filters: ProductFilters, 
    pagination: { page: number; limit: number }, 
    sortBy?: string
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      let apiResponse;
      
      // 🔀 SWITCH: Elegir servicio según configuración
      if (SERVICE_CONFIG.USE_SEARCH_SERVICE) {
        console.log('🔍 Usando SearchService');
        apiResponse = await searchService.searchProducts(pagination, filters, sortBy);
      } else {
        console.log('📦 Usando CatalogService');
        const catalogResponse = await catalogService.getProducts(filters, pagination, sortBy);
        // Adaptar respuesta de CatalogService al formato esperado
        apiResponse = {
          data: catalogResponse.data.map(p => ({
            id: p.id,
            nombre: p.nombre,
            precio: p.precio,
            imagen: p.imagen,
            tienePromocion: p.tienePromocion
          })),
          total: catalogResponse.total,
          currentPage: catalogResponse.page,
          itemsPerPage: catalogResponse.limit,
          totalPages: catalogResponse.totalPages
        };
      }
      
      // Formatear productos para UI
      const productSummaries: FrontendProductSummary[] = apiResponse.data.map((apiProduct) => 
        formatearProducto(apiProduct)
      );

      setProducts({
        data: productSummaries,
        total: apiResponse.total,
        page: apiResponse.currentPage,
        limit: apiResponse.itemsPerPage,
        totalPages: apiResponse.totalPages,
        hasNext: apiResponse.currentPage < apiResponse.totalPages,
        hasPrev: apiResponse.currentPage > 1
      });
    } catch (error) {
      console.error('❌ Error en fetchProducts:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [searchService, catalogService]);

  /**
   * Buscar productos por query - usa el servicio configurado
   */
  const searchProducts = useCallback(async (
    query: string, 
    filters?: Partial<ProductFilters>, 
    sortBy?: string
  ): Promise<FrontendProductSummary[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const searchFilters: ProductFilters = {
        search: query,
        ...filters
      };
      
      let products;
      
      // 🔀 SWITCH: Elegir servicio según configuración
      if (SERVICE_CONFIG.USE_SEARCH_SERVICE) {
        console.log('🔍 Usando SearchService para búsqueda');
        const apiResponse = await searchService.searchProducts(
          { page: 1, limit: 100 }, 
          searchFilters, 
          sortBy
        );
        products = apiResponse.data;
      } else {
        console.log('📦 Usando CatalogService para búsqueda');
        products = await catalogService.searchProducts(query, filters, sortBy);
      }
      
      return products.map((apiProduct) => formatearProducto(apiProduct));
    } catch (error) {
      console.error('❌ Error en searchProducts:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return [];
    } finally {
      setLoading(false);
    }
  }, [searchService, catalogService]);

  /**
   * Autocompletado de búsqueda - solo disponible con SearchService
   */
  const autocomplete = useCallback(async (query: string): Promise<AutocompleteItem[]> => {
    if (!SERVICE_CONFIG.USE_SEARCH_SERVICE) {
      console.warn('⚠️ Autocomplete solo disponible con SearchService');
      return [];
    }

    if (!query || query.trim() === '') {
      return [];
    }

    try {
      const result = await searchService.autocomplete(query);
      return result;
    } catch (error) {
      console.error('Error fetching autocomplete:', error);
      return [];
    }
  }, [searchService]);

  /**
   * Sugerencias de productos - solo disponible con SearchService
   */
  const getProductSuggestions = useCallback(async (query: string): Promise<ProductSuggestion[]> => {
    if (!SERVICE_CONFIG.USE_SEARCH_SERVICE) {
      console.warn('⚠️ Product suggestions solo disponible con SearchService');
      return [];
    }

    if (!query || query.trim() === '') {
      return [];
    }

    try {
      const result = await searchService.suggestions(query);
      return result;
    } catch (error) {
      console.error('Error fetching product suggestions:', error);
      return [];
    }
  }, [searchService]);

  return {
    products,
    loading,
    error,
    fetchProducts,
    searchProducts,
    autocomplete,
    getProductSuggestions
  };
};