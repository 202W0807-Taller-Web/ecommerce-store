// src/modules/cart-checkout/__tests__/functional/setup.ts
import { afterEach, beforeAll, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Mock Server Worker (MSW) - simula un backend real
export const server = setupServer(
  // Address endpoints
  http.get('http://localhost:3000/api/envio/usuario/:id/direcciones', () => {
    return HttpResponse.json([
      {
        id: 1,
        direccionLinea1: 'Av. Principal 123',
        ciudad: 'Lima',
        provincia: 'Lima',
        codigoPostal: '15001',
        pais: 'Perú',
        principal: true,
      },
    ]);
  }),

  http.post('http://localhost:3000/api/envio/usuario/:id/direcciones', async () => {
    return HttpResponse.json({
      id: 2,
    });
  }),

  // Location endpoint
  http.get('http://localhost:3001/api/location', () => {
    return HttpResponse.json({
      lat: -12.0464,
      lng: -77.0428,
    });
  })
);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});