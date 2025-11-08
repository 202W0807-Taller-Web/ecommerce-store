import { useEffect, useState, useCallback, useRef } from "react";

export interface StockInfo {
  id_producto: number;
  stock_total: number;
  stock_disponible_total: number;
  stock_reservado_total: number;
  almacenes: {
    id_almacen: number;
    stock_disponible: number;
    stock_reservado: number;
    stock_total: number;
  }[];
}

export interface ProductStockStatus {
  idProducto: number;
  stockDisponible: number;
  tieneStock: boolean;
  excedeCantidad: boolean;
  cantidadMaxima: number;
}

export function useStockValidation(productIds: number[]) {
  const [stockInfo, setStockInfo] = useState<Map<number, StockInfo>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasFetchedRef = useRef(false);
  const lastRequestRef = useRef<string>("");

  const fetchStock = useCallback(async () => {
    if (!productIds || productIds.length === 0) {
      setStockInfo(new Map());
      return;
    }

    const requestKey = JSON.stringify([...productIds].sort());

    if (hasFetchedRef.current && lastRequestRef.current === requestKey) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_INVENTORY_URL}/api/stock/bulk`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productIds }),
        }
      );

      if (!res.ok) throw new Error(`Error ${res.status}`);

      const data: StockInfo[] = await res.json();

      // Convertir array a Map para acceso O(1)
      const stockMap = new Map<number, StockInfo>();
      data.forEach((item) => {
        stockMap.set(item.id_producto, item);
      });

      setStockInfo(stockMap);

      hasFetchedRef.current = true;
      lastRequestRef.current = requestKey;
    } catch (err) {
      console.error("Error validando stock:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [productIds]);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  // Obtener estado de stock para un producto específico
  const getProductStockStatus = useCallback(
    (idProducto: number, cantidadSolicitada: number): ProductStockStatus => {
      const info = stockInfo.get(idProducto);

      if (!info) {
        return {
          idProducto,
          stockDisponible: 0,
          tieneStock: false,
          excedeCantidad: true,
          cantidadMaxima: 0,
        };
      }

      return {
        idProducto,
        stockDisponible: info.stock_disponible_total,
        tieneStock: info.stock_disponible_total > 0,
        excedeCantidad: cantidadSolicitada > info.stock_disponible_total,
        cantidadMaxima: info.stock_disponible_total,
      };
    },
    [stockInfo]
  );

  // Validar todo el carrito de una vez
  const validateCart = useCallback(
    (cartItems: { idProducto: number; cantidad: number }[]) => {
      const results = cartItems.map((item) =>
        getProductStockStatus(item.idProducto, item.cantidad)
      );

      const hasOutOfStock = results.some((r) => !r.tieneStock);
      const hasExceeded = results.some((r) => r.excedeCantidad);

      return {
        isValid: !hasOutOfStock && !hasExceeded,
        hasOutOfStock,
        hasExceeded,
        details: results,
      };
    },
    [getProductStockStatus]
  );

  return {
    stockInfo,
    loading,
    error,
    fetchStock,
    getProductStockStatus,
    validateCart,
  };
}