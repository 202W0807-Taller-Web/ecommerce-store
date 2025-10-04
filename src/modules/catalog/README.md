# 📦 Módulo Catalog

Módulo de catálogo de productos para la aplicación de ecommerce.

## 🚀 Estructura Simple

```
src/modules/catalog/
├── types/                 # Definiciones TypeScript
│   ├── Product.models.ts  # Product, ProductSummary, ProductFilters
│   ├── Category.models.ts # Category
│   └── index.ts
├── services/             # Lógica de negocio
│   ├── catalog.service.ts # Servicio principal con datos mock
│   └── index.ts
├── hooks/                # Custom React hooks
│   ├── useCatalog.ts    # Hook para catálogo
│   ├── useProductDetail.ts # Hook para detalles de producto
│   └── index.ts
├── pages/                # Páginas React
│   ├── CatalogPage.tsx   # Página del catálogo
│   └── ProductDetailPage.tsx # Página de detalles del producto
├── utils/                # Utilidades
│   ├── constants.ts      # Constantes de configuración
│   ├── formatters.ts     # Funciones de formateo
│   └── index.ts
└── routes/               # Configuración de rutas
    └── CatalogRoutes.tsx
```

## 🎯 Uso

### Importando desde otras partes:
```typescript
import { CatalogPage, ProductDetailPage } from './modules/catalog';
import { CatalogService } from './modules/catalog/services';
import { ProductFilters } from './modules/catalog/types';
```

### En rutas principales:
```typescript
import CatalogRoutes from './modules/catalog/routes/CatalogRoutes';

// En tu router principal:
<Route path="/catalog/*" element={<CatalogRoutes />} />
```

## 📁 Rutas Disponibles

- `GET /catalog` - Catálogo con filtros y paginación
- `GET /product/:id` - Detalles de producto específico
- `GET /products` - Redirect a /catalog (compatibilidad)

## 🔄 Migración a Backend

Cuando tengas API backend:

1. Crear `services/api-catalog.service.ts`
2. Cambiar import en `hooks/useCatalog.ts`: 
   ```typescript
   const catalogService = new ApiCatalogService();
   ```
3. Implementar métodos reales en lugar de datos mock
