export const SortOptionsSkeleton = () => {
  return (
    <div className="px-4 animate-pulse">
      <div className="flex items-center justify-end space-x-4">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="flex space-x-1">
          {/* Botones de ordenamiento skeleton */}
          {[...Array(1)].map((_, i) => (
            <div key={i} className="w-20 h-10 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ToolbarSkeleton = () => {
  return (
    <div className="pt-4 px-4 lg:px-0 animate-pulse">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center lg:justify-end">
        {/* Botón de filtros móvil skeleton (solo visible en móvil) */}
        <div className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-gray-200 rounded-lg">
          <div className="w-5 h-5 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-12"></div>
        </div>

        {/* Sort Options skeleton */}
        <SortOptionsSkeleton />
      </div>
    </div>
  );
};
