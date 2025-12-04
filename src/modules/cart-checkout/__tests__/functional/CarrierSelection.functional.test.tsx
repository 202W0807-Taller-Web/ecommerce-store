import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { useUserLocation } from "../../hooks/useUserLocation";
import { beforeEach, describe, expect, test, vi } from "vitest";
import CarrierSelection from "../../components/carrierSelection";

vi.mock("../../hooks/useUserLocation", () => ({
  useUserLocation: vi.fn(),
}));

describe("CarrierSelection - Functional Tests", () => {
  const mockCart = [{ idProducto: 1, cantidad: 2 }];

  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
  });

  test("muestra loading cuando la ubicación está cargando", () => {
    (useUserLocation as any).mockReturnValue({
      lat: null,
      lng: null,
      loading: true,
      error: null,
    });

    render(<CarrierSelection cart={mockCart} />);

    expect(
      screen.getByText("Obteniendo información de envío...")
    ).toBeInTheDocument();
  });

  test("muestra error si no se puede obtener ubicación", () => {
    (useUserLocation as any).mockReturnValue({
      lat: null,
      lng: null,
      loading: false,
      error: "No se pudo obtener ubicación",
    });

    render(<CarrierSelection cart={mockCart} />);

    expect(screen.getByText("No se pudo obtener ubicación")).toBeInTheDocument();
  });

  test("usa destinationAddress en lugar de la ubicación del usuario", async () => {
    // Ubicación del usuario NO debe ser usada
    (useUserLocation as any).mockReturnValue({
      lat: 0,
      lng: 0,
      loading: false,
      error: null,
    });

    const destination = {
      lat: -12.05,
      lng: -77.04,
      direccion: "Av. Test 123",
    };

    const mockResponse = {
      success: true,
      distancia_km: 2.5,
      almacen_origen: { id: 10, nombre: "Almacén Sur" },
      domicilio: {
        carriers: [
          {
            cotizacion_id: "CARR1",
            carrier_nombre: "RappiExpress",
            carrier_tipo: "Rápido",
            costo_envio: 14.9,
            logo_url: null,
            tiempo_estimado_dias: 2,
            fecha_entrega_estimada: "2025-01-15",
            peso_maximo_kg: 20,
            distancia_km: 2.5,
          },
        ],
      },
    };

    (fetch as any).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse),
    });

    render(
      <CarrierSelection
        cart={mockCart}
        destinationAddress={destination}
      />
    );

    await waitFor(() =>
      expect(screen.getByText("RappiExpress")).toBeInTheDocument()
    );

    // Verifica que la API fue llamada con lat/lng del destino, NO con el hook
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/cotizaciones"),
      expect.objectContaining({
        body: expect.stringContaining(`"destino_lat":${destination.lat}`),
      })
    );
  });

  test("muestra las opciones de envío después del fetch", async () => {
    (useUserLocation as any).mockReturnValue({
      lat: -12.04,
      lng: -77.03,
      loading: false,
      error: null,
    });

    const mockResponse = {
      success: true,
      distancia_km: 3.1,
      almacen_origen: { id: 5, nombre: "Almacén Central" },
      domicilio: {
        carriers: [
          {
            cotizacion_id: "COT123",
            carrier_nombre: "Olva Courier",
            carrier_tipo: "Estándar",
            costo_envio: 10.5,
            logo_url: null,
            tiempo_estimado_dias: 3,
            fecha_entrega_estimada: "2025-01-20",
            peso_maximo_kg: 30,
            distancia_km: 3.1,
          },
        ],
      },
    };

    (fetch as any).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse),
    });

    render(<CarrierSelection cart={mockCart} />);

    await waitFor(() =>
      expect(screen.getByText("Olva Courier")).toBeInTheDocument()
    );

    expect(
      screen.getByText("1 opción de envío disponibles")
    ).toBeInTheDocument();
  });

  test("al seleccionar un carrier ejecuta onSelectCarrier", async () => {
    const mockOnSelect = vi.fn();

    (useUserLocation as any).mockReturnValue({
      lat: -12.04,
      lng: -77.03,
      loading: false,
      error: null,
    });

    const mockCarrier = {
      cotizacion_id: "COT999",
      carrier_nombre: "Chaski",
      carrier_tipo: "Económico",
      costo_envio: 8.5,
      logo_url: null,
      tiempo_estimado_dias: 4,
      fecha_entrega_estimada: "2025-02-02",
      peso_maximo_kg: 10,
      distancia_km: 5.0,
    };

    const mockResponse = {
      success: true,
      distancia_km: 5,
      almacen_origen: { id: 99, nombre: "Almacén Norte" },
      domicilio: {
        carriers: [mockCarrier],
      },
    };

    (fetch as any).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse),
    });

    render(<CarrierSelection cart={mockCart} onSelectCarrier={mockOnSelect} />);

    await waitFor(() =>
      expect(screen.getByText("Chaski")).toBeInTheDocument()
    );

    fireEvent.click(screen.getByText("Chaski"));

    expect(mockOnSelect).toHaveBeenCalledWith({
      carrier: mockCarrier,
      almacenOrigen: mockResponse.almacen_origen,
      distanciaKm: 5,
    });
  });
});
