import { createContext, useState, useEffect, useCallback, useContext, type ReactNode } from 'react';
import { FavoritesService } from '../services/favorites.service';
import type { FrontendProductSummary } from '../types';
import { AuthContext } from '../../client-auth/context/AuthContext';

interface FavoritesContextType {
  favorites: FrontendProductSummary[];
  favoriteIds: Set<number>;
  isLoading: boolean;
  error: string | null;
  toggleFavorite: (productoId: number) => Promise<boolean>;
  isFavorite: (productoId: number) => boolean;
  refreshFavorites: () => Promise<void>;
}

export const FavoritesContext = createContext<FavoritesContextType | null>(null);

const favoritesService = new FavoritesService();

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const authContext = useContext(AuthContext);
  const [favorites, setFavorites] = useState<FrontendProductSummary[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!authContext) {
    throw new Error('FavoritesProvider debe usarse dentro de un AuthProvider');
  }

  const { isAuth: isAuthenticated, user } = authContext;

  const loadFavorites = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setFavorites([]);
      setFavoriteIds(new Set());
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await favoritesService.getFavorites(user.id);
      setFavorites(data);
      // Asegurar que todos los IDs sean números
      const ids = new Set(data.map(p => Number(p.id)));
      setFavoriteIds(ids);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar favoritos';
      setError(errorMessage);
      console.error('Error loading favorites:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const toggleFavorite = async (productoId: number): Promise<boolean> => {
    if (!isAuthenticated || !user?.id) {
      return false;
    }

    // Asegurar que productoId sea un número
    const productIdNum = Number(productoId);
    const isFav = favoriteIds.has(productIdNum);

    // Optimistic update
    if (isFav) {
      setFavorites(prev => prev.filter(p => Number(p.id) !== productIdNum));
      setFavoriteIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(productIdNum);
        return newSet;
      });
    } else {
      // IMPORTANTE: Asegurar que se agregue como número
      setFavoriteIds(prev => new Set(prev).add(productIdNum));
    }

    try {
      if (isFav) {
        await favoritesService.removeFavorite(user.id, productIdNum);
      } else {
        await favoritesService.addFavorite(user.id, productIdNum);
        // Recargar para obtener el producto completo con todos sus datos
        await loadFavorites();
      }
      return true;
    } catch (err) {
      console.error('Error en toggleFavorite:', err);
      
      // Revertir optimistic update en caso de error
      if (isFav) {
        await loadFavorites();
      } else {
        setFavoriteIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(productIdNum);
          return newSet;
        });
      }
      
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar favoritos';
      setError(errorMessage);
      return false;
    }
  };

  const isFavorite = (productoId: number): boolean => {
    // Asegurar que la comparación sea con número
    return favoriteIds.has(Number(productoId));
  };

  const value: FavoritesContextType = {
    favorites,
    favoriteIds,
    isLoading,
    error,
    toggleFavorite,
    isFavorite,
    refreshFavorites: loadFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};