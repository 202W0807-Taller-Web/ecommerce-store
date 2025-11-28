// src/modules/cart-checkout/__tests__/functional/CompleteCheckoutFlow.functional.test.tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { server } from './setup';
import { http, HttpResponse } from 'msw';
import CartPage from '../../page/cart_page';
import Checkout_Step1 from '../../page/checkoutPage_step1';
import Checkout_Step2 from '../../page/checkoutPage_step2';
import Checkout_Step3 from '../../page/checkoutPage_step3';
import Checkout_Step4 from '../../page/checkoutPage_step4';


describe('Complete Checkout Flow - End to End', () => {
  beforeEach(() => {
    import.meta.env.VITE_API_CART_CHECKOUT_URL = 'http://localhost:3000';
    import.meta.env.VITE_API_INVENTORY_URL = 'http://localhost:3002';
    import.meta.env.VITE_API_ORDERS_URL = 'http://localhost:3000';
    import.meta.env.VITE_API_SHIPPING_URL = 'https://shipping-service-814404078279.us-central1.run.app';
  });

  it('should complete full checkout flow with home delivery', async () => {
    const user = userEvent.setup();

    // PASO 1: Ver el carrito
    const { unmount } = render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    );

    // Verificar que el carrito se cargó
    await waitFor(() => {
      expect(screen.getByText(/laptop gaming/i)).toBeInTheDocument();
    });

    // Verificar que muestra el precio
    expect(screen.getByText(/\$1500/)).toBeInTheDocument();

    // Limpiar para siguiente paso
    unmount();

    // PASO 2: Seleccionar método de envío
    const cart = [
      {
        idProducto: 1,
        nombre: 'Laptop Gaming',
        precio: 1500,
        cantidad: 1,
      },
    ];

    render(
      <MemoryRouter initialEntries={[{ pathname: '/checkout/step1', state: { cart } }]}>
        <Checkout_Step1 />
      </MemoryRouter>
    );

    // Seleccionar envío estándar
    const standardShipping = await screen.findByText(/envío estándar/i);
    await user.click(standardShipping);

    // Verificar que se puede continuar
    const nextBtn = screen.getByRole('button', { name: /siguiente paso/i });
    expect(nextBtn).not.toBeDisabled();

    unmount();

    // PASO 3: Ingresar información del usuario
    render(
      <MemoryRouter
        initialEntries={[
          { pathname: '/checkout/step2', state: { passedCart: cart, method: 'standard' } },
        ]}
      >
        <Checkout_Step2 />
      </MemoryRouter>
    );

    // Esperar a que cargue la info del usuario
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/nombres/i)).toBeInTheDocument();
    });

    // Verificar que se llenó automáticamente
    await waitFor(() => {
      const emailInput = screen.getByPlaceholderText(/correo/i) as HTMLInputElement;
      expect(emailInput.value).toBe('juan@example.com');
    });

    unmount();

    // PASO 4: Seleccionar dirección y carrier
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/checkout/step3',
            state: {
              passedCart: cart,
              shippingMethod: 'standard',
              userInfo: {
                nombreCompleto: 'Juan Pérez',
                email: 'juan@example.com',
                telefono: '987654321',
              },
            },
          },
        ]}
      >
        <Checkout_Step3 />
      </MemoryRouter>
    );

    // Esperar a que carguen las direcciones
    await waitFor(
      () => {
        expect(screen.getByText(/javier prado/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Seleccionar dirección
    const addressOption = screen.getByText(/javier prado/i);
    await user.click(addressOption);

    // Esperar a que carguen los carriers
    await waitFor(
      () => {
        expect(screen.getByText(/olva courier/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Seleccionar carrier
    const olvaCarrier = screen.getByText(/olva courier/i);
    await user.click(olvaCarrier);

    // Verificar que se puede continuar
    const continueBtn = await screen.findByRole('button', { name: /continuar al pago/i });
    expect(continueBtn).not.toBeDisabled();
  }, 10000);

  it('should complete checkout with store pickup', async () => {
    const user = userEvent.setup();

    const cart = [
      {
        idProducto: 1,
        nombre: 'Laptop Gaming',
        precio: 1500,
        cantidad: 1,
      },
    ];

    // Paso 1: Seleccionar método pickup
    const { unmount } = render(
      <MemoryRouter initialEntries={[{ pathname: '/checkout/step1', state: { cart } }]}>
        <Checkout_Step1 />
      </MemoryRouter>
    );

    const pickupOption = await screen.findByText(/recojo en tienda/i);
    await user.click(pickupOption);

    const nextBtn = screen.getByRole('button', { name: /siguiente paso/i });
    expect(nextBtn).not.toBeDisabled();

    unmount();

    // Paso 2: Info de usuario (igual que antes)
    render(
      <MemoryRouter
        initialEntries={[
          { pathname: '/checkout/step2', state: { passedCart: cart, method: 'pickup' } },
        ]}
      >
        <Checkout_Step2 />
      </MemoryRouter>
    );

    await waitFor(() => {
      const emailInput = screen.getByPlaceholderText(/correo/i) as HTMLInputElement;
      expect(emailInput.value).toBe('juan@example.com');
    });

    unmount();

    // Paso 3: Seleccionar tienda
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/checkout/step3',
            state: {
              passedCart: cart,
              shippingMethod: 'pickup',
              userInfo: {
                nombreCompleto: 'Juan Pérez',
                email: 'juan@example.com',
                telefono: '987654321',
              },
            },
          },
        ]}
      >
        <Checkout_Step3 />
      </MemoryRouter>
    );

    // Esperar tiendas
    await waitFor(
      () => {
        expect(screen.getByText(/tienda san isidro/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Seleccionar tienda
    const storeOption = screen.getByText(/tienda san isidro/i);
    await user.click(storeOption);

    // Verificar que se puede continuar
    const continueBtn = await screen.findByRole('button', { name: /continuar al pago/i });
    expect(continueBtn).not.toBeDisabled();
  }, 10000);

  it('should handle insufficient stock scenario', async () => {
    // Mock con stock insuficiente
    server.use(
      http.post('http://localhost:3002/api/stock/bulk', () => {
        return HttpResponse.json([
          {
            id_producto: 1,
            stock_total: 5,
            stock_disponible_total: 3, // Solo 3 disponibles
            stock_reservado_total: 2,
            almacenes: [],
          },
        ]);
      }),
      http.get('http://localhost:3000/api/carritos/7', () => {
        return HttpResponse.json({
          id: 7,
          idUsuario: null,
          items: [
            {
              idProducto: 1,
              nombre: 'Laptop Gaming',
              precio: 1500,
              cantidad: 5, // Intentando comprar 5 pero solo hay 3
              imagenUrl: 'laptop.jpg',
            },
          ],
        });
      })
    );

    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    );

    // Debe mostrar advertencia de stock
    await waitFor(
      () => {
        expect(screen.getByText(/solo quedan 3 unidades/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // El botón de continuar debe estar deshabilitado
    const continueBtn = screen.getByRole('button', { name: /continuar compra/i });
    expect(continueBtn).toBeDisabled();
  });

  it('should allow updating quantities in cart', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/laptop gaming/i)).toBeInTheDocument();
    });

    // Mock para actualizar cantidad
    server.use(
      http.patch('http://localhost:3000/api/carritos/7/anonimo/items/1/0', () => {
        return HttpResponse.json({
          id: 7,
          items: [
            {
              idProducto: 1,
              nombre: 'Laptop Gaming',
              precio: 1500,
              cantidad: 2,
              imagenUrl: 'laptop.jpg',
            },
          ],
        });
      })
    );

    // Hacer clic en el botón de aumentar cantidad
    const increaseBtn = screen.getAllByText('+')[0];
    await user.click(increaseBtn);

    // Verificar que la cantidad se actualizó
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  it('should handle order creation successfully', async () => {
    const user = userEvent.setup();

    const deliveryInfo = {
      tipo: 'ENVIO_A_DOMICILIO' as const,
      almacenOrigen: {
        id: 1,
        nombre: 'Almacén Central',
        direccion: 'Av. Argentina 1234',
        latitud: -12.0546,
        longitud: -77.0515,
      },
      carrierSeleccionado: {
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
      direccionEnvioId: 1,
    };

    const cart = [
      {
        idProducto: 1,
        nombre: 'Laptop Gaming',
        precio: 1500,
        cantidad: 1,
      },
    ];

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/checkout/step4',
            state: {
              method: 'carrier',
              passedCart: cart,
              selectedAddress: {
                id: 1,
                direccionLinea1: 'Av. Javier Prado 123',
                ciudad: 'Lima',
                provincia: 'Lima',
                codigoPostal: '15001',
                pais: 'Perú',
              },
              userInfo: {
                nombreCompleto: 'Juan Pérez',
                email: 'juan@example.com',
                telefono: '987654321',
              },
              deliveryInfo,
              costos: {
                subtotal: 1500,
                envio: 15.5,
                total: 1515.5,
              },
            },
          },
        ]}
      >
        <Checkout_Step4 />
      </MemoryRouter>
    );

    // Esperar a que se renderice
    await waitFor(() => {
      expect(screen.getByText(/confirmar pedido/i)).toBeInTheDocument();
    });

    // Verificar que muestra los productos
    expect(screen.getByText(/laptop gaming/i)).toBeInTheDocument();

    // Verificar el total
    expect(screen.getByText(/1515\.5/)).toBeInTheDocument();

    // Confirmar pedido
    const confirmBtn = screen.getByRole('button', { name: /confirmar pedido/i });
    await user.click(confirmBtn);

    // Verificar que se procesa (el loading state)
    await waitFor(() => {
      expect(screen.getByText(/procesando/i)).toBeInTheDocument();
    });
  });
});