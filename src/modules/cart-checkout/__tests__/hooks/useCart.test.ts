import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCart } from '../../hooks/useCart';
import type { Carrito } from '../../entities';

// Mock de fetch global
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('useCart', () => {
  const mockCart: Carrito = {
    id: 7,
    idUsuario: null,
    items: [
      {
        idProducto: 1,
        nombre: 'Producto Test',
        precio: 100,
        cantidad: 2,
        imagenUrl: 'test.jpg',
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    import.meta.env.VITE_API_CART_CHECKOUT_URL = 'http://localhost:3000';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch cart on mount', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCart,
    });

    const { result } = renderHook(() => useCart());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.cart).toEqual(mockCart);
    expect(result.current.error).toBe(null);
  });

  it('should handle fetch error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.cart).toBe(null);
  });

  it('should add item to cart', async () => {
    const updatedCart: Carrito = {
      ...mockCart,
      items: [
        ...mockCart.items,
        {
          idProducto: 2,
          nombre: 'Nuevo Producto',
          precio: 50,
          cantidad: 1,
        },
      ],
    };

    // Mock para fetchCart inicial
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCart,
    });

    const { result } = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.cart).toEqual(mockCart);
    });

    // Mock para addToCart
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => updatedCart,
    });

    await result.current.addToCart({
      idProducto: 2,
      nombre: 'Nuevo Producto',
      precio: 50,
      cantidad: 1,
    });

    await waitFor(() => {
      expect(result.current.cart?.items.length).toBe(2);
    });
  });

  it('should update item quantity', async () => {
    const updatedCart: Carrito = {
      ...mockCart,
      items: [{ ...mockCart.items[0], cantidad: 5 }],
    };

    // Mock para fetchCart inicial
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCart,
    });

    const { result } = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.cart).toEqual(mockCart);
    });

    // Mock para updateQuantity
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => updatedCart,
    });

    await result.current.updateQuantity(1, 5);

    await waitFor(() => {
      expect(result.current.cart?.items[0].cantidad).toBe(5);
    });
  });

  it('should remove item from cart', async () => {
    const updatedCart: Carrito = {
      ...mockCart,
      items: [],
    };

    // Mock para fetchCart inicial
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCart,
    });

    const { result } = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.cart).toEqual(mockCart);
    });

    // Mock para removeFromCart
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => updatedCart,
    });

    await result.current.removeFromCart(1);

    await waitFor(() => {
      expect(result.current.cart?.items.length).toBe(0);
    });
  });

  it('should clear cart', async () => {
    const clearedCart: Carrito = {
      ...mockCart,
      items: [],
    };

    // Mock para fetchCart inicial
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCart,
    });

    const { result } = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.cart).toEqual(mockCart);
    });

    // Mock para clearCart
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 204,
    });

    await result.current.clearCart();

    await waitFor(() => {
      expect(result.current.cart?.items.length).toBe(0);
    });
  });

  it('should handle optimistic updates on error', async () => {
    // Mock para fetchCart inicial
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCart,
    });

    const { result } = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.cart).toEqual(mockCart);
    });

    // Mock para addToCart con error
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    try {
      await result.current.addToCart({
        idProducto: 2,
        nombre: 'Nuevo Producto',
        precio: 50,
        cantidad: 1,
      });
    } catch (error) {
      // Esperamos el error
    }

    await waitFor(() => {
      // El carrito debe revertirse al estado original
      expect(result.current.cart).toEqual(mockCart);
      expect(result.current.error).toBeTruthy();
    });
  });
});
