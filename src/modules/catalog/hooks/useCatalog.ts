import { useState, useCallback, useMemo } from "react";
import { type ProductFilters, type FrontendProductSummary, type PaginationResult } from "../types";
import { SearchService } from "../services";

export interface UseCatalogResult {
  // Productos
  products: PaginationResult<FrontendProductSummary>;
  loading: boolean;
  error: string | null;
  
  // Acciones
  fetchProducts: (filters: ProductFilters, pagination: { page: number; limit: number }, sortBy?: string) => Promise<void>;
  searchProducts: (query: string, filters?: Partial<ProductFilters>, sortBy?: string) => Promise<FrontendProductSummary[]>;
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

  const searchService = useMemo(() => new SearchService(), []);

  const fetchProducts = useCallback(async (filters: ProductFilters, pagination: { page: number; limit: number }, sortBy?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await searchService.searchProducts(pagination, filters, sortBy);
      setProducts(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [searchService]);

  const searchProducts = useCallback(async (query: string, filters?: Partial<ProductFilters>, sortBy?: string): Promise<FrontendProductSummary[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await searchService.onlySearch(query, filters, sortBy);
      return result;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return [];
    } finally {
      setLoading(false);
    }
  }, [searchService]);

  return {
    products,
    loading,
    error,
    fetchProducts,
    searchProducts
  };
};