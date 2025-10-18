export const ProductCardSkeleton = () => {
  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
      {/* Imagen skeleton */}
      <div className="aspect-square bg-gray-200 relative">
        {/* Botón de favorito skeleton */}
        <div className="absolute top-3 right-3 w-9 h-9 bg-gray-300 rounded-full"></div>
      </div>
      
      <div className="p-4">
        {/* Título skeleton */}
        <div className="h-5 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        
        {/* Rating skeleton */}
        <div className="flex items-center mb-2">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="ml-2 w-12 h-4 bg-gray-200 rounded"></div>
        </div>
        
        {/* Precio skeleton */}
        <div className="flex items-center justify-between mb-3">
          <div className="space-y-1">
            <div className="h-6 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="w-20 h-8 bg-gray-200 rounded"></div>
        </div>
        
        {/* Botón agregar al carrito skeleton */}
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </article>
  );
};

// Skeleton para grid de productos
export const ProductGridSkeleton = ({ count = 12 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};
