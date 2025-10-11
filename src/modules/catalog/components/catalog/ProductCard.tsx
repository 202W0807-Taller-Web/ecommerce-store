import { Link } from 'react-router-dom';
import { type ProductSummaryWithUI } from '../../types';

interface ProductCardProps {
  product: ProductSummaryWithUI;
  // Datos hardcodeados que se pasan como parámetros
  mockRating?: number;
}

export const ProductCard = ({ product, mockRating }: ProductCardProps) => {
  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative">
        {/* Corazón/Favorito en esquina superior derecha */}
        <button className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-gray-100 transition-colors">
          <svg className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>

        <Link to={`/catalog/product/${product.id}`} className="block">
          <div className="aspect-square overflow-hidden bg-gray-50">
            <img
              src={product.imagen || ''}
              alt={product.nombre}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              {/* Badge PROM si es promoción */}
              {product.isPromo && (
                <span className="bg-red-200 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                  PROM
                </span>
              )}
              <h3 className="text-lg font-medium text-primary line-clamp-2 leading-tight">
                {product.nombre}
              </h3>
            </div>
            
            {/* Precio en formato S/ */}
            <div className="mb-2">
              <span className="text-lg font-medium text-gray-900">
                S/ {product.precio.toFixed(2)}
              </span>
              {product.precioOriginal && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  S/ {product.precioOriginal.toFixed(2)}
                </span>
              )}
            </div>
            
            {/* Rating con estrellas */}
            <div className="flex items-center justify-start">
              <div className="flex items-center space-x-1">
                <div className="flex">
                  {[...Array(5)].map((_, index) => (
                    <svg key={index} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-900 ml-1">
                  {(mockRating || product.rating || 0).toFixed(1)}
                </span>
              </div>
              
            </div>
          </div>
        </Link>
      </div>
    </article>
  );
};
