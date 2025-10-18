import React, { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { AtributosContext, type AtributosContextType } from './AtributosContext';
import type { Atributo } from '../types';
import { CatalogService } from '../services/catalog.service';

interface AtributosProviderProps {
  children: ReactNode;
}

export const AtributosProvider: React.FC<AtributosProviderProps> = ({ children }) => {
  const [atributos, setAtributos] = useState<Atributo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [catalogService] = useState(() => new CatalogService());

  const fetchAtributos = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await catalogService.getAtributos();
      setAtributos(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar atributos';
      setError(errorMessage);
      console.error('Error fetching atributos:', err);
    } finally {
      setLoading(false);
    }
  }, [catalogService]);

  // Cargar atributos al montar el componente
  useEffect(() => {
    fetchAtributos();
  }, [fetchAtributos]);

  const refetch = async (): Promise<void> => {
    await fetchAtributos();
  };

  const value: AtributosContextType = {
    atributos,
    loading,
    error,
    refetch
  };

  return (
    <AtributosContext.Provider value={value}>
      {children}
    </AtributosContext.Provider>
  );
};

// Hook movido a un archivo separado para compatibilidad con Fast Refresh
