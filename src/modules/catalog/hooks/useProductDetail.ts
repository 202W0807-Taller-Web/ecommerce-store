import { useState, useCallback, useMemo } from 'react';
import { CatalogService } from '../services/catalog.service';
import { type Product } from '../types';

export interface UseProductDetailResult {
  product: Product | null;
  loading: boolean;
  error: string | null;
  
  // Acciones
  fetchProductDetail: (productId: number) => Promise<void>;
}

export const useProductDetail = (): UseProductDetailResult => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Instancia única del servicio usando useMemo
  const catalogService = useMemo(() => new CatalogService(), []);

  const fetchProductDetail = useCallback(async (productId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await catalogService.getProductDetail(productId);
      setProduct(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [catalogService]);

  return {
    product,
    loading,
    error,
    fetchProductDetail
  };
};