// Definiciones de tipos para productos
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  rating: number;
  reviewCount: number;
  features: string[];
  specifications: Record<string, string>;
  inStock: boolean;
  stockCount: number;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export interface ProductSummary {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  inStock?: boolean;
  tags?: string[];
  sortBy?: ProductSortBy;
  sortOrder?: SortOrder;
}

export type ProductSortBy = 
  | 'name' 
  | 'price' 
  | 'rating' 
  | 'createdAt' 
  | 'popularity';

export type SortOrder = 'asc' | 'desc';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
