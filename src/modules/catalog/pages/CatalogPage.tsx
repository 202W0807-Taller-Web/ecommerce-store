import { useState, useEffect } from "react";
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
    const priceMin = searchParams.get("priceMin") || "";
    const priceMax = searchParams.get("priceMax") || "";
    const rating = searchParams.get("rating") || "";
    const inStock = searchParams.get("inStock") === "true";

    return {
      search: search || undefined,
      category: category || undefined,
      priceMin: priceMin ? Number(priceMin) : undefined,
      priceMax: priceMax ? Number(priceMax) : undefined,
      rating: rating ? Number(rating) : undefined,
      inStock: inStock || undefined,
    };
  });

  const [pagination, setPagination] = useState({
    currentPage: Number(searchParams.get("page")) || 1,
    itemsPerPage: Number(searchParams.get("limit")) || 12,
    currentSort: "price",
  });

  // Estado para el modal de filtros en móvil
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Cargar productos cuando cambian filtros/paginación
  useEffect(() => {
    // Cargar productos con los filtros actuales
    fetchProducts(filters, {
      page: pagination.currentPage,
      limit: pagination.itemsPerPage,
    });
  }, [
    filters,
    pagination.currentPage,
    pagination.itemsPerPage,
    fetchProducts,
  ]);

  // Sincronizar URL cuando cambien los filtros desde la UI
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.priceMin) params.set("priceMin", filters.priceMin.toString());
    if (filters.priceMax) params.set("priceMax", filters.priceMax.toString());
    if (filters.rating) params.set("rating", filters.rating.toString());
    if (filters.inStock) params.set("inStock", filters.inStock.toString());

    params.set("page", pagination.currentPage.toString());
    params.set("limit", pagination.itemsPerPage.toString());

    // Actualizar URL sin recargar la página
    setSearchParams(params, { replace: true });
  }, [filters, pagination, setSearchParams]);

  const handleFilterChange = (key: keyof ProductFilters, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset página al cambiar filtros
  };

  const removeFilters = () => setFilters({});

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
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={removeFilters}
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
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={removeFilters}
        onApplyFilters={() => {
          // Los filtros se aplican automáticamente cuando cambian
          // No necesitamos hacer nada adicional aquí
        }}
        loading={loading}
      />
    </div>
  );
};

export default CatalogPage;
