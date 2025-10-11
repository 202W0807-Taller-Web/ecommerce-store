import { useCallback, useEffect, useState } from "react";

export interface CartItem {
  idProducto: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagenUrl: string; // 👈 esto debe existir
}


export function useCart(userId = 1) {
  const apiUrl = "http://localhost:8080/api/carritos";
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener carrito del usuario
  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/usuario/${userId}`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setCart(data.items ?? []); // tu backend devuelve { idCarrito, idUsuario, items, total }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, userId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Agregar producto al carrito
  const addToCart = async (producto: CartItem) => {
    setLoading(true);
    try {
      await fetch(`${apiUrl}/usuario/${userId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto),
      });
      await fetchCart();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar cantidad
  const updateQuantity = async (idProducto: number, nuevaCantidad: number) => {
    setLoading(true);
    try {
      await fetch(`${apiUrl}/${userId}/items/${idProducto}?nuevaCantidad=${nuevaCantidad}`, {
        method: "PATCH",
      });
      await fetchCart();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar item
  const removeFromCart = async (idProducto: number) => {
    setLoading(true);
    try {
      await fetch(`${apiUrl}/${userId}/items/${idProducto}`, { method: "DELETE" });
      await fetchCart();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { cart, loading, error, addToCart, updateQuantity, removeFromCart };
}
