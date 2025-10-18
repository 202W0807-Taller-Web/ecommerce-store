// Constantes de configuración del módulo catalog
export const CATALOG_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 48,
  SEARCH_MIN_LENGTH: 2,
  
  PRODUCT_IMAGE_PLACEHOLDER: 'https://via.placeholder.com/300x300/f3f4f6/6b7280?text=No+Image',
  
  SORT_OPTIONS: {
    name: 'Nombre',
    price: 'Precio', 
    rating: 'Calificación',
    createdAt: 'Más reciente',
    popularity: 'Más popular'
  },
  
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutos
} as const;
