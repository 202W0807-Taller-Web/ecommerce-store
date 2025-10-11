// Export principal del módulo catalog
export * from './types';
export * from './services';
export * from './hooks';
export * from './utils';
export * from './components';
export * from './pages/CatalogPage';
export * from './pages/ProductDetailPage';
export * from './routes/CatalogRoutes';
export * from './contexts';

// Exportaciones específicas por si necesitas acceso directo
export { CatalogService } from './services/catalog.service';
