import { useCallback, useEffect, useState, useContext } from "react";
import { AuthContext } from "../../client-auth/context/AuthContext";
import type { CartItem, Carrito } from "../entities";

export type { CartItem, Carrito } from "../entities";

const CART_ID_KEY = "carritoId";

export function useCart() {
  const baseUrl = import.meta.env.VITE_API_CART_CHECKOUT_URL + "/api/carritos";
  const [cart, setCart] = useState<Carrito | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener info de autenticación
  const auth = useContext(AuthContext);
  const userId = auth?.isAuth && auth?.user ? auth.user.id : undefined;

  const getCartId = (): number | null => {
    const cartId = localStorage.getItem(CART_ID_KEY);
    return cartId ? parseInt(cartId) : null;
  };

  // ---------- Obtener carrito ----------
  const fetchCart = useCallback(async () => {
    const cartId = getCartId();

    if (!cartId) {
      // No hay carrito todavía
      setCart(null);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/${cartId}`);
      if (!res.ok) {
        if (res.status === 404) {
          localStorage.removeItem(CART_ID_KEY);
          setCart(null);
          return;
        }
        throw new Error(`Error ${res.status}`);
      }
      const data = await res.json();
      setCart(data);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // ---------- Agregar producto ----------
  const addToCart = async (producto: CartItem) => {
    let cartId = getCartId();

    // Si no hay carrito, crear uno nuevo
    if (!cartId) {
      try {
        const createRes = await fetch(`${baseUrl}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!createRes.ok) throw new Error("Error al crear carrito");

        const newCart = await createRes.json();
        cartId = newCart.idCarrito;
        localStorage.setItem(CART_ID_KEY, cartId!.toString());

        console.log("✅ Carrito creado:", cartId);

        // Si hay usuario autenticado, asignar inmediatamente
        if (userId) {
          try {
            await fetch(
              `${baseUrl}/${cartId}/asignar-usuario?idUsuario=${userId}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
              },
            );
            console.log("✅ Carrito asignado al usuario");
          } catch (err) {
            console.warn("⚠️ No se pudo asignar usuario al carrito:", err);
          }
        }
      } catch (err) {
        setError("No se pudo crear el carrito");
        throw err;
      }
    }

    if (!cart) return;

    // Optimistic update
    const previousCart = cart;
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.idProducto === producto.idProducto &&
        item.idVariante === producto.idVariante,
    );

    if (existingItemIndex >= 0) {
      // Incrementar cantidad si ya existe
      const updatedItems = [...cart.items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        cantidad: updatedItems[existingItemIndex].cantidad + producto.cantidad,
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
    idVariante?: number | null,
  ) => {
    const cartId = getCartId();
    if (!cart || !cartId || nuevaCantidad < 1) return;

    // Optimistic update
    const previousCart = cart;
    const updatedItems = cart.items.map((item) =>
      item.idProducto === idProducto && item.idVariante === idVariante
        ? { ...item, cantidad: nuevaCantidad }
        : item,
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
  const removeFromCart = async (
    idProducto: number,
    idVariante?: number | null,
  ) => {
    const cartId = getCartId();
    if (!cart || !cartId) return;

    // Optimistic update
    const previousCart = cart;
    const updatedItems = cart.items.filter(
      (item) =>
        !(item.idProducto === idProducto && item.idVariante === idVariante),
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
    const cartId = getCartId();
    if (!cart || !cartId) return;

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
