import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { useUserLocation } from "../../hooks/useUserLocation";
import { beforeEach, describe, expect, test, vi } from "vitest";
import PickupSelection from "../../components/pickupSelection";

vi.mock("../../hooks/useUserLocation", () => ({
  useUserLocation: vi.fn(),
}));

describe("PickupSelection - Functional", () => {
  const mockCart = [{ idProducto: 1, cantidad: 2 }];

  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
  });

  test("muestra 'Obteniendo tu ubicación...' cuando está cargando", () => {
    (useUserLocation as any).mockReturnValue({
      lat: null,
      lng: null,
      loading: true,
      error: null,
    });

    render(<PickupSelection cart={mockCart} />);

    expect(screen.getByText("Obteniendo tu ubicación...")).toBeInTheDocument();
  });

  test("muestra error si no se puede obtener la ubicación", () => {
    (useUserLocation as any).mockReturnValue({
      lat: null,
      lng: null,
      loading: false,
      error: "No se pudo obtener ubicación",
    });

    render(<PickupSelection cart={mockCart} />);

    expect(screen.getByText("No se pudo obtener ubicación")).toBeInTheDocument();
  });

  test("realiza el fetch y muestra las tiendas", async () => {
    (useUserLocation as any).mockReturnValue({
      lat: -12.04,
      lng: -77.03,
      loading: false,
      error: null,
    });

    const mockResponse = {
      success: true,
      distancia_km: 2.2,
      almacen_origen: { id: 1, nombre: "Almacén Central" },
      recojo_tienda: {
        tipo_envio: "pickup",
        costo_envio: 0,
        tiempo_estimado_dias: 1,
        fecha_entrega_estimada: "2025-01-01",
        descripcion: "",
        disponible: true,
        mensaje: "",
        tiendas: [
          {
            id: 101,
            nombre: "Tienda Lima Centro",
            direccion: "Av. Siempre Viva 123",
            latitud: 0,
            longitud: 0,
            distancia_km: 1.3,
            imagen: null,
          },
        ],
      },
    };

    (fetch as any).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse),
    });

    render(<PickupSelection cart={mockCart} />);

    await waitFor(() =>
      expect(
        screen.getByText("1 tienda disponible")
      ).toBeInTheDocument()
    );

    // La tienda aparece
    expect(screen.getByText("Tienda Lima Centro")).toBeInTheDocument();
  });

  test("al seleccionar una tienda se ejecuta onSelectPickupInfo", async () => {
    const mockOnSelect = vi.fn();

    (useUserLocation as any).mockReturnValue({
      lat: -12.04,
      lng: -77.03,
      loading: false,
      error: null,
    });

    const mockResponse = {
      success: true,
      distancia_km: 2.2,
      almacen_origen: { id: 1, nombre: "Almacén Central" },
      recojo_tienda: {
        tipo_envio: "pickup",
        costo_envio: 0,
        tiempo_estimado_dias: 1,
        fecha_entrega_estimada: "2025-01-01",
        descripcion: "",
        disponible: true,
        mensaje: "",
        tiendas: [
          {
            id: 101,
            nombre: "Tienda Lima Centro",
            direccion: "Av. Siempre Viva 123",
            latitud: 0,
            longitud: 0,
            distancia_km: 1.3,
            imagen: null,
          },
        ],
      },
    };

    (fetch as any).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse),
    });

    render(<PickupSelection cart={mockCart} onSelectPickupInfo={mockOnSelect} />);

    await waitFor(() =>
      expect(screen.getByText("Tienda Lima Centro")).toBeInTheDocument()
    );

    fireEvent.click(screen.getByText("Tienda Lima Centro"));

    expect(mockOnSelect).toHaveBeenCalledWith({
      tienda: mockResponse.recojo_tienda.tiendas[0],
      almacenOrigen: mockResponse.almacen_origen,
      recojoInfo: mockResponse.recojo_tienda,
    });
  });
});
