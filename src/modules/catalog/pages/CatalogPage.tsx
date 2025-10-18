import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useCatalog } from "../hooks/useCatalog";
import { type ProductFilters } from "../types";
import {
  FilterSidebar,
  FilterModal,
  ProductCard,
  SortOptions,
  Pagination,
} from "../components/catalog";
import {
  ProductGridSkeleton,
  FilterSidebarSkeleton,
  ToolbarSkeleton,
} from "../components/skeletons";

export const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, error, fetchProducts } = useCatalog();

  // Estados para filtros y paginación - mantiene la URL sincronizada
  const [filters, setFilters] = useState<ProductFilters>(() => {
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const color = searchParams.get("color") || "";
    const size = searchParams.get("size") || "";
    const unit = searchParams.get("unit") || "";
    const priceMin = searchParams.get("priceMin") || "";
    const priceMax = searchParams.get("priceMax") || "";
    const rating = searchParams.get("rating") || "";
    const inStock = searchParams.get("inStock") === "true";

    return {
      search: search || undefined,
      category: category ? category.split(',') : undefined,
      color: color ? color.split(',') : undefined,
      size: size ? size.split(',') : undefined,
      unit: unit ? unit.split(',') : undefined,
      priceMin: priceMin ? Number(priceMin) : undefined,
      priceMax: priceMax ? Number(priceMax) : undefined,
      rating: rating ? Number(rating) : undefined,
      inStock: inStock || undefined,
    };
  });

  const [pagination, setPagination] = useState({
    currentPage: Number(searchParams.get("page")) || 1,
    itemsPerPage: Number(searchParams.get("limit")) || 3,
    currentSort: "price",
  });

  // Estado para el modal de filtros en móvil
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Estado separado para filtros de precio (con debounce)
  const [priceFilters, setPriceFilters] = useState({
    priceMin: filters.priceMin,
    priceMax: filters.priceMax,
  });

  // Ref para el timeout del debounce
  const priceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Estado para controlar cuándo aplicar filtros
  const [shouldApplyFilters, setShouldApplyFilters] = useState(false);

  // Estado para mensajes de error de validación
  const [priceErrors, setPriceErrors] = useState<{
    priceMin?: string;
    priceMax?: string;
  }>({});

  // Función para manejar cambios de precio (sin debounce automático)
  const handlePriceChange = useCallback((key: 'priceMin' | 'priceMax', value: number | undefined) => {
    // Limpiar errores previos
    setPriceErrors(prev => ({ ...prev, [key]: undefined }));

    // Validar que no sea negativo
    if (value !== undefined && value < 0) {
      setPriceErrors(prev => ({ 
        ...prev, 
        [key]: 'El precio no puede ser negativo' 
      }));
      return; // No actualizar si es negativo
    }

    // Validar que precio máximo no sea menor que precio mínimo
    if (key === 'priceMax' && value !== undefined && priceFilters.priceMin !== undefined && value < priceFilters.priceMin) {
      setPriceErrors(prev => ({ 
        ...prev, 
        priceMax: 'El precio máximo no puede ser menor que el precio mínimo' 
      }));
      return; // No actualizar si precio máximo es menor que precio mínimo
    }

    if (key === 'priceMin' && value !== undefined && priceFilters.priceMax !== undefined && value > priceFilters.priceMax) {
      setPriceErrors(prev => ({ 
        ...prev, 
        priceMin: 'El precio mínimo no puede ser mayor que el precio máximo' 
      }));
      return; // No actualizar si precio mínimo es mayor que precio máximo
    }

    // Solo actualizar el estado local, no aplicar filtros automáticamente
    setPriceFilters(prev => ({ ...prev, [key]: value }));
  }, [priceFilters.priceMin, priceFilters.priceMax]);

  // Cargar productos automáticamente al montar el componente
  useEffect(() => {
    fetchProducts(filters, {
      page: pagination.currentPage,
      limit: pagination.itemsPerPage,
    });
  }, []); // Solo ejecutar una vez al montar

  // Cargar productos solo cuando se presione el botón de aplicar filtros
  useEffect(() => {
    if (shouldApplyFilters) {
      const filtersWithPrice = {
        ...filters,
        priceMin: priceFilters.priceMin,
        priceMax: priceFilters.priceMax,
      };
      fetchProducts(filtersWithPrice, {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
      });
      setShouldApplyFilters(false);
    }
  }, [shouldApplyFilters, filters, priceFilters, pagination.currentPage, pagination.itemsPerPage, fetchProducts]);

  // Sincronizar estado de precio cuando cambien los filtros desde la URL
  useEffect(() => {
    setPriceFilters({
      priceMin: filters.priceMin,
      priceMax: filters.priceMax,
    });
  }, [filters.priceMin, filters.priceMax]);

  // Limpiar timeout al desmontar el componente
  useEffect(() => {
    return () => {
      if (priceTimeoutRef.current) {
        clearTimeout(priceTimeoutRef.current);
        priceTimeoutRef.current = null;
      }
    };
  }, []);

  // Sincronizar URL cuando cambien los filtros desde la UI (solo filtros aplicados)
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.search) params.set("search", filters.search);
    if (filters.category && filters.category.length > 0) params.set("category", filters.category.join(','));
    if (filters.color && filters.color.length > 0) params.set("color", filters.color.join(','));
    if (filters.size && filters.size.length > 0) params.set("size", filters.size.join(','));
    if (filters.unit && filters.unit.length > 0) params.set("unit", filters.unit.join(','));
    // Usar filters.priceMin/priceMax (solo valores aplicados, no locales)
    if (filters.priceMin) params.set("priceMin", filters.priceMin.toString());
    if (filters.priceMax) params.set("priceMax", filters.priceMax.toString());
    if (filters.rating) params.set("rating", filters.rating.toString());
    if (filters.inStock) params.set("inStock", filters.inStock.toString());

    params.set("page", pagination.currentPage.toString());
    params.set("limit", pagination.itemsPerPage.toString());

    // Actualizar URL sin recargar la página
    setSearchParams(params, { replace: true });
  }, [
    filters.search,
    filters.category,
    filters.color,
    filters.size,
    filters.unit,
    filters.rating,
    filters.inStock,
    filters.tags,
    filters.priceMin,  // ✅ Usar filters en lugar de priceFilters
    filters.priceMax,  // ✅ Usar filters en lugar de priceFilters
    pagination,
    setSearchParams
  ]);

  const handleFilterChange = (key: keyof ProductFilters, value: unknown) => {
    // Si es un filtro de precio, usar la función sin debounce
    if (key === 'priceMin' || key === 'priceMax') {
      handlePriceChange(key, value as number | undefined);
    } else {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset página al cambiar filtros
    }
  };

  // Función para aplicar filtros manualmente
  const applyFilters = () => {
    // Validar que no haya errores antes de aplicar
    if (priceErrors.priceMin || priceErrors.priceMax) {
      return; // No aplicar si hay errores
    }

    // Actualizar los filtros con los valores de precio
    setFilters(prev => ({
      ...prev,
      priceMin: priceFilters.priceMin,
      priceMax: priceFilters.priceMax,
    }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    setShouldApplyFilters(true);
  };

  // Crear objeto de filtros que incluya los valores locales de precio para los inputs
  const filtersForInputs = {
    ...filters,
    priceMin: priceFilters.priceMin,
    priceMax: priceFilters.priceMax,
  };

  const removeFilters = () => {
    setFilters({});
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-accent transition-colors"
        >
          Recargar página
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        {/* Sidebar de filtros */}
        <div className="hidden lg:block w-76 flex-shrink-0">
          {loading ? (
            <FilterSidebarSkeleton />
          ) : (
            <FilterSidebar
              filters={filtersForInputs}
              onFilterChange={handleFilterChange}
              onClearFilters={removeFilters}
              onApplyFilters={applyFilters}
              priceErrors={priceErrors}
            />
          )}
        </div>

        {/* Contenido principal */}
        <div className="lg:ml-4 flex-1 bg-white border rounded-lg border-gray-200 flex flex-col">
          {/* Barra de herramientas - Sort Options + Filtros móvil */}
          {loading ? (
            <ToolbarSkeleton />
          ) : (
            <div className="pt-4 px-4 lg:px-0">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center lg:justify-end">
                {/* Botón de filtros para móvil */}
                <button
                  onClick={() => setIsFilterModalOpen(true)}
                  className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
                    />
                  </svg>
                  <span className="text-sm font-medium">Filtros</span>
                </button>

                {/* Sort Options */}
                <SortOptions
                  currentSort={pagination.currentSort}
                  onSortChange={(sort) =>
                    setPagination((prev) => ({ ...prev, currentSort: sort }))
                  }
                />
              </div>
            </div>
          )}

          {/* Grid de productos */}
          <div className="p-6 flex-1">
            {loading ? (
              <ProductGridSkeleton count={12} />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.data.map((product) => {
                      // Generar datos hardcodeados para cada producto
                      const mockRating = 4.2 + (product.id % 3) * 0.2; // Rating entre 4.2 y 4.6
                      const mockReviewCount = 120 + product.id * 15; // Productos vendidos entre 120 y 870

                      return (
                        <ProductCard
                          key={product.id}
                          product={{
                            ...product,
                            rating: mockRating,
                            reviewCount: mockReviewCount,
                          }}
                        />
                      );
                    })}
                </div>

                {/* Estado vacío */}
                {products.data.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-500 text-lg mb-4">
                      No se encontraron productos con los filtros seleccionados
                    </div>
                    <button
                      onClick={removeFilters}
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-a transition-colors"
                    >
                      Limpiar filtros
                    </button>
                  </div>
                )}
              </>
            )}
            {/* Paginación */}
            {!loading && (
              <div className="flex-2">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={products.totalPages || 1}
                onPageChange={(page) =>
                  setPagination((prev) => ({ ...prev, currentPage: page }))
                }
                itemsPerPage={pagination.itemsPerPage}
                onItemsPerPageChange={(itemsPerPage) =>
                  setPagination((prev) => ({
                    ...prev,
                    itemsPerPage,
                    currentPage: 1,
                  }))
                }
                total={products.total}
              /> 
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de filtros para móvil */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filtersForInputs}
        onFilterChange={handleFilterChange}
        onClearFilters={removeFilters}
        onApplyFilters={applyFilters}
        loading={loading}
        priceErrors={priceErrors}
      />
    </div>
  );
};

export default CatalogPage;
