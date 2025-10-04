// Definiciones de tipos para categorías
export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  parentId?: string;
  children?: Category[];
  productCount: number;
  isActive: boolean;
}

export interface CategoryTree extends Category {
  children: Category[];
}
