/**
 * Configuración de servicios
 * Cambia USE_SEARCH_SERVICE a false para volver a usar CatalogService
 */
export const SERVICE_CONFIG = {
  // 🔧 CAMBIA ESTA LÍNEA PARA ALTERNAR ENTRE SERVICIOS
  USE_SEARCH_SERVICE: true, // true = SearchService, false = CatalogService
} as const;