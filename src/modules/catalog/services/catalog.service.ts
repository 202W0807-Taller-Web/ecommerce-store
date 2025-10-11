import axios, { type AxiosResponse } from 'axios';
import { 
  type Product, 
  type ProductSummary,
  type FrontendProduct,
  type FrontendProductSummary,
  type Atributo,
  type ProductFilters, 
  type PaginationParams, 
  type PaginationResult,
} from '../types';
import { enhanceProduct } from '../utils/variants.utils';

/**
 * Funciones de transformación de datos
 */

// Formatear producto para listado con datos de UI
function formatearProducto(producto: ProductSummary): FrontendProductSummary {
  const tienePromocion = producto.tienePromocion;
  
  return {
    id: producto.id,
    nombre: producto.nombre,
    precio: producto.precio,
    imagen: producto.imagen,
    tienePromocion,
    precioOriginal: tienePromocion ? producto.precio * 1.3 : undefined,
    rating: 0, // Se pasará como parámetro en el componente
    reviewCount: 0, 
    isPromo: tienePromocion
  };
}

export class CatalogService {
  private baseUrl: string;

  constructor() {

    this.baseUrl = import.meta.env.DEV 
      ? '' // Usar proxy de Vite en desarrollo
      : import.meta.env.VITE_CATALOG_API_URL || '';
  }

  /**
   * Obtener lista de productos desde la API (GET /api/productos/listado)
   */
  private async fetchProducts(): Promise<ProductSummary[]> {
    // En desarrollo, usar proxy (baseUrl vacío)
    if (!import.meta.env.DEV && !this.baseUrl) {
      throw new Error('VITE_CATALOG_API_URL no está configurada. Configura la variable de entorno para conectar con el backend.');
    }

    try {
      const url = import.meta.env.DEV 
        ? '/api/productos/listado'  // Proxy en desarrollo
        : `${this.baseUrl}/api/productos/listado`;  // URL directa en producción
      
      const response: AxiosResponse<ProductSummary[]> = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching products from API:', error);
      throw new Error('No se pudieron cargar los productos desde el servidor. Verifica tu conexión.');
    }
  }

  /**
   * Obtener detalle de producto desde la API (GET /api/productos/:id)
   */
  private async fetchProductDetail(id: number): Promise<Product | null> {
    if (!import.meta.env.DEV && !this.baseUrl) {
      throw new Error('VITE_CATALOG_API_URL no está configurada. Configura la variable de entorno para conectar con el backend.');
    }

    try {
      const url = import.meta.env.DEV 
        ? `/api/productos/${id}`  // Proxy en desarrollo
        : `${this.baseUrl}/api/productos/${id}`;  // URL directa en producción
      
      const response: AxiosResponse<Product> = await axios.get(url);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null; // Producto no encontrado
      }
      console.error(`Error fetching product detail for ID ${id} from API:`, error);
      throw new Error(`No se pudo cargar el producto con ID ${id} desde el servidor. Verifica tu conexión.`);
    }
  }

  /**
   * Obtener productos con filtros y paginación
   */
  async getProducts(
    filters: ProductFilters = {}, 
    pagination: PaginationParams = { page: 1, limit: 12 }
  ): Promise<PaginationResult<FrontendProductSummary>> {
    // Obtener datos de la API real
    const apiProducts = await this.fetchProducts();
    
    // Formatear productos para UI
    const productSummaries: FrontendProductSummary[] = apiProducts.map((apiProduct) => 
      formatearProducto(apiProduct)
    );

    // Aplicar filtros (simulados en el frontend por ahora)
    let filteredProducts = [...productSummaries];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.nombre.toLowerCase().includes(searchTerm)
      );
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
  async getProductDetail(id: number): Promise<FrontendProduct | null> {
    const apiProduct = await this.fetchProductDetail(id);
    if (!apiProduct) return null;
    
    return enhanceProduct(apiProduct);
  }



  /**
   * Obtener productos con descuento
   */
  async getDiscountedProducts(limit: number = 8): Promise<FrontendProductSummary[]> {
    const apiProducts = await this.fetchProducts();
    const transformedProducts = apiProducts
      .map((apiProduct) => formatearProducto(apiProduct))
      .filter(p => p.isPromo); // Solo productos en promoción
    
    return transformedProducts.slice(0, limit);
  }

  /**
   * Buscar productos por query
   */
  async searchProducts(query: string, filters?: Partial<ProductFilters>): Promise<FrontendProductSummary[]> {
    const allProducts = await this.fetchProducts();
    const transformedProducts = allProducts.map((apiProduct) => formatearProducto(apiProduct));
    
    // Aplicar búsqueda
    const searchTerm = query.toLowerCase();
    let filteredProducts = transformedProducts.filter(p => 
      p.nombre.toLowerCase().includes(searchTerm)
    );

    // Aplicar filtros adicionales si se proporcionan
    if (filters) {
      if (filters.priceMin) {
        filteredProducts = filteredProducts.filter(p => p.precio >= filters.priceMin!);
      }
      if (filters.priceMax) {
        filteredProducts = filteredProducts.filter(p => p.precio <= filters.priceMax!);
      }
    }

    return filteredProducts;
  }

  /**
   * Obtener todos los atributos disponibles (GET /api/atributos)
   */
  async getAtributos(): Promise<Atributo[]> {
    if (!import.meta.env.DEV && !this.baseUrl) {
      throw new Error('VITE_CATALOG_API_URL no está configurada. Configura la variable de entorno para conectar con el backend.');
    }

    try {
      const url = import.meta.env.DEV 
        ? '/api/atributos'  // Proxy en desarrollo
        : `${this.baseUrl}/api/atributos`;  // URL directa en producción
      
      const response: AxiosResponse<Atributo[]> = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching atributos from API:', error);
      throw new Error('No se pudieron cargar los atributos desde el servidor. Verifica tu conexión.');
    }
  }


}
