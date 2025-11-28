# Tests del Módulo Cart-Checkout

Este directorio contiene los tests unitarios para el módulo `cart-checkout` del e-commerce store.

## Estructura de Tests

```
__tests__/
├── hooks/
│   ├── useCart.test.ts
│   ├── useStockValidation.test.ts
│   ├── useAddresses.test.ts
│   └── useUserLocation.test.ts
└── README.md
```

## Framework de Testing

- **Vitest**: Framework de testing rápido y moderno para Vite
- **React Testing Library**: Para testing de hooks de React
- **@testing-library/jest-dom**: Matchers personalizados para el DOM

## Comandos Disponibles

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm test -- --watch

# Ejecutar tests con UI
npm run test:ui

# Generar reporte de cobertura
npm run test:coverage
```

## Tests Implementados

### 1. useCart.test.ts

**Cobertura**: Hook `useCart`

**Casos de prueba**:
- Obtener carrito al montar el componente
- Manejar errores de fetch
- Agregar items al carrito
- Actualizar cantidad de items
- Eliminar items del carrito
- Vaciar carrito completo
- Revertir actualizaciones optimistas en caso de error

**Ejemplo**:
```typescript
it('should add item to cart', async () => {
  // Arrange
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockCart,
  });

  const { result } = renderHook(() => useCart());

  // Act
  await result.current.addToCart(newProduct);

  // Assert
  await waitFor(() => {
    expect(result.current.cart?.items.length).toBe(2);
  });
});
```

### 2. useAddresses.test.ts

**Cobertura**: Hook `useAddresses`

**Casos de prueba**:
- Obtener direcciones al montar
- No fetch si idUsuarioEnvio es null
- Manejar errores de fetch
- Crear nueva dirección
- Actualizar dirección existente
- Eliminar dirección
- Marcar dirección como principal
- Revertir actualizaciones optimistas en caso de error

**Ejemplo**:
```typescript
it('should mark address as primary', async () => {
  await result.current.markAsPrimary(2);

  await waitFor(() => {
    expect(result.current.addresses[0].principal).toBe(false);
    expect(result.current.addresses[1].principal).toBe(true);
  });
});
```

### 3. useUserLocation.test.ts

**Cobertura**: Hook `useUserLocation`

**Casos de prueba**:
- Obtener ubicación desde geolocalización del navegador
- Fallback a API cuando geolocalización falla
- Manejar errores de la API
- Manejar ausencia de API de geolocalización

**Ejemplo**:
```typescript
it('should fallback to API when geolocation fails', async () => {
  mockGeolocation.getCurrentPosition.mockImplementation((_, error) => {
    error(new Error('User denied geolocation'));
  });

  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ lat: -12.0464, lng: -77.0428 }),
  });

  const { result } = renderHook(() => useUserLocation());

  await waitFor(() => {
    expect(result.current.lat).toBe(-12.0464);
    expect(result.current.error).toBe(null);
  });
});
```

## Configuración

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: false,
  },
});
```

### Setup de Tests (src/test/setup.ts)

```typescript
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

afterEach(() => {
  cleanup();
});
```

## Cobertura de Código

Para generar un reporte de cobertura:

```bash
npm run test:coverage
```

Esto generará un reporte HTML en `coverage/index.html`.

## Troubleshooting

### Act Warnings

Es normal ver warnings sobre `act()` en los tests de hooks. Estos warnings indican actualizaciones de estado fuera del scope de testing, pero son esperados en hooks que usan efectos.

Para suprimirlos (opcional):
```typescript
vi.spyOn(console, 'error').mockImplementation(() => {});
```

### Problemas con dependencias nativas

Si encuentras errores con `@rollup/rollup-*` o `lightningcss`:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Recursos

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Hooks](https://react-hooks-testing-library.com/)
