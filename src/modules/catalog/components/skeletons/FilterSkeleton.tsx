export const FilterSidebarSkeleton = () => {
  return (
    <aside className="bg-white border border-gray-200 rounded-lg shadow-sm h-fit max-h-[calc(100vh-2rem)] flex flex-col animate-pulse">
      {/* Header skeleton */}
      <div className="p-4 pb-0 flex-shrink-0">
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </div>
      
      {/* Content skeleton */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-4 space-y-6">
          {/* Filtros de atributos skeleton */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="pb-3">
              <div className="h-5 bg-gray-200 rounded w-20 mb-3"></div>
              
              {/* Valores del filtro skeleton */}
              <div className="space-y-2">
                {i === 0 ? (
                  // Para colores, mostrar círculos
                  <div className="grid grid-cols-4 gap-1">
                    {[...Array(8)].map((_, j) => (
                      <div key={j} className="w-6 h-6 bg-gray-200 rounded-lg"></div>
                    ))}
                  </div>
                ) : (
                  // Para otros atributos, mostrar checkboxes
                  <div className="space-y-2">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Filtro de precio skeleton */}
          <div className="pb-4">
            <div className="h-5 bg-gray-200 rounded w-12 mb-3"></div>
            <div className="space-y-3">
              <div>
                <div className="h-3 bg-gray-200 rounded w-8 mb-1"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-l"></div>
                  <div className="flex-1 h-8 bg-gray-200 rounded-r"></div>
                </div>
              </div>
              <div>
                <div className="h-3 bg-gray-200 rounded w-8 mb-1"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-l"></div>
                  <div className="flex-1 h-8 bg-gray-200 rounded-r"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer skeleton */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg flex-shrink-0">
        <div className="flex gap-3">
          <div className="flex-1 h-10 bg-gray-200 rounded"></div>
          <div className="flex-1 h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    </aside>
  );
};

export const FilterMobileSkeleton = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm animate-pulse">
      {/* Header skeleton */}
      <div className="p-4 border-b border-gray-200">
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </div>
      
      {/* Content skeleton */}
      <div className="max-h-96 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Filtros de atributos skeleton */}
          {[...Array(2)].map((_, i) => (
            <div key={i} className="pb-3">
              <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
              
              {/* Valores del filtro skeleton */}
              <div className={i === 0 ? "grid grid-cols-6 gap-2" : "space-y-2"}>
                {i === 0 ? (
                  // Para colores
                  [...Array(6)].map((_, j) => (
                    <div key={j} className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                  ))
                ) : (
                  // Para otros atributos
                  [...Array(3)].map((_, j) => (
                    <div key={j} className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-12"></div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}

          {/* Filtro de precio skeleton */}
          <div className="pb-4">
            <div className="h-4 bg-gray-200 rounded w-12 mb-2"></div>
            <div className="space-y-3">
              <div>
                <div className="h-3 bg-gray-200 rounded w-6 mb-1"></div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gray-200 rounded-l"></div>
                  <div className="flex-1 h-6 bg-gray-200 rounded-r"></div>
                </div>
              </div>
              <div>
                <div className="h-3 bg-gray-200 rounded w-6 mb-1"></div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gray-200 rounded-l"></div>
                  <div className="flex-1 h-6 bg-gray-200 rounded-r"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer skeleton */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <div className="flex gap-2">
          <div className="flex-1 h-8 bg-gray-200 rounded"></div>
          <div className="flex-1 h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};
