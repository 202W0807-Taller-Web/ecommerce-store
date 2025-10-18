import { useState, useCallback, useMemo } from "react";
import { CatalogService } from "../services/catalog.service";
import { type ProductFilters, type FrontendProductSummary, type PaginationResult } from "../types";

export interface UseCatalogResult {
  // Productos
  products: PaginationResult<FrontendProductSummary>;
  loading: boolean;
  error: string | null;
  
  // Acciones
  fetchProducts: (filters: ProductFilters, pagination: { page: number; limit: number }) => Promise<void>;
  searchProducts: (query: string, filters?: Partial<ProductFilters>) => Promise<FrontendProductSummary[]>;
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

  // Instancia única del servicio
  const catalogService = useMemo(() => new CatalogService(), []);

  const fetchProducts = useCallback(async (filters: ProductFilters, pagination: { page: number; limit: number }) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await catalogService.getProducts(filters, pagination);
      setProducts(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [catalogService]);

  const searchProducts = useCallback(async (query: string, filters?: Partial<ProductFilters>): Promise<FrontendProductSummary[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await catalogService.searchProducts(query, filters);
      return result;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return [];
    } finally {
      setLoading(false);
    }
  }, [catalogService]);

  return {
    products,
    loading,
    error,
    fetchProducts,
    searchProducts
  };
};