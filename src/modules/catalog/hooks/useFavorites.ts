import { useContext } from 'react';
import { FavoritesContext } from '../contexts/FavoritesContext';
import { AuthContext } from '../../client-auth/context/AuthContext';

export const useFavorites = () => {
  const favoritesContext = useContext(FavoritesContext);
  const authContext = useContext(AuthContext);

  if (!favoritesContext) {
    throw new Error('useFavorites debe usarse dentro de un FavoritesProvider');
  }

  if (!authContext) {
    throw new Error('useFavorites debe usarse dentro de un AuthProvider');
  }

  const { isAuth: isAuthenticated } = authContext;

  return {
    ...favoritesContext,
    isAuthenticated
  };
};