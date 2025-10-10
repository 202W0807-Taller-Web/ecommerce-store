import { 
  type Product, 
  type ProductSummary, 
  type ProductFilters, 
  type PaginationParams, 
  type PaginationResult,
  type Category,
} from '../types';
import { COLORES_DISPONIBLES } from '../data/colors';
import { ATRIBUTOS_FILTRO } from '../data/filters';

// Interfaces para la respuesta cruda de la API
interface ApiProductDetail {
  id: number;
  nombre: string;
  descripcion: string;
  idPromocion: number | null;
  productoImagenes: Array<{
    id: number;
    productoId: number;
    principal: boolean;
    imagen: string;
  }>;
  variantes: Array<{
    id: number;
    productoId: number;
    precio: number;
    stock: number;
    talla?: string;
    color?: string;
    unidadMedida?: string;
    atributos: Array<{
      id: number;
      productoId: number;
      nombre: string;
      valor: string;
    }>;
  }>;
  productoAtributos: Array<{
    id: number;
    productoId: number;
    atributoId: number;
    atributoValorId: number;
    nombre: string;
    valor: string;
  }>;
  // Atributos para filtros
  atributosFiltro: Record<string, string>;
}

interface ApiProductSummary {
  nombre: string;
  descripcion: string;
  imagenesBase64: string[];
  // Atributos para filtros
  atributosFiltro: Record<string, string>;
}

/**
 * Funciones de transformación de datos de la API
 */

// Transformar respuesta detallada de la API a Product
export function transformApiProductToProduct(apiProduct: ApiProductDetail): Product {
  // Mockear datos faltantes para las vistas
  const mockPrice = 99.99 + (apiProduct.id * 10);
  const mockOriginalPrice = apiProduct.idPromocion ? mockPrice * 1.3 : undefined;
  const mockRating = 4.0 + (apiProduct.id % 2);
  const mockReviewCount = 50 + (apiProduct.id * 10);
  
  // Obtener imagen principal (para uso futuro)
  // const principalImage = apiProduct.productoImagenes.find(img => img.principal)?.imagen || 
  //                       apiProduct.productoImagenes[0]?.imagen || '';
  
  // Las transformaciones de atributos y variantes se harán en los componentes si es necesario
  
  return {
    // Datos reales de la API
    id: apiProduct.id,
    nombre: apiProduct.nombre,
    descripcion: apiProduct.descripcion,
    idPromocion: apiProduct.idPromocion,
    productoImagenes: apiProduct.productoImagenes,
    variantes: apiProduct.variantes,
    productoAtributos: apiProduct.productoAtributos,
    atributosFiltro: apiProduct.atributosFiltro,
    
    // Datos mockeados para las vistas
    precio: mockPrice,
    precioOriginal: mockOriginalPrice,
    categoria: 'Categoría Mock',
    rating: mockRating,
    reviewCount: mockReviewCount,
    isPromo: !!apiProduct.idPromocion,
    promotionId: apiProduct.idPromocion || undefined
  };
}

// Transformar respuesta resumida de la API a ProductSummary
export function transformApiProductSummaryToProductSummary(
  apiProduct: ApiProductSummary, 
  index: number = 0
): ProductSummary {
  // Mockear datos faltantes
  const mockPrice = 99.99 + (index * 10);
  const mockOriginalPrice = index % 3 === 1 ? mockPrice * 1.3 : undefined;
  const mockRating = 4.0 + (index % 2);
  const mockReviewCount = 50 + (index * 10);
  
  return {
    // Datos reales de la API
    nombre: apiProduct.nombre,
    descripcion: apiProduct.descripcion,
    imagenesBase64: apiProduct.imagenesBase64,
    atributosFiltro: apiProduct.atributosFiltro,
    
    // Datos mockeados para las vistas
    precio: mockPrice,
    precioOriginal: mockOriginalPrice,
    categoria: 'Categoría Mock',
    rating: mockRating,
    reviewCount: mockReviewCount,
    isPromo: index % 3 === 1
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
   * Simular llamada a API real para obtener lista de productos
   */
  private async fetchProductsFromApi(): Promise<ApiProductSummary[]> {
    // TODO: Reemplazar con llamada real a la API
    // const response = await fetch('/api/products');
    // return await response.json();
    
    // Mock de respuesta de la API - Generar más productos para probar paginación
    const productos = [];
    
    // Usar los datos reales de los filtros para generar productos
    const categoriaAtributo = ATRIBUTOS_FILTRO.find(a => a.nombre === 'Categoría');
    const generoAtributo = ATRIBUTOS_FILTRO.find(a => a.nombre === 'Género');
    const deporteAtributo = ATRIBUTOS_FILTRO.find(a => a.nombre === 'Deporte');
    const tipoAtributo = ATRIBUTOS_FILTRO.find(a => a.nombre === 'Tipo');
    const colorAtributo = ATRIBUTOS_FILTRO.find(a => a.nombre === 'Color');
    const coleccionAtributo = ATRIBUTOS_FILTRO.find(a => a.nombre === 'Colección');
    
    for (let i = 1; i <= 50; i++) {
      const categoria = categoriaAtributo?.atributoValores[i % categoriaAtributo.atributoValores.length]?.valor || 'Ropa';
      const genero = generoAtributo?.atributoValores[i % generoAtributo.atributoValores.length]?.valor || 'Hombre';
      const deporte = deporteAtributo?.atributoValores[i % deporteAtributo.atributoValores.length]?.valor || 'Urbano';
      const tipo = tipoAtributo?.atributoValores[i % tipoAtributo.atributoValores.length]?.valor || 'Polos';
      const color = colorAtributo?.atributoValores[i % colorAtributo.atributoValores.length]?.valor || 'Negro';
      const coleccion = coleccionAtributo?.atributoValores[0]?.valor || 'Colección 2025';
      
      productos.push({
        nombre: `Producto ${i}`,
        descripcion: `Descripción detallada del producto ${i}. Este es un producto de prueba para demostrar la funcionalidad de paginación.`,
        imagenesBase64: [`imagen-${i}-1`, `imagen-${i}-2`],
        atributosFiltro: {
          'Categoría': categoria,
          'Género': genero,
          'Deporte': deporte,
          'Tipo': tipo,
          'Color': color,
          'Colección': coleccion
        }
      });
    }
    return productos;
  }

  /**
   * Simular llamada a API real para obtener detalle de producto
   */
  private async fetchProductDetailFromApi(id: number): Promise<ApiProductDetail | null> {
    // TODO: Reemplazar con llamada real a la API
    // const response = await fetch(`/api/product/${id}`);
    // return await response.json();
    
    // Mock de respuesta de la API
    const tallas = ['S', 'M', 'L', 'XL'];
    const colores = COLORES_DISPONIBLES.slice(0, 6).map(color => color.nombre); // Usar los primeros 6 colores
    const variantes: Array<{
      id: number;
      productoId: number;
      precio: number;
      stock: number;
      talla?: string;
      color?: string;
      atributos: Array<{
        id: number;
        productoId: number;
        nombre: string;
        valor: string;
      }>;
    }> = [];
    
    // Generar variantes (combinaciones de talla y color)
    tallas.forEach((talla, tallaIndex) => {
      colores.forEach((color, colorIndex) => {
        const varianteId = tallaIndex * colores.length + colorIndex + 1;
        variantes.push({
          id: varianteId,
          productoId: id,
          precio: 99.99 + (varianteId * 5),
          stock: Math.floor(Math.random() * 20) + 5,
          talla,
          color,
          atributos: [
            { id: 1, productoId: id, nombre: 'Talla', valor: talla },
            { id: 2, productoId: id, nombre: 'Color', valor: color }
          ]
        });
      });
    });
    
    // Generar atributos del producto
    const atributos = [
      { id: 1, productoId: id, atributoId: 1, atributoValorId: 1, nombre: 'Categoría', valor: 'Ropa' },
      { id: 2, productoId: id, atributoId: 2, atributoValorId: 4, nombre: 'Género', valor: 'Hombre' },
      { id: 3, productoId: id, atributoId: 3, atributoValorId: 7, nombre: 'Deporte', valor: 'Urbano' },
      { id: 4, productoId: id, atributoId: 4, atributoValorId: 18, nombre: 'Tipo', valor: 'Polos' }
    ];
    
    return {
      id: id,
      nombre: `Producto ${id}`,
      descripcion: `Descripción detallada del producto ${id}. Este producto incluye variantes de talla y color para demostrar la funcionalidad completa.`,
      idPromocion: id % 2 === 0 ? 1 : null,
      productoImagenes: [
        {
          id: 1,
          productoId: id,
          principal: true,
          imagen: `example://imagen-principal-${id}`
        },
        {
          id: 2,
          productoId: id,
          principal: false,
          imagen: `example://imagen-secundaria-${id}`
        }
      ],
      variantes,
      productoAtributos: atributos,
      atributosFiltro: {
        'Categoría': 'Ropa',
        'Género': 'Hombre',
        'Deporte': 'Urbano',
        'Tipo': 'Polos',
        'Color': 'Negro',
        'Colección': 'Colección 2025'
      }
    };
  }

  /**
   * Obtener productos con filtros y paginación
   */
  async getProducts(
    filters: ProductFilters = {}, 
    pagination: PaginationParams = { page: 1, limit: 12 }
  ): Promise<PaginationResult<ProductSummary>> {
    // Obtener datos de la API real
    const apiProducts = await this.fetchProductsFromApi();
    
    // Transformar a ProductSummary
    const productSummaries: ProductSummary[] = apiProducts.map((apiProduct, index) => 
      transformApiProductSummaryToProductSummary(apiProduct, index)
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
        let valueA: any;
        let valueB: any;
        
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

        if (typeof valueA === 'string') {
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
  async getProductDetail(id: number): Promise<Product | null> {
    const apiProduct = await this.fetchProductDetailFromApi(id);
    if (!apiProduct) return null;
    
    return transformApiProductToProduct(apiProduct);
  }

  /**
   * Buscar productos por término de búsqueda
   */
  async searchProducts(query: string, filters?: Partial<ProductFilters>): Promise<ProductSummary[]> {
    const searchFilters: ProductFilters = { search: query, ...filters };
    const result = await this.getProducts(searchFilters, { page: 1, limit: 50 });
    return result.data;
  }

  /**
   * Obtener productos recomendados
   */
  async getRecommendedProducts(excludeId?: number, limit: number = 8): Promise<ProductSummary[]> {
    const apiProducts = await this.fetchProductsFromApi();
    const transformedProducts = apiProducts
      .map((apiProduct, index) => transformApiProductSummaryToProductSummary(apiProduct, index))
      .filter(p => p.id !== excludeId);
    
    const shuffled = [...transformedProducts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  }

  /**
   * Obtener productos relacionados
   */
  async getRelatedProducts(productId: number, limit: number = 4): Promise<ProductSummary[]> {
    const apiProducts = await this.fetchProductsFromApi();
    const transformedProducts = apiProducts
      .map((apiProduct, index) => transformApiProductSummaryToProductSummary(apiProduct, index))
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
  async getDiscountedProducts(limit: number = 8): Promise<ProductSummary[]> {
    const apiProducts = await this.fetchProductsFromApi();
    const transformedProducts = apiProducts
      .map((apiProduct, index) => transformApiProductSummaryToProductSummary(apiProduct, index))
      .filter(p => p.isPromo); // Solo productos en promoción
    
    return transformedProducts.slice(0, limit);
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
