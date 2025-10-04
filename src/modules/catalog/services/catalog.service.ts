import { 
  type Product, 
  type ProductSummary, 
  type ProductFilters, 
  type PaginationParams, 
  type PaginationResult,
  type Category,
} from '../types';

/**
 * Servicio simplificado para el catálogo
 * Consolida toda la lógica de negocio sin capas innecesarias
 */
export class CatalogService {
  private mockProducts: Product[] = [];
  private mockCategories: Category[] = [];

  constructor() {
    this.initializeMockData();
  }

  /**
   * Obtener productos con filtros y paginación
   */
  async getProducts(
    filters: ProductFilters = {}, 
    pagination: PaginationParams = { page: 1, limit: 12 }
  ): Promise<PaginationResult<ProductSummary>> {
    // Aplicar filtros
    let filteredProducts = [...this.mockProducts];

    if (filters.search) {
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
        p.category.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    if (filters.category) {
      filteredProducts = filteredProducts.filter(p => p.category === filters.category);
    }

    if (filters.priceMin) {
      filteredProducts = filteredProducts.filter(p => p.price >= filters.priceMin!);
    }

    if (filters.priceMax) {
      filteredProducts = filteredProducts.filter(p => p.price <= filters.priceMax!);
    }

    if (filters.rating) {
      filteredProducts = filteredProducts.filter(p => p.rating >= filters.rating!);
    }

    if (filters.inStock) {
      filteredProducts = filteredProducts.filter(p => p.inStock);
    }

    // Aplicar ordenamiento
    if (filters.sortBy) {
      filteredProducts.sort((a, b) => {
        let valueA: any = a[filters.sortBy!];
        let valueB: any = b[filters.sortBy!];

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

    // Convertir a ProductSummary
    const productSummaries: ProductSummary[] = paginatedProducts.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      category: product.category,
      rating: product.rating,
      reviewCount: product.reviewCount
    }));

    return {
      data: productSummaries,
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
    return this.mockProducts.find(product => product.id === id) || null;
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
    const products = this.mockProducts.filter(p => p.id !== excludeId);
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, limit);

    return selected.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      category: product.category,
      rating: product.rating,
      reviewCount: product.reviewCount
    }));
  }

  /**
   * Obtener productos relacionados
   */
  async getRelatedProducts(productId: number, limit: number = 4): Promise<ProductSummary[]> {
    const originalProduct = this.mockProducts.find(p => p.id === productId);
    if (!originalProduct) return [];

    const related = this.mockProducts
      .filter(p => 
        p.id !== productId &&
        (p.category === originalProduct.category)
      )
      .slice(0, limit);

    return related.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      category: product.category,
      rating: product.rating,
      reviewCount: product.reviewCount
    }));
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
    const discountedProducts = this.mockProducts.filter(p => 
      p.originalPrice && p.originalPrice > p.price
    ).slice(0, limit);

    return discountedProducts.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      category: product.category,
      rating: product.rating,
      reviewCount: product.reviewCount
    }));
  }

  /**
   * Inicializar datos mock
   */
  private initializeMockData(): void {
    this.initializeCategories();
    this.initializeProducts();
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

  private initializeProducts(): void {
    const categories = ['Electronics', 'Clothing', 'Home', 'Sports', 'Books'];
    // Crear 100 productos mock
    for (let i = 1; i <= 100; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const price = Math.floor(Math.random() * 1000) + 100;
      const originalPrice = Math.random() > 0.7 ? Math.floor(price * (1.2 + Math.random() * 0.3)) : undefined;

      const product: Product = {
        id: i,
        name: `${category} Product ${i}`,
        description: `Descripción detallada del producto ${i}. Este producto está diseñado para ofrecer la mejor experiencia en la categoría ${category}.`,
        price,
        originalPrice,
        images: [
          `https://via.placeholder.com/600x600/6366f1/ffffff?text=${category.replace(/\s+/g, '+')}+${i}+1`,
          `https://via.placeholder.com/600x600/10b981/ffffff?text=${category.replace(/\s+/g, '+')}+${i}+2`,
          `https://via.placeholder.com/600x600/f59e0b/ffffff?text=${category.replace(/\s+/g, '+')}+${i}+3`
        ],
        category,
        rating: Number((Math.random() * 5).toFixed(1)),
        reviewCount: Math.floor(Math.random() * 1000),
        features: [
          `Característica premium ${i}`,
          `Diseño elegante ${i}`,
          `Tecnología avanzada ${i}`,
          `Garantía extendida`
        ],
        specifications: {
          'Dimensiones': `${Math.floor(Math.random() * 20) + 10}x${Math.floor(Math.random() * 20) + 12}x${Math.floor(Math.random() * 10) + 2} cm`,
          'Peso': `${Math.floor(Math.random() * 500) + 500}g`,
          'Material': 'Premium Material',
          'Color': ['Negro', 'Blanco', 'Azul', 'Rojo'][Math.floor(Math.random() * 4)]
        },
        inStock: Math.random() > 0.1, // 90% chance of being in stock
        stockCount: Math.floor(Math.random() * 50),
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        tags: [`tag${Math.floor(i/10)}`, `category-${category.toLowerCase()}`]
      };

      this.mockProducts.push(product);
    }
  }
}
