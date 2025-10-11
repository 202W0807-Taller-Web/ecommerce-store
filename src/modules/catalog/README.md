# Módulo de Catálogo - Integración con API Real

Este módulo ha sido actualizado para trabajar con la estructura real de datos del API, incluyendo el manejo completo de variantes de productos.

## Estructura de Datos del API

### GET /atributos
```typescript
interface Atributo {
  id: number;
  nombre: string;
  atributoValores: AtributoValor[];
}

interface AtributoValor {
  id: number;
  atributoId: number;
  valor: string;
}
```

### GET /product/:id
```typescript
interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  idPromocion: number | null;
  productoImagenes: ProductoImagen[];
  variantes: Variante[];
  productoAtributos: ProductoAtributo[];
}

interface Variante {
  id: number;
  productoId: number;
  precio: number;
  sku: string;
  varianteImagenes: VarianteImagen[];
  varianteAtributos: VarianteAtributo[];
}
```

### GET /product/listado
```typescript
interface ProductSummary {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  tienePromocion: boolean;
}
```

## Funcionalidades Implementadas

### 1. Manejo de Variantes
- **Selección de Color**: Al seleccionar un color, se muestran las tallas disponibles para ese color específico
- **Selección de Talla**: Dependiente del color seleccionado
- **Precio Dinámico**: El precio cambia según la variante seleccionada
- **Imágenes de Variantes**: Las imágenes de las variantes se integran automáticamente en la galería principal

### 2. Interfaces Extendidas
- `ProductWithUI`: Extiende `Product` con campos calculados para la UI
- `ProductSummaryWithUI`: Extiende `ProductSummary` con campos mockeados para compatibilidad

### 3. Hook Personalizado: `useProductVariants`
```typescript
const {
  // Estado actual
  colorSeleccionado,
  tallaSeleccionada,
  varianteSeleccionada,
  
  // Opciones disponibles
  coloresDisponibles,
  tallasDisponibles,
  todasLasImagenes,
  
  // Acciones
  seleccionarColor,
  seleccionarTalla,
  resetearSeleccion,
  
  // Estado calculado
  precioActual,
  imagenesVarianteActual,
  todasLasImagenesConVariante,
  hayStock,
  puedeComprar
} = useProductVariants(producto);
```

### 4. Funciones Utilitarias
- `getColoresDisponibles()`: Obtiene todos los colores disponibles
- `getTallasPorColor()`: Obtiene tallas disponibles para un color específico
- `encontrarVariante()`: Encuentra una variante por color y talla
- `getImagenesVariante()`: Obtiene imágenes de una variante específica
- `enhanceProductWithUI()`: Convierte Product a ProductWithUI

## Uso en Componentes

### Ejemplo Básico
```typescript
import { useProductVariants } from '../hooks/useProductVariants';

function ProductDetailComponent({ producto }: { producto: ProductWithUI }) {
  const {
    colorSeleccionado,
    tallaSeleccionada,
    varianteSeleccionada,
    coloresDisponibles,
    tallasDisponibles,
    seleccionarColor,
    seleccionarTalla,
    precioActual,
    puedeComprar
  } = useProductVariants(producto);

  return (
    <div>
      {/* Selector de colores */}
      <div>
        {coloresDisponibles.map(color => (
          <button
            key={color}
            onClick={() => seleccionarColor(color)}
            className={colorSeleccionado === color ? 'selected' : ''}
          >
            {color}
          </button>
        ))}
      </div>

      {/* Selector de tallas (solo si hay color seleccionado) */}
      {colorSeleccionado && (
        <div>
          {tallasDisponibles.map(talla => (
            <button
              key={talla}
              onClick={() => seleccionarTalla(talla)}
              className={tallaSeleccionada === talla ? 'selected' : ''}
            >
              {talla}
            </button>
          ))}
        </div>
      )}

      {/* Precio actual */}
      <div>Precio: ${precioActual}</div>

      {/* Botón de compra */}
      <button disabled={!puedeComprar}>
        {puedeComprar ? 'Agregar al Carrito' : 'Selecciona Color y Talla'}
      </button>
    </div>
  );
}
```

## Servicio Actualizado

El `CatalogService` ahora incluye:
- Mockups basados en la estructura real del API
- Transformaciones automáticas a interfaces con UI
- Método `getAtributos()` para obtener todos los atributos disponibles
- Soporte completo para variantes y sus imágenes

## Mockups Implementados

Los mockups utilizan la estructura exacta del API proporcionada:
- Atributos reales (Categoría, Género, Deporte, Tipo, Talla, Color, etc.)
- Variantes con combinaciones de color y talla
- Imágenes de variantes integradas
- Precios y SKUs generados automáticamente

## Próximos Pasos

1. **Integración Real**: Reemplazar los mockups con llamadas reales al API
2. **Validación**: Agregar validación de stock y disponibilidad
3. **Persistencia**: Guardar selecciones en el estado global o localStorage
4. **Optimización**: Implementar lazy loading para imágenes de variantes

## Archivos Principales

- `types/Product.models.ts`: Interfaces actualizadas
- `utils/variants.utils.ts`: Funciones utilitarias para variantes
- `hooks/useProductVariants.ts`: Hook para manejo de variantes
- `services/catalog.service.ts`: Servicio actualizado con mockups reales
- `examples/variants-integration.example.ts`: Ejemplos de uso

## Compatibilidad

El módulo mantiene compatibilidad con componentes existentes a través de interfaces de compatibilidad y campos mockeados para la UI.