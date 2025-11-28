// src/modules/cart-checkout/__tests__/functional/setup.ts
import { afterEach, beforeAll, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Mock data
const mockCarrito = {
  id: 7,
  idUsuario: null,
  items: [
    {
      idProducto: 1,
      nombre: 'Laptop Gaming',
      precio: 1500,
      cantidad: 1,
      imagenUrl: 'laptop.jpg',
      idVariante: null,
    },
  ],
};

const mockAddresses = [
  {
    id: 1,
    direccionLinea1: 'Av. Javier Prado 123',
    direccionLinea2: 'Dpto 301',
    ciudad: 'Lima',
    provincia: 'Lima',
    codigoPostal: '15001',
    pais: 'Perú',
    principal: true,
    latitud: -12.0464,
    longitud: -77.0428,
  },
];

const mockStores = [
  {
    id: 1,
    nombre: 'Tienda San Isidro',
    direccion: 'Av. Conquistadores 456',
    distancia_km: 2.5,
  },
  {
    id: 2,
    nombre: 'Tienda Miraflores',
    direccion: 'Av. Larco 789',
    distancia_km: 5.2,
  },
];

const mockCarriers = [
  {
    cotizacion_id: 'CARRIER-001',
    carrier_nombre: 'Olva Courier',
    carrier_codigo: 'OLVA',
    carrier_tipo: 'EXPRESS',
    costo_envio: 15.5,
    tiempo_estimado_dias: 3,
    fecha_entrega_estimada: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    peso_maximo_kg: 30,
    distancia_km: 12.5,
    logo_url: 'olva.png',
  },
  {
    cotizacion_id: 'CARRIER-002',
    carrier_nombre: 'Shalom',
    carrier_codigo: 'SHALOM',
    carrier_tipo: 'STANDARD',
    costo_envio: 9.99,
    tiempo_estimado_dias: 5,
    fecha_entrega_estimada: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    peso_maximo_kg: 25,
    distancia_km: 12.5,
    logo_url: 'shalom.png',
  },
];

export const server = setupServer(
  // Cart endpoints
  http.get('http://localhost:3000/api/carritos/:id', () => {
    return HttpResponse.json(mockCarrito);
  }),

  http.post('http://localhost:3000/api/carritos/:id/anonimo/items', async ({ request }) => {
    const body = await request.json() as any;
    return HttpResponse.json({
      ...mockCarrito,
      items: [...mockCarrito.items, body],
    });
  }),

  http.patch('http://localhost:3000/api/carritos/:id/anonimo/items/:productId/:variantId', async ({ params, request }) => {
    const url = new URL(request.url);
    const nuevaCantidad = parseInt(url.searchParams.get('nuevaCantidad') || '1');
    
    return HttpResponse.json({
      ...mockCarrito,
      items: mockCarrito.items.map(item => 
        item.idProducto === Number(params.productId)
          ? { ...item, cantidad: nuevaCantidad }
          : item
      ),
    });
  }),

  http.delete('http://localhost:3000/api/carritos/:id/anonimo/items/:productId/:variantId', () => {
    return HttpResponse.json({
      ...mockCarrito,
      items: [],
    });
  }),

  http.delete('http://localhost:3000/api/carritos/:id/anonimo/items', () => {
    return HttpResponse.json({
      ...mockCarrito,
      items: [],
    }, { status: 204 });
  }),

  // Shipping User endpoints
  http.get('http://localhost:3000/api/envio/usuario/:id', () => {
    return HttpResponse.json({
      id: 20,
      idUsuario: 20,
      nombreCompleto: 'Juan Pérez',
      email: 'juan@example.com',
      telefono: '987654321',
    });
  }),

  http.post('http://localhost:3000/api/envio/usuario', async ({ request }) => {
    const body = await request.json() as any;
    return HttpResponse.json({
      id: 20,
      ...body,
    });
  }),

  // Address endpoints
  http.get('http://localhost:3000/api/envio/usuario/:id/direcciones', () => {
    return HttpResponse.json(mockAddresses);
  }),

  http.post('http://localhost:3000/api/envio/usuario/:id/direcciones', async ({ request }) => {
    const body = await request.json() as any;
    return HttpResponse.json({
      id: Date.now(),
      ...body,
      latitud: -12.0464,
      longitud: -77.0428,
    });
  }),

  http.put('http://localhost:3000/api/envio/direcciones/:id', async ({ request }) => {
    const body = await request.json() as any;
    return HttpResponse.json({
      ...mockAddresses[0],
      ...body,
    });
  }),

  http.delete('http://localhost:3000/api/envio/direcciones/:id', () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.patch('http://localhost:3000/api/envio/usuario/:userId/direcciones/:id/principal', () => {
    return new HttpResponse(null, { status: 200 });
  }),

  // Stock validation
  http.post('http://localhost:3002/api/stock/bulk', async ({ request }) => {
    const { productIds } = await request.json() as any;
    return HttpResponse.json(
      productIds.map((id: number) => ({
        id_producto: id,
        stock_total: 100,
        stock_disponible_total: 80,
        stock_reservado_total: 20,
        almacenes: [
          {
            id_almacen: 1,
            stock_disponible: 80,
            stock_reservado: 20,
            stock_total: 100,
          },
        ],
      }))
    );
  }),

  // Location endpoint
  http.get('http://localhost:3000/api/location', () => {
    return HttpResponse.json({
      lat: -12.0464,
      lng: -77.0428,
    });
  }),

  // Shipping quotes (cotizaciones)
  http.post('https://shipping-service-814404078279.us-central1.run.app/api/cotizaciones', () => {
    return HttpResponse.json({
      almacen_origen: {
        id: 1,
        nombre: 'Almacén Central',
        direccion: 'Av. Argentina 1234',
        latitud: -12.0546,
        longitud: -77.0515,
      },
      distancia_km: 12.5,
      recojo_tienda: {
        disponible: true,
        tiempo_estimado_dias: 2,
        fecha_entrega_estimada: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        descripcion: 'Recojo disponible en 2 días',
        tiendas: mockStores,
      },
      domicilio: {
        disponible: true,
        carriers: mockCarriers,
      },
    });
  }),

  // Orders endpoint
  http.post('http://localhost:3000/api/orders', async ({ request }) => {
    const body = await request.json() as any;
    return HttpResponse.json({
      success: true,
      data: {
        id: Date.now(),
        numeroOrden: `ORD-${Date.now()}`,
        estadoInicial: body.estadoInicial || 'PENDIENTE',
        costos: body.costos,
        entrega: body.entrega,
      },
    });
  })
);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});