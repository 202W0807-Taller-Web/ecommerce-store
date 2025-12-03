import { useState, useCallback, useMemo } from 'react';
import { CartService } from '../services';

export interface UseCartResult {
  adding: boolean;
  error: string | null;
  success: boolean;
  
  // Acciones
  addToCart: (productId: number, variantId: number, quantity?: number) => Promise<void>;
  clearError: () => void;
  clearSuccess: () => void;
}

export const useCart = (): UseCartResult => {
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const cartService = useMemo(() => new CartService(), []);

  const addToCart = useCallback(async (
    productId: number,
    variantId: number,
    quantity: number = 1
  ) => {
    setAdding(true);
    setError(null);
    setSuccess(false);
    
    try {
      await cartService.addToCart(productId, variantId, quantity);
      setSuccess(true);
      
      // Auto-limpiar el mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setAdding(false);
    }
  }, [cartService]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearSuccess = useCallback(() => {
    setSuccess(false);
  }, []);

  return {
    adding,
    error,
    success,
    addToCart,
    clearError,
    clearSuccess
  };
};