import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { type FrontendProductSummary } from '../../types';
import { useFavorites } from '../../hooks/useFavorites';

interface ProductCardProps {
  product: FrontendProductSummary;
  mockRating?: number;
  onLoginRequired?: () => void;
}

export const ProductCard = ({ product, onLoginRequired }: ProductCardProps) => {
  const { toggleFavorite, isFavorite, isAuthenticated } = useFavorites();
  const [isToggling, setIsToggling] = useState(false);
  const isFav = isFavorite(product.id);

  useEffect(() => {
    console.log(`🎴 ProductCard ${product.id} rendered - isFav:`, isFav, 'isAuth:', isAuthenticated);
  }, [product.id, isFav, isAuthenticated]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log(`💗 Favorite click on product ${product.id} - isAuth:`, isAuthenticated);

    if (!isAuthenticated) {
      console.log('❌ No autenticado, mostrando modal de login');
      onLoginRequired?.();
      return;
    }

    if (isToggling) {
      console.log('⏸️ Ya está procesando un toggle');
      return;
    }

    setIsToggling(true);
    try {
      console.log(`🔄 Toggling favorite for product ${product.id}`);
      const success = await toggleFavorite(product.id);
      console.log(`${success ? '✅' : '❌'} Toggle result:`, success);
    } catch (error) {
      console.error('❌ Error al actualizar favorito:', error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <article data-testid={`product-card-${product.nombre}`} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative">
        {/* Corazón/Favorito en esquina superior derecha */}
        <button 
          onClick={handleFavoriteClick}
          disabled={isToggling}
          className={`absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 shadow-sm ${
            isToggling ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'
          }`}
          aria-label={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          {isToggling ? (
            <svg className="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg 
              className={`w-5 h-5 transition-all duration-200 ${
                isFav 
                  ? 'text-red-500 fill-red-500 scale-110' 
                  : 'text-gray-400 hover:text-red-400 hover:scale-110'
              }`}
              fill={isFav ? "currentColor" : "none"}
              stroke="currentColor" 
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          )}
        </button>

        <Link data-testid={`product-link-${product.id}`} to={`/catalog/product/${product.id}`} className="block">
          <div className="aspect-square overflow-hidden bg-gray-50">
            <img
              src={product.imagen || ''}
              alt={product.nombre}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
          
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              {/* Badge PROM si es promoción */}
              {product.isPromo && (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                  PROM
                </span>
              )}
              <h3 className="text-lg font-medium text-primary line-clamp-2 leading-tight">
                {product.nombre}
              </h3>
            </div>
            
            {/* Precio en formato S/ */}
            <div className="mb-2">
              <span className="text-lg font-semibold text-gray-900">
                S/ {product.precio ? product.precio.toFixed(2) : "0.00"}
              </span>
              {product.precioOriginal && product.precioOriginal > product.precio && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  S/ {product.precioOriginal.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>
    </article>
  );
};
