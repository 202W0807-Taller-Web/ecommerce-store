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
  private async fetchProducts(
    pagination?: PaginationParams, 
    filters?: ProductFilters
  ): Promise<{
    data: ProductSummary[];
    total: number;
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
  }> {
    // En desarrollo, usar proxy (baseUrl vacío)
    if (!import.meta.env.DEV && !this.baseUrl) {
      throw new Error('VITE_CATALOG_API_URL no está configurada. Configura la variable de entorno para conectar con el backend.');
    }

    try {
      const url = import.meta.env.DEV 
        ? '/api/productos/listado'  // Proxy en desarrollo
        : `${this.baseUrl}/api/productos/listado`;  // URL directa en producción
      
      // Agregar parámetros de paginación y filtros a la URL
      const params = new URLSearchParams();
      
      // Parámetros de paginación
      if (pagination) {
        params.append('PageNumber', pagination.page.toString());
        params.append('PageSize', pagination.limit.toString());
      }
      
      // Parámetros de filtros
      if (filters) {
        // Combinar todos los atributos que no sean talla, color o unidad de medida bajo "Categoria"
        const categorias = [];
        if (filters.category && filters.category.length > 0) {
          categorias.push(...filters.category);
        }
        // Agregar otros atributos que no sean talla, color o unidad de medida
        if (filters.tags && filters.tags.length > 0) {
          categorias.push(...filters.tags);
        }
        
        params.append('Categoria', categorias.join(',') || '');
        params.append('Color', filters.color?.join(',') || '');
        params.append('Talla', filters.size?.join(',') || '');
        params.append('PrecioMin', filters.priceMin?.toString() || '');
        params.append('PrecioMax', filters.priceMax?.toString() || '');
      }
      
      const fullUrl = params.toString() ? `${url}?${params.toString()}` : url;
      const response: AxiosResponse<{
        data: ProductSummary[];
        total: number;
        currentPage: number;
        itemsPerPage: number;
        totalPages: number;
      }> = await axios.get(fullUrl);
      
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
    pagination: PaginationParams = { page: 1, limit: 3 }
  ): Promise<PaginationResult<FrontendProductSummary>> {
    // Obtener datos de la API real con paginación y filtros
    const apiResponse = await this.fetchProducts(pagination, filters);
    
    // Formatear productos para UI
    const productSummaries: FrontendProductSummary[] = apiResponse.data.map((apiProduct) => 
      formatearProducto(apiProduct)
    );

    // Los filtros principales (categoría, precio) ya se aplican en la API
    // Solo aplicamos filtros adicionales del frontend
    let filteredProducts = [...productSummaries];

    // Búsqueda por texto (si no está soportada en la API)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.nombre.toLowerCase().includes(searchTerm)
      );
    }

    // Filtro por rating (si no está soportado en la API)
    if (filters.rating) {
      filteredProducts = filteredProducts.filter(p => p.rating >= filters.rating!);
    }

    // Aplicar ordenamiento (si no está soportado en la API)
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

    // Usar los datos de paginación de la API
    return {
      data: filteredProducts,
      total: apiResponse.total,
      page: apiResponse.currentPage,
      limit: apiResponse.itemsPerPage,
      totalPages: apiResponse.totalPages,
      hasNext: apiResponse.currentPage < apiResponse.totalPages,
      hasPrev: apiResponse.currentPage > 1
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
    const apiResponse = await this.fetchProducts({ page: 1, limit: 100 }); // Obtener más productos para filtrar
    const transformedProducts = apiResponse.data
      .map((apiProduct) => formatearProducto(apiProduct))
      .filter(p => p.isPromo); // Solo productos en promoción
    
    return transformedProducts.slice(0, limit);
  }

  /**
   * Buscar productos por query
   */
  async searchProducts(query: string, filters?: Partial<ProductFilters>): Promise<FrontendProductSummary[]> {
    // Crear filtros de búsqueda combinando query con filtros existentes
    const searchFilters: ProductFilters = {
      search: query,
      ...filters
    };
    
    const apiResponse = await this.fetchProducts({ page: 1, limit: 100 }, searchFilters);
    const transformedProducts = apiResponse.data.map((apiProduct) => formatearProducto(apiProduct));
    
    // Aplicar filtros adicionales si se proporcionan
    let filteredProducts = transformedProducts;
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
