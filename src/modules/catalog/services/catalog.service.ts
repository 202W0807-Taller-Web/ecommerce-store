import { 
  type Product, 
  type ProductSummary,
  type ProductWithUI,
  type ProductSummaryWithUI,
  type Atributo,
  type ProductFilters, 
  type PaginationParams, 
  type PaginationResult,
  type Category,
} from '../types';
import { enhanceProductWithUI } from '../utils/variants.utils';
import { MOCK_ATRIBUTOS } from '../mocks/atributos.mock';
import { generarProductosMock, generarProductoDetalleMock } from '../mocks/productos.mock';

/**
 * Funciones de transformación de datos
 */

// Formatear producto para listado con datos de UI
function formatearProducto(producto: ProductSummary): ProductSummaryWithUI {
  const tienePromocion = producto.tienePromocion;
  
  return {
    id: producto.id,
    nombre: producto.nombre,
    precio: producto.precio,
    imagen: producto.imagen,
    tienePromocion,
    precioOriginal: tienePromocion ? producto.precio * 1.3 : undefined,
    categoria: 'Categoría Mock', // TODO: Obtener de productoAtributos
    rating: 0, // Se pasará como parámetro en el componente
    reviewCount: 0, // Se pasará como parámetro en el componente
    isPromo: tienePromocion
  };
}

/**
 * Servicio simplificado para el catálogo
 * Consolida toda la lógica de negocio sin capas innecesarias
 */
export class CatalogService {
  private mockCategories: Category[] = [];

  constructor() {
    this.initializeMockData();
  }

  /**
   * Simular llamada a API real para obtener lista de productos (GET /product/listado)
   */
  private async fetchProductsFromApi(): Promise<ProductSummary[]> {
    // TODO: Reemplazar con llamada real a la API
    // const response = await fetch('/api/product/listado');
    // return await response.json();
    
    return generarProductosMock();
  }

  /**
   * Simular llamada a API real para obtener detalle de producto (GET /product/:id)
   */
  private async fetchProductDetailFromApi(id: number): Promise<Product | null> {
    // TODO: Reemplazar con llamada real a la API
    // const response = await fetch(`/api/product/${id}`);
    // return await response.json();
    
    return generarProductoDetalleMock(id);
  }

  /**
   * Obtener productos con filtros y paginación
   */
  async getProducts(
    filters: ProductFilters = {}, 
    pagination: PaginationParams = { page: 1, limit: 12 }
  ): Promise<PaginationResult<ProductSummaryWithUI>> {
    // Obtener datos de la API real
    const apiProducts = await this.fetchProductsFromApi();
    
    // Formatear productos para UI
    const productSummaries: ProductSummaryWithUI[] = apiProducts.map((apiProduct) => 
      formatearProducto(apiProduct)
    );

    // Aplicar filtros (simulados en el frontend por ahora)
    let filteredProducts = [...productSummaries];

    if (filters.search) {
      filteredProducts = filteredProducts.filter(p => 
        p.nombre.toLowerCase().includes(filters.search!.toLowerCase()) ||
        p.categoria.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    if (filters.category) {
      filteredProducts = filteredProducts.filter(p => p.categoria === filters.category);
    }

    if (filters.priceMin) {
      filteredProducts = filteredProducts.filter(p => p.precio >= filters.priceMin!);
    }

    if (filters.priceMax) {
      filteredProducts = filteredProducts.filter(p => p.precio <= filters.priceMax!);
    }

    if (filters.rating) {
      filteredProducts = filteredProducts.filter(p => p.rating >= filters.rating!);
    }

    // Aplicar ordenamiento
    if (filters.sortBy) {
      filteredProducts.sort((a, b) => {
        let valueA: string | number;
        let valueB: string | number;
        
        switch (filters.sortBy) {
          case 'price':
            valueA = a.precio;
            valueB = b.precio;
            break;
          case 'rating':
            valueA = a.rating;
            valueB = b.rating;
            break;
          case 'popularity':
            valueA = a.reviewCount;
            valueB = b.reviewCount;
            break;
          default:
            valueA = a.nombre;
            valueB = b.nombre;
        }

        if (typeof valueA === 'string' && typeof valueB === 'string') {
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
        }

        const multiplier = filters.sortOrder === 'desc' ? -1 : 1;
        if (valueA > valueB) return multiplier;
        if (valueA < valueB) return -multiplier;
        return 0;
      });
    }

    // Aplicar paginación
    const total = filteredProducts.length;
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      data: paginatedProducts,
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
      hasNext: pagination.page < Math.ceil(total / pagination.limit),
      hasPrev: pagination.page > 1
    };
  }

  /**
   * Obtener detalles de un producto específico
   */
  async getProductDetail(id: number): Promise<ProductWithUI | null> {
    const apiProduct = await this.fetchProductDetailFromApi(id);
    if (!apiProduct) return null;
    
    return enhanceProductWithUI(apiProduct);
  }

  /**
   * Buscar productos por término de búsqueda
   */
  async searchProducts(query: string, filters?: Partial<ProductFilters>): Promise<ProductSummaryWithUI[]> {
    const searchFilters: ProductFilters = { search: query, ...filters };
    const result = await this.getProducts(searchFilters, { page: 1, limit: 50 });
    return result.data;
  }

  /**
   * Obtener productos recomendados
   */
  async getRecommendedProducts(excludeId?: number, limit: number = 8): Promise<ProductSummaryWithUI[]> {
    const apiProducts = await this.fetchProductsFromApi();
    const transformedProducts = apiProducts
      .map((apiProduct) => formatearProducto(apiProduct))
      .filter(p => p.id !== excludeId);
    
    const shuffled = [...transformedProducts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  }

  /**
   * Obtener productos relacionados
   */
  async getRelatedProducts(productId: number, limit: number = 4): Promise<ProductSummaryWithUI[]> {
    const apiProducts = await this.fetchProductsFromApi();
    const transformedProducts = apiProducts
      .map((apiProduct) => formatearProducto(apiProduct))
      .filter(p => p.id !== productId);
    
    return transformedProducts.slice(0, limit);
  }

  /**
   * Obtener todas las categorías
   */
  async getCategories(): Promise<Category[]> {
    return this.mockCategories.filter(c => c.isActive);
  }


  /**
   * Obtener productos con descuento
   */
  async getDiscountedProducts(limit: number = 8): Promise<ProductSummaryWithUI[]> {
    const apiProducts = await this.fetchProductsFromApi();
    const transformedProducts = apiProducts
      .map((apiProduct) => formatearProducto(apiProduct))
      .filter(p => p.isPromo); // Solo productos en promoción
    
    return transformedProducts.slice(0, limit);
  }

  /**
   * Obtener todos los atributos disponibles (GET /atributos)
   */
  async getAtributos(): Promise<Atributo[]> {
    // TODO: Reemplazar con llamada real a la API
    // const response = await fetch('/api/atributos');
    // return await response.json();
    
    return MOCK_ATRIBUTOS;
  }

  /**
   * Inicializar datos mock
   */
  private initializeMockData(): void {
    this.initializeCategories();
  }

  private initializeCategories(): void {
    this.mockCategories = [
      { id: 'electronics', name: 'Electronics', slug: 'electronics', productCount: 25, isActive: true },
      { id: 'clothing', name: 'Clothing', slug: 'clothing', productCount: 20, isActive: true },
      { id: 'home', name: 'Home', slug: 'home', productCount: 15, isActive: true },
      { id: 'sports', name: 'Sports', slug: 'sports', productCount: 10, isActive: true },
      { id: 'books', name: 'Books', slug: 'books', productCount: 8, isActive: true }
    ];
  }

}
