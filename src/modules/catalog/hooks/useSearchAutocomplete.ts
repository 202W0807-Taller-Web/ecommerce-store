import { useState, useEffect, useCallback, useRef } from 'react';
import { SearchService } from '../services/search.service';

interface UseSearchAutocompleteResult {
  suggestions: string[];
  loading: boolean;
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  fetchSuggestions: (query: string) => void;
  clearSuggestions: () => void;
}

/**
 * Hook para manejar autocomplete de búsqueda con debouncing
 * 
 * @param debounceMs - Tiempo de espera antes de hacer la petición (default: 300ms)
 * @param minChars - Mínimo de caracteres para activar autocomplete (default: 2)
 */
export const useSearchAutocomplete = (
  debounceMs: number = 300,
  minChars: number = 2
): UseSearchAutocompleteResult => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const searchService = useRef(new SearchService());
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const abortController = useRef<AbortController | null>(null);

  /**
   * Limpiar sugerencias
   */
  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setShowSuggestions(false);
    setLoading(false);
  }, []);

  /**
   * Cancelar peticiones pendientes
   */
  const cancelPendingRequests = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
    
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
    }
  }, []);

  /**
   * Obtener sugerencias con debouncing
   */
  const fetchSuggestions = useCallback((query: string) => {
    // Cancelar peticiones anteriores
    cancelPendingRequests();

    // Validar longitud mínima
    if (!query || query.trim().length < minChars) {
      clearSuggestions();
      return;
    }

    // Mostrar loading
    setLoading(true);

    // Crear timer de debounce
    debounceTimer.current = setTimeout(async () => {
      try {
        // Crear nuevo abort controller para esta petición
        abortController.current = new AbortController();

        console.log(`🔍 Fetching autocomplete for: "${query}"`);
        
        const results = await searchService.current.autocomplete(query.trim());
        
        // Solo actualizar si no fue cancelada
        if (!abortController.current.signal.aborted) {
          setSuggestions(results);
          setShowSuggestions(results.length > 0);
          setLoading(false);
        }
      } catch (error) {
        if (!abortController.current?.signal.aborted) {
          console.error('Error fetching autocomplete:', error);
          clearSuggestions();
        }
      }
    }, debounceMs);
  }, [debounceMs, minChars, cancelPendingRequests, clearSuggestions]);

  /**
   * Cleanup al desmontar
   */
  useEffect(() => {
    return () => {
      cancelPendingRequests();
    };
  }, [cancelPendingRequests]);

  return {
    suggestions,
    loading,
    showSuggestions,
    setShowSuggestions,
    fetchSuggestions,
    clearSuggestions,
  };
};