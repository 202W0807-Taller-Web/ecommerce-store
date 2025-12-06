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
    rating: 0, 
    reviewCount: 0, 
    isPromo: tienePromocion
  };
}

export class CatalogService {
  private baseUrl: string;

  constructor() {

    this.baseUrl = import.meta.env.DEV 
      ? '' 
      : import.meta.env.VITE_CATALOG_API_URL || '';
  }

  /**
   * Obtener lista de productos desde la API (GET /api/productos/listado)
   */
  private async fetchProducts(
    pagination?: PaginationParams, 
    filters?: ProductFilters,
    sortBy?: string
  ): Promise<{
    data: ProductSummary[];
    total: number;
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
  }> {
    
    if (!import.meta.env.DEV && !this.baseUrl) {
      throw new Error('VITE_CATALOG_API_URL no está configurada. Configura la variable de entorno para conectar con el backend.');
    }

    try {
      const url = import.meta.env.DEV 
        ? '/api/productos/listado'  
        : `${this.baseUrl}/api/productos/listado`;  
      
      
      const params = new URLSearchParams();
      
      // Parámetros de paginación
      if (pagination) {
        if (pagination.page != null) {
          params.append('PageNumber', pagination.page.toString());
        }
        if (pagination.limit != null) {
          params.append('PageSize', pagination.limit.toString());
        }
      }
      
      // Parámetros de ordenamiento
      if (sortBy) {
        if (sortBy === 'price asc') {
          params.append('SortBy', 'Precio');
          params.append('IsDescending', 'false');
        } else if (sortBy === 'price desc') {
          params.append('SortBy', 'Precio');
          params.append('IsDescending', 'true');
        }
      }
      
      // Parámetros de filtros
      if (filters) {
        const categorias: string[] = [];
        if (filters.category && filters.category.length > 0) {
          categorias.push(...filters.category);
        }
        
        if (filters.tags && filters.tags.length > 0) {
          categorias.push(...filters.tags);
        }
        
        if (categorias.length > 0) {
          params.append('Categoria', categorias.join(','));
        }
        
        if (filters.color && filters.color.length > 0) {
          params.append('Color', filters.color.join(','));
        }
        
        if (filters.size && filters.size.length > 0) {
          params.append('Talla', filters.size.join(','));
        }
        
        if (filters.priceMin != null) {
          params.append('PrecioMin', filters.priceMin.toString());
        }
        
        if (filters.priceMax != null) {
          params.append('PrecioMax', filters.priceMax.toString());
        }
        
        if (filters.search && filters.search.trim() !== '') {
          params.append('Search', filters.search);
        }
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
        ? `/api/productos/${id}`  
        : `${this.baseUrl}/api/productos/${id}`;  
      
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
    pagination: PaginationParams = { page: 1, limit: 9 },
    sortBy?: string
  ): Promise<PaginationResult<FrontendProductSummary>> {
    // Obtener datos de la API real con paginación y filtros
    const apiResponse = await this.fetchProducts(pagination, filters, sortBy);
    
    // Formatear productos para UI

    const productSummaries: FrontendProductSummary[] = apiResponse.data.map((apiProduct) => 
      formatearProducto(apiProduct)
    );

    let filteredProducts = [...productSummaries];

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
   * Buscar productos por query
   */
  async searchProducts(query: string, filters?: Partial<ProductFilters>, sortBy?: string): Promise<FrontendProductSummary[]> {
    const searchFilters: ProductFilters = {
      search: query,
      ...filters
    };
    
    const apiResponse = await this.fetchProducts({ page: 1, limit: 9 }, searchFilters, sortBy);
    const transformedProducts = apiResponse.data.map((apiProduct) => formatearProducto(apiProduct));
    
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
        ? '/api/atributos'  
        : `${this.baseUrl}/api/atributos`;  
      
      const response: AxiosResponse<Atributo[]> = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching atributos from API:', error);
      throw new Error('No se pudieron cargar los atributos desde el servidor. Verifica tu conexión.');
    }
  }


}
