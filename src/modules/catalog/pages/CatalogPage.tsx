import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useCatalog } from "../hooks/useCatalog";
import { type ProductFilters } from "../types";
import { FilterSidebar, ProductCard, SortOptions, Pagination } from "../components/catalog";

export const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, error, fetchProducts } = useCatalog();
  
  // Estados para filtros y paginación - mantiene la URL sincronizada
  const [filters, setFilters] = useState<ProductFilters>(() => {
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const priceMin = searchParams.get('priceMin') || '';
    const priceMax = searchParams.get('priceMax') || '';
    const rating = searchParams.get('rating') || '';
    const inStock = searchParams.get('inStock') === 'true';
    
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
    currentPage: Number(searchParams.get('page')) || 1,
    itemsPerPage: Number(searchParams.get('limit')) || 12,
    currentSort: 'price',
  });

  // Cargar productos cuando cambian filtros/paginación
  useEffect(() => {
    // Sincronizar URL con filtros
    const params = new URLSearchParams();
    
    if (filters.search) params.set('search', filters.search);
    if (filters.category) params.set('category', filters.category);
    if (filters.priceMin) params.set('priceMin', filters.priceMin.toString());
    if (filters.priceMax) params.set('priceMax', filters.priceMax.toString());
    if (filters.rating) params.set('rating', filters.rating.toString());
    if (filters.inStock) params.set('inStock', filters.inStock.toString());
    
    params.set('page', pagination.currentPage.toString());
    params.set('limit', pagination.itemsPerPage.toString());
    
    setSearchParams(params);
    
    // Cargar productos
    fetchProducts(filters, { page: pagination.currentPage, limit: pagination.itemsPerPage });
  }, [filters, pagination.currentPage, pagination.itemsPerPage, fetchProducts, setSearchParams]);

  const handleFilterChange = (key: keyof ProductFilters, value: unknown) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset página al cambiar filtros
  };

  const removeFilters = () => setFilters({});

  if (error) {
    return (

        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            Recargar página
          </button>
        </div>

    );
  }

  return (
    
      <div className="flex min-h-screen">
        
        {/* Sidebar de filtros fijo */}
        <div className="w-76 flex-shrink-0">
          <FilterSidebar 
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={removeFilters}
          />
        </div>

        {/* Contenido principal */}
        <div className="ml-4 flex-1 bg-white border rounded-lg border-gray-200">
          
          {/* Sort Options */}
          <div className="pt-4">
            <SortOptions 
              currentSort={pagination.currentSort}
              onSortChange={(sort) => setPagination(prev => ({ ...prev, currentSort: sort }))}
            />
          </div>

          {/* Grid de productos */}
          {!loading && (
            <>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.data.map((product, index) => (
                    <ProductCard 
                      key={product.id} 
                      product={{
                        ...product,
                        isPromo: index % 3 === 1 // Simular algunos productos como promoción
                      }}
                    />
                  ))}
                </div>

                {/* Estado vacío */}
                {products.data.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-500 text-lg mb-4">
                      No se encontraron productos con los filtros seleccionados
                    </div>
                    <button 
                      onClick={removeFilters}  
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition-colors"
                    >
                      Limpiar filtros
                    </button>
                  </div>
                )}
              </div>

              {/* Paginación */}
              <div className="">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={products.totalPages}
                  onPageChange={(page) => setPagination(prev => ({ ...prev, currentPage: page }))}
                  itemsPerPage={pagination.itemsPerPage}
                  onItemsPerPageChange={(itemsPerPage) => setPagination(prev => ({ ...prev, itemsPerPage, currentPage: 1 }))}
                  total={products.total}
                />
              </div>
            </>
          )}

          {/* Estado de carga */}
          {loading && (
            <div className="p-6 text-center py-12">
              <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-gray-500 transition duration-150 ease-in-out">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Cargando productos...
              </div>
            </div>
          )}
        </div>
      </div>
  );
};

export default CatalogPage;