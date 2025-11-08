import { useCallback, useEffect, useState } from "react";

export interface CartItem {
  idProducto: number;
  idVariante?: number | null;
  nombre: string;
  precio: number;
  cantidad: number;
  imagenUrl?: string;
}

export interface Carrito {
  id: number;
  idUsuario?: number | null;
  items: CartItem[];
}

export function useCart() {
  const baseUrl = import.meta.env.VITE_API_CART_CHECKOUT_URL + "/api/carritos";
  const cartId = 7; // 🔹 temporalmente hardcodeado
  const [cart, setCart] = useState<Carrito | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------- Obtener carrito ----------
  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/${cartId}`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setCart(data);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, cartId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // ---------- Agregar producto ----------
  const addToCart = async (producto: CartItem) => {
    if (!cart) return;

    // Optimistic update
    const previousCart = cart;
    const existingItemIndex = cart.items.findIndex(
      (item) => item.idProducto === producto.idProducto &&
                item.idVariante === producto.idVariante
    );

    if (existingItemIndex >= 0) {
      // Incrementar cantidad si ya existe
      const updatedItems = [...cart.items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        cantidad: updatedItems[existingItemIndex].cantidad + producto.cantidad
      };
      setCart({ ...cart, items: updatedItems });
    } else {
      // Agregar nuevo item
      setCart({ ...cart, items: [...cart.items, producto] });
    }

    try {
      const url = `${baseUrl}/${cartId}/anonimo/items`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto),
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);
      const updated = await res.json();
      setCart(updated);
      setError(null);
    } catch (err) {
      // Revertir en caso de error
      setCart(previousCart);
      setError((err as Error).message);
      throw err;
    }
  };

  // ---------- Actualizar cantidad ----------
  const updateQuantity = async (
    idProducto: number,
    nuevaCantidad: number,
    idVariante?: number | null
  ) => {
    if (!cart || nuevaCantidad < 1) return;

    // Optimistic update
    const previousCart = cart;
    const updatedItems = cart.items.map((item) =>
      item.idProducto === idProducto && item.idVariante === idVariante
        ? { ...item, cantidad: nuevaCantidad }
        : item
    );
    setCart({ ...cart, items: updatedItems });

    try {
      const url = `${baseUrl}/${cartId}/anonimo/items/${idProducto}/${idVariante ?? 0}?nuevaCantidad=${nuevaCantidad}`;
      const res = await fetch(url, { method: "PATCH" });

      if (!res.ok) throw new Error(`Error ${res.status}`);
      const updated = await res.json();
      setCart(updated);
      setError(null);
    } catch (err) {
      // Revertir en caso de error
      setCart(previousCart);
      setError((err as Error).message);
      throw err;
    }
  };

  // ---------- Eliminar producto ----------
  const removeFromCart = async (idProducto: number, idVariante?: number | null) => {
    if (!cart) return;

    // Optimistic update
    const previousCart = cart;
    const updatedItems = cart.items.filter(
      (item) => !(item.idProducto === idProducto && item.idVariante === idVariante)
    );
    setCart({ ...cart, items: updatedItems });

    try {
      const url = `${baseUrl}/${cartId}/anonimo/items/${idProducto}/${idVariante ?? 0}`;
      const res = await fetch(url, { method: "DELETE" });

      if (!res.ok) throw new Error(`Error ${res.status}`);
      const updated = await res.json();
      setCart(updated);
      setError(null);
    } catch (err) {
      // Revertir en caso de error
      setCart(previousCart);
      setError((err as Error).message);
      throw err;
    }
  };

  // ---------- Vaciar carrito ----------
  const clearCart = async () => {
    if (!cart) return;

    // Optimistic update
    const previousCart = cart;
    setCart({ ...cart, items: [] });

    try {
      const url = `${baseUrl}/${cartId}/anonimo/items`;
      const res = await fetch(url, { method: "DELETE" });

      if (!res.ok && res.status !== 204) throw new Error(`Error ${res.status}`);
      setError(null);
    } catch (err) {
      // Revertir en caso de error
      setCart(previousCart);
      setError((err as Error).message);
      throw err;
    }
  };

  return {
    cart,
    loading,
    error,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };
}