// src/modules/cart-checkout/__tests__/functional/CartManagement.functional.test.tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { server } from './setup';
import { http, HttpResponse } from 'msw';
import CartPage from '../../page/cart_page';

describe('Cart Management - Functional Tests', () => {
  beforeEach(() => {
    import.meta.env.VITE_API_CART_CHECKOUT_URL = 'http://localhost:3000';
    import.meta.env.VITE_API_INVENTORY_URL = 'http://localhost:3002';
  });

  it('should display cart with items', async () => {
    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    );

    // Debe mostrar el producto
    await waitFor(() => {
      expect(screen.getByText(/laptop gaming/i)).toBeInTheDocument();
    });

    // Debe mostrar el precio
    expect(screen.getByText(/\$1500/)).toBeInTheDocument();

    // Debe mostrar la cantidad
    expect(screen.getByText('1')).toBeInTheDocument();

    // Debe mostrar el total
    expect(screen.getByText(/\$1500\.00/)).toBeInTheDocument();
  });

  it('should show empty cart message when cart has no items', async () => {
    server.use(
      http.get('http://localhost:3000/api/carritos/7', () => {
        return HttpResponse.json({
          id: 7,
          idUsuario: null,
          items: [],
        });
      })
    );

    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/carrito está vacío/i)).toBeInTheDocument();
    });

    // El botón de continuar debe estar deshabilitado
    const continueBtn = screen.getByRole('button', { name: /continuar compra/i });
    expect(continueBtn).toBeDisabled();
  });

  it('should increase product quantity', async () => {
    const user = userEvent.setup();

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
              idVariante: null,
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

    await waitFor(() => {
      expect(screen.getByText(/laptop gaming/i)).toBeInTheDocument();
    });

    // Hacer clic en el botón "+"
    const increaseBtn = screen.getAllByText('+')[0];
    await user.click(increaseBtn);

    // Verificar que la cantidad aumentó
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    // Verificar que el total se actualizó
    await waitFor(() => {
      expect(screen.getByText(/\$3000\.00/)).toBeInTheDocument();
    });
  });

  it('should decrease product quantity', async () => {
    const user = userEvent.setup();

    // Primero, carrito con cantidad 2
    server.use(
      http.get('http://localhost:3000/api/carritos/7', () => {
        return HttpResponse.json({
          id: 7,
          items: [
            {
              idProducto: 1,
              nombre: 'Laptop Gaming',
              precio: 1500,
              cantidad: 2,
              imagenUrl: 'laptop.jpg',
              idVariante: null,
            },
          ],
        });
      }),
      http.patch('http://localhost:3000/api/carritos/7/anonimo/items/1/0', () => {
        return HttpResponse.json({
          id: 7,
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
        });
      })
    );

    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    // Hacer clic en el botón "-"
    const decreaseBtn = screen.getAllByText('-')[0];
    await user.click(decreaseBtn);

    // Verificar que la cantidad disminuyó
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  it('should not allow decreasing quantity below 1', async () => {
    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    // El botón "-" debe estar deshabilitado cuando la cantidad es 1
    const decreaseBtn = screen.getAllByText('-')[0].closest('button');
    expect(decreaseBtn).toBeDisabled();
  });

  it('should remove item from cart', async () => {
    const user = userEvent.setup();

    server.use(
      http.delete('http://localhost:3000/api/carritos/7/anonimo/items/1/0', () => {
        return HttpResponse.json({
          id: 7,
          items: [],
        });
      })
    );

    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/laptop gaming/i)).toBeInTheDocument();
    });

    // Hacer clic en el botón de eliminar (icono 🗑️)
    const deleteBtn = screen.getByTitle(/eliminar producto/i);
    await user.click(deleteBtn);

    // Verificar que el carrito quedó vacío
    await waitFor(() => {
      expect(screen.getByText(/carrito está vacío/i)).toBeInTheDocument();
    });

    // Debe mostrar mensaje de éxito
    await waitFor(() => {
      expect(screen.getByText(/producto eliminado/i)).toBeInTheDocument();
    });
  });

  it('should show warning when exceeding available stock', async () => {
    const user = userEvent.setup();

    server.use(
      http.post('http://localhost:3002/api/stock/bulk', () => {
        return HttpResponse.json([
          {
            id_producto: 1,
            stock_total: 10,
            stock_disponible_total: 5, // Solo 5 disponibles
            stock_reservado_total: 5,
            almacenes: [],
          },
        ]);
      })
    );

    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/laptop gaming/i)).toBeInTheDocument();
    });

    // Intentar aumentar la cantidad más allá del stock disponible
    const increaseBtn = screen.getAllByText('+')[0];
    
    // Hacer clic múltiples veces
    for (let i = 0; i < 10; i++) {
      await user.click(increaseBtn);
    }

    // Debe mostrar advertencia
    await waitFor(() => {
      expect(screen.getByText(/solo hay 5 unidades disponibles/i)).toBeInTheDocument();
    });
  });

  it('should show stock status indicators', async () => {
    server.use(
      http.post('http://localhost:3002/api/stock/bulk', () => {
        return HttpResponse.json([
          {
            id_producto: 1,
            stock_total: 3,
            stock_disponible_total: 3, // Pocas unidades
            stock_reservado_total: 0,
            almacenes: [],
          },
        ]);
      })
    );

    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/laptop gaming/i)).toBeInTheDocument();
    });

    // Debe mostrar indicador de últimas unidades
    await waitFor(() => {
      expect(screen.getByText(/últimas unidades disponibles/i)).toBeInTheDocument();
    });
  });

  it('should handle multiple items in cart', async () => {
    server.use(
      http.get('http://localhost:3000/api/carritos/7', () => {
        return HttpResponse.json({
          id: 7,
          items: [
            {
              idProducto: 1,
              nombre: 'Laptop Gaming',
              precio: 1500,
              cantidad: 1,
              imagenUrl: 'laptop.jpg',
            },
            {
              idProducto: 2,
              nombre: 'Mouse Gamer',
              precio: 50,
              cantidad: 2,
              imagenUrl: 'mouse.jpg',
            },
            {
              idProducto: 3,
              nombre: 'Teclado Mecánico',
              precio: 120,
              cantidad: 1,
              imagenUrl: 'keyboard.jpg',
            },
          ],
        });
      }),
      http.post('http://localhost:3002/api/stock/bulk', () => {
        return HttpResponse.json([
          {
            id_producto: 1,
            stock_total: 100,
            stock_disponible_total: 80,
            stock_reservado_total: 20,
            almacenes: [],
          },
          {
            id_producto: 2,
            stock_total: 200,
            stock_disponible_total: 150,
            stock_reservado_total: 50,
            almacenes: [],
          },
          {
            id_producto: 3,
            stock_total: 50,
            stock_disponible_total: 40,
            stock_reservado_total: 10,
            almacenes: [],
          },
        ]);
      })
    );

    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    );

    // Verificar que se muestran todos los productos
    await waitFor(() => {
      expect(screen.getByText(/laptop gaming/i)).toBeInTheDocument();
      expect(screen.getByText(/mouse gamer/i)).toBeInTheDocument();
      expect(screen.getByText(/teclado mecánico/i)).toBeInTheDocument();
    });

    // Verificar el total correcto: 1500 + (50*2) + 120 = 1720
    await waitFor(() => {
      expect(screen.getByText(/\$1720\.00/)).toBeInTheDocument();
    });

    // Verificar el contador de items: 4 productos (1 laptop + 2 mouse + 1 teclado)
    expect(screen.getByText(/4 productos/i)).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    const user = userEvent.setup();

    server.use(
      http.patch('http://localhost:3000/api/carritos/7/anonimo/items/1/0', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/laptop gaming/i)).toBeInTheDocument();
    });

    // Intentar aumentar cantidad
    const increaseBtn = screen.getAllByText('+')[0];
    await user.click(increaseBtn);

    // Debe mostrar mensaje de error
    await waitFor(() => {
      expect(screen.getByText(/error al actualizar cantidad/i)).toBeInTheDocument();
    });
  });
});