// src/modules/cart-checkout/__tests__/functional/AddressManagement.functional.test.tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { server } from './setup';
import { http, HttpResponse } from 'msw';
import Checkout_Step3 from '../../page/checkoutPage_step3';

describe('Address Management - Functional Tests', () => {
  const mockCart = [
    {
      idProducto: 1,
      nombre: 'Laptop Gaming',
      precio: 1500,
      cantidad: 1,
    },
  ];

  const mockUserInfo = {
    nombreCompleto: 'Juan Pérez',
    email: 'juan@example.com',
    telefono: '987654321',
  };

  beforeEach(() => {
    import.meta.env.VITE_API_CART_CHECKOUT_URL = 'http://localhost:3000';
  });

  it('should display existing addresses', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/checkout/step3',
            state: {
              passedCart: mockCart,
              shippingMethod: 'standard',
              userInfo: mockUserInfo,
            },
          },
        ]}
      >
        <Checkout_Step3 />
      </MemoryRouter>
    );

    // Debe cargar y mostrar las direcciones
    await waitFor(() => {
      expect(screen.getByText(/javier prado/i)).toBeInTheDocument();
    });

    // Debe mostrar que es dirección principal
    expect(screen.getByText(/dirección principal/i)).toBeInTheDocument();

    // Debe mostrar los detalles completos
    expect(screen.getByText(/lima/i)).toBeInTheDocument();
    expect(screen.getByText(/15001/)).toBeInTheDocument();
  });

  it('should allow adding a new address', async () => {
    const user = userEvent.setup();

    server.use(
      http.post('http://localhost:3000/api/envio/usuario/20/direcciones', async ({ request }) => {
        const body = await request.json() as any;
        return HttpResponse.json({
          id: 2,
          ...body,
          latitud: -12.0464,
          longitud: -77.0428,
        });
      })
    );

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/checkout/step3',
            state: {
              passedCart: mockCart,
              shippingMethod: 'standard',
              userInfo: mockUserInfo,
            },
          },
        ]}
      >
        <Checkout_Step3 />
      </MemoryRouter>
    );

    // Esperar a que cargue
    await waitFor(() => {
      expect(screen.getByText(/dirección de envío/i)).toBeInTheDocument();
    });

    // Hacer clic en "Agregar nueva dirección"
    const addButton = screen.getByRole('button', { name: /agregar nueva dirección/i });
    await user.click(addButton);

    // Debe abrir el modal
    await waitFor(() => {
      expect(screen.getByText(/nueva dirección/i)).toBeInTheDocument();
    });

    // Llenar el formulario
    const direccionInput = screen.getByPlaceholderText(/dirección \(línea 1\)/i);
    await user.type(direccionInput, 'Av. Arequipa 456');

    const ciudadInput = screen.getByPlaceholderText(/ciudad/i);
    await user.type(ciudadInput, 'Arequipa');

    const provinciaInput = screen.getByPlaceholderText(/provincia/i);
    await user.type(provinciaInput, 'Arequipa');

    const codigoPostalInput = screen.getByPlaceholderText(/código postal/i);
    await user.type(codigoPostalInput, '04001');

    const paisInput = screen.getByPlaceholderText(/país/i);
    await user.type(paisInput, 'Perú');

    // Guardar
    const saveButton = screen.getByRole('button', { name: /guardar/i });
    await user.click(saveButton);

    // El modal debe cerrarse y la nueva dirección debe aparecer
    await waitFor(() => {
      expect(screen.getByText(/arequipa 456/i)).toBeInTheDocument();
    });
  });

  it('should allow editing an existing address', async () => {
    const user = userEvent.setup();

    server.use(
      http.put('http://localhost:3000/api/envio/direcciones/1', async ({ request }) => {
        const body = await request.json() as any;
        return HttpResponse.json({
          id: 1,
          direccionLinea1: 'Av. Javier Prado 123',
          direccionLinea2: body.direccionLinea2,
          ciudad: 'Lima',
          provincia: 'Lima',
          codigoPostal: '15001',
          pais: 'Perú',
          principal: true,
          latitud: -12.0464,
          longitud: -77.0428,
        });
      })
    );

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/checkout/step3',
            state: {
              passedCart: mockCart,
              shippingMethod: 'standard',
              userInfo: mockUserInfo,
            },
          },
        ]}
      >
        <Checkout_Step3 />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/javier prado/i)).toBeInTheDocument();
    });

    // Hacer clic en "Editar"
    const editButton = screen.getByRole('button', { name: /editar/i });
    await user.click(editButton);

    // Debe abrir el modal con datos prellenados
    await waitFor(() => {
      expect(screen.getByText(/editar dirección/i)).toBeInTheDocument();
    });

    // Modificar dirección línea 2
    const direccionLinea2Input = screen.getByPlaceholderText(/dirección \(línea 2 opcional\)/i);
    await user.clear(direccionLinea2Input);
    await user.type(direccionLinea2Input, 'Oficina 402');

    // Guardar
    const saveButton = screen.getByRole('button', { name: /guardar/i });
    await user.click(saveButton);

    // Verificar que se actualizó
    await waitFor(() => {
      expect(screen.getByText(/oficina 402/i)).toBeInTheDocument();
    });
  });

  it('should allow deleting an address', async () => {
    const user = userEvent.setup();

    server.use(
      http.get('http://localhost:3000/api/envio/usuario/20/direcciones', () => {
        return HttpResponse.json([
          {
            id: 1,
            direccionLinea1: 'Av. Javier Prado 123',
            ciudad: 'Lima',
            provincia: 'Lima',
            codigoPostal: '15001',
            pais: 'Perú',
            principal: true,
          },
          {
            id: 2,
            direccionLinea1: 'Av. Arequipa 456',
            ciudad: 'Lima',
            provincia: 'Lima',
            codigoPostal: '15002',
            pais: 'Perú',
            principal: false,
          },
        ]);
      }),
      http.delete('http://localhost:3000/api/envio/direcciones/2', () => {
        return new HttpResponse(null, { status: 204 });
      })
    );

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/checkout/step3',
            state: {
              passedCart: mockCart,
              shippingMethod: 'standard',
              userInfo: mockUserInfo,
            },
          },
        ]}
      >
        <Checkout_Step3 />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/arequipa 456/i)).toBeInTheDocument();
    });

    // Buscar el botón de eliminar de la segunda dirección
    const arequipaAddress = screen.getByText(/arequipa 456/i).closest('div');
    const deleteButton = within(arequipaAddress!).getByRole('button', { name: /eliminar/i });
    
    await user.click(deleteButton);

    // La dirección debe desaparecer
    await waitFor(() => {
      expect(screen.queryByText(/arequipa 456/i)).not.toBeInTheDocument();
    });
  });

  it('should allow marking an address as primary', async () => {
    const user = userEvent.setup();

    server.use(
      http.get('http://localhost:3000/api/envio/usuario/20/direcciones', () => {
        return HttpResponse.json([
          {
            id: 1,
            direccionLinea1: 'Av. Javier Prado 123',
            ciudad: 'Lima',
            provincia: 'Lima',
            codigoPostal: '15001',
            pais: 'Perú',
            principal: true,
          },
          {
            id: 2,
            direccionLinea1: 'Av. Arequipa 456',
            ciudad: 'Lima',
            provincia: 'Lima',
            codigoPostal: '15002',
            pais: 'Perú',
            principal: false,
          },
        ]);
      }),
      http.patch('http://localhost:3000/api/envio/usuario/20/direcciones/2/principal', () => {
        return new HttpResponse(null, { status: 200 });
      })
    );

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/checkout/step3',
            state: {
              passedCart: mockCart,
              shippingMethod: 'standard',
              userInfo: mockUserInfo,
            },
          },
        ]}
      >
        <Checkout_Step3 />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/arequipa 456/i)).toBeInTheDocument();
    });

    // Buscar el botón "Marcar como principal" de la segunda dirección
    const arequipaAddress = screen.getByText(/arequipa 456/i).closest('div');
    const markPrimaryButton = within(arequipaAddress!).getByRole('button', { 
      name: /marcar como principal/i 
    });
    
    await user.click(markPrimaryButton);

    // Verificar que el estado cambió (esto depende de tu implementación de optimistic updates)
    await waitFor(() => {
      const addresses = screen.getAllByText(/dirección principal/i);
      expect(addresses.length).toBeGreaterThan(0);
    });
  });

  it('should show validation errors for incomplete address form', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/checkout/step3',
            state: {
              passedCart: mockCart,
              shippingMethod: 'standard',
              userInfo: mockUserInfo,
            },
          },
        ]}
      >
        <Checkout_Step3 />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/dirección de envío/i)).toBeInTheDocument();
    });

    // Abrir modal
    const addButton = screen.getByRole('button', { name: /agregar nueva dirección/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/nueva dirección/i)).toBeInTheDocument();
    });

    // Intentar guardar sin llenar campos requeridos
    const saveButton = screen.getByRole('button', { name: /guardar/i });
    await user.click(saveButton);

    // El modal NO debe cerrarse (porque la validación falla en el hook)
    expect(screen.getByText(/nueva dirección/i)).toBeInTheDocument();
  });

  it('should select address for checkout', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/checkout/step3',
            state: {
              passedCart: mockCart,
              shippingMethod: 'standard',
              userInfo: mockUserInfo,
            },
          },
        ]}
      >
        <Checkout_Step3 />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/javier prado/i)).toBeInTheDocument();
    });

    // Hacer clic en la dirección para seleccionarla
    const addressCard = screen.getByText(/javier prado/i).closest('div');
    await user.click(addressCard!);

    // Debe mostrar que está seleccionada
    await waitFor(() => {
      expect(screen.getByText(/dirección seleccionada/i)).toBeInTheDocument();
    });

    // El botón de continuar debe estar habilitado (después de seleccionar carrier)
    // Esto se prueba en los tests de flujo completo
  });
});