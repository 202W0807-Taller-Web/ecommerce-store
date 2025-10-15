export const ProductDetailSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="mb-8">
        <div className="h-4 bg-gray-200 rounded w-48"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Galería de imágenes skeleton */}
        <div className="flex space-x-4">
          {/* Miniaturas skeleton */}
          <div className="flex flex-col space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-20 h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
          
          {/* Imagen principal skeleton */}
          <div className="flex-1 aspect-square bg-gray-200 rounded-lg"></div>
        </div>

        {/* Información del producto skeleton */}
        <div className="space-y-6">
          {/* Título skeleton */}
          <div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          </div>

          {/* Rating skeleton */}
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-5 h-5 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="w-20 h-4 bg-gray-200 rounded"></div>
          </div>

          {/* Precio skeleton */}
          <div className="space-y-2">
            <div className="h-10 bg-gray-200 rounded w-32"></div>
            <div className="h-6 bg-gray-200 rounded w-24"></div>
          </div>

          {/* Descripción skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>

          {/* Selector de variantes skeleton */}
          <div className="space-y-4">
            {/* Colores skeleton */}
            <div>
              <div className="h-5 bg-gray-200 rounded w-16 mb-3"></div>
              <div className="flex space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-10 h-10 bg-gray-200 rounded-full"></div>
                ))}
              </div>
            </div>

            {/* Tallas skeleton */}
            <div>
              <div className="h-5 bg-gray-200 rounded w-12 mb-3"></div>
              <div className="flex space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-12 h-10 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Botones de acción skeleton */}
          <div className="space-y-3">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>

          {/* Información adicional skeleton */}
          <div className="space-y-4 pt-6 ">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reseñas skeleton */}
      <div className="mt-16">
        <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="w-4 h-4 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
