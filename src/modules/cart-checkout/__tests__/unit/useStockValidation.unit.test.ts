import { renderHook, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { useStockValidation } from "../../hooks/useStockValidation";

describe("useStockValidation", () => {
  const API_URL = "https://fake-inventory";
  const productIds = [10, 20];

  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("VITE_API_INVENTORY_URL", "https://fake-inventory");
  });

  const mockResponse = [
    { id_producto: 10, stock_disponible_total: 5 },
    { id_producto: 20, stock_disponible_total: 0 },
  ];

  it("carga stock correctamente y convierte en Map", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useStockValidation(productIds));

    // Debe arrancar en loading
    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    const stockInfo = result.current.stockInfo;
    expect(stockInfo.get(10)?.stock_disponible_total).toBe(5);
    expect(stockInfo.get(20)?.stock_disponible_total).toBe(0);

    // Debió llamar con los params correctos
    expect(global.fetch).toHaveBeenCalledWith(
      `${API_URL}/api/stock/bulk`,
      expect.objectContaining({
        method: "POST",
        headers: expect.any(Object),
      })
    );
  });

  it("maneja error cuando el fetch falla", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });

    const { result } = renderHook(() => useStockValidation(productIds));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toContain("500");
    expect(result.current.stockInfo.size).toBe(0);
  });

  it("no vuelve a hacer fetch si ya se hizo con los mismos productIds", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const { result, rerender } = renderHook(
      ({ ids }) => useStockValidation(ids),
      { initialProps: { ids: productIds } }
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    // Primera llamada
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Re-render con mismos IDs → no debería llamar otra vez
    rerender({ ids: productIds });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("getProductStockStatus calcula correctamente", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useStockValidation(productIds));
    await waitFor(() => expect(result.current.loading).toBe(false));

    const status = result.current.getProductStockStatus(10, 3);

    expect(status).toEqual({
      idProducto: 10,
      stockDisponible: 5,
      tieneStock: true,
      excedeCantidad: false,
      cantidadMaxima: 5,
    });
  });

  it("validateCart retorna resultados correctos", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useStockValidation(productIds));
    await waitFor(() => expect(result.current.loading).toBe(false));

    const cart = [
      { idProducto: 10, cantidad: 2 }, // OK
      { idProducto: 20, cantidad: 1 }, // Sin stock
    ];

    const validation = result.current.validateCart(cart);

    expect(validation.isValid).toBe(false);
    expect(validation.hasOutOfStock).toBe(true);
    expect(validation.hasExceeded).toBe(true);
    expect(validation.details.length).toBe(2);
  });
});
