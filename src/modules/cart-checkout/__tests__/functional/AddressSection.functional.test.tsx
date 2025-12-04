import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock del hook
vi.mock("../../hooks/useAddresses", () => ({
  useAddresses: vi.fn(),
}));

import { useAddresses } from "../../hooks/useAddresses";
import ShippingForm from "../../components/shippingForm";

describe("ShippingForm", () => {
  const mockOnSelect = vi.fn();

  const mockAddresses = [
    {
      id: 1,
      direccionLinea1: "Calle Falsa 123",
      direccionLinea2: "",
      ciudad: "Lima",
      provincia: "Lima",
      pais: "Perú",
      codigoPostal: "15001",
      principal: true,
    },
    {
      id: 2,
      direccionLinea1: "Av. Siempre Viva 742",
      direccionLinea2: "Depto 3",
      ciudad: "Arequipa",
      provincia: "Arequipa",
      pais: "Perú",
      codigoPostal: "04001",
      principal: false,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    (useAddresses as any).mockReturnValue({
      addresses: mockAddresses,
      loading: false,
      createAddress: vi.fn(),
      updateAddress: vi.fn(),
      deleteAddress: vi.fn(),
      markAsPrimary: vi.fn(),
    });
  });

  // ----------------------------------------------------------
  it("muestra lista de direcciones", () => {
    render(<ShippingForm />);

    expect(screen.getByText("Calle Falsa 123")).toBeInTheDocument();
    expect(screen.getByText("Av. Siempre Viva 742")).toBeInTheDocument();
  });

  // ----------------------------------------------------------
  it("llama a onSelectAddress cuando seleccionas una dirección", async () => {
    const user = userEvent.setup();
    render(<ShippingForm onSelectAddress={mockOnSelect} />);

    await user.click(screen.getByText("Calle Falsa 123"));

    expect(mockOnSelect).toHaveBeenCalledWith(mockAddresses[0]);
  });

  // ----------------------------------------------------------
  it("abre y cierra el modal al agregar una nueva dirección", async () => {
    const user = userEvent.setup();
    render(<ShippingForm />);

    await user.click(screen.getByText("+ Agregar nueva dirección"));

    expect(screen.getByText("Nueva dirección")).toBeInTheDocument();

    await user.click(screen.getByLabelText("Cerrar"));

    expect(screen.queryByText("Nueva dirección")).not.toBeInTheDocument();
  });

  // ----------------------------------------------------------
  it("permite editar una dirección con datos precargados", async () => {
    const user = userEvent.setup();
    render(<ShippingForm />);

    await user.click(screen.getAllByText("Editar")[0]);

    expect(screen.getByText("Editar dirección")).toBeInTheDocument();

    const input = screen.getByPlaceholderText("Dirección (línea 1)");
    expect(input).toHaveValue("Calle Falsa 123");
  });

  // ----------------------------------------------------------
  it("llama a createAddress al guardar una nueva dirección", async () => {
    const user = userEvent.setup();
    const createMock = vi.fn();

    (useAddresses as any).mockReturnValue({
      addresses: [],
      loading: false,
      createAddress: createMock,
      updateAddress: vi.fn(),
      deleteAddress: vi.fn(),
      markAsPrimary: vi.fn(),
    });

    render(<ShippingForm />);

    await user.click(screen.getByText("+ Agregar nueva dirección"));

    await user.type(
      screen.getByPlaceholderText("Dirección (línea 1)"),
      "Nueva dirección"
    );
    await user.type(screen.getByPlaceholderText("Ciudad"), "Cusco");

    await user.click(screen.getByText("Guardar"));

    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        direccionLinea1: "Nueva dirección",
        ciudad: "Cusco",
      })
    );
  });

  // ----------------------------------------------------------
  it("llama a updateAddress al modificar una dirección existente", async () => {
    const user = userEvent.setup();
    const updateMock = vi.fn();

    (useAddresses as any).mockReturnValue({
      addresses: mockAddresses,
      loading: false,
      createAddress: vi.fn(),
      updateAddress: updateMock,
      deleteAddress: vi.fn(),
      markAsPrimary: vi.fn(),
    });

    render(<ShippingForm />);

    await user.click(screen.getAllByText("Editar")[0]);

    const input = screen.getByPlaceholderText("Dirección (línea 1)");

    await user.clear(input);
    await user.type(input, "Dirección Modificada");

    await user.click(screen.getByText("Guardar"));

    expect(updateMock).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        direccionLinea1: "Dirección Modificada",
      })
    );
  });

  // ----------------------------------------------------------
  it("llama a markAsPrimary cuando se marca como principal una dirección NO principal", async () => {
    const user = userEvent.setup();
    const markMock = vi.fn();

    (useAddresses as any).mockReturnValue({
      addresses: mockAddresses,
      loading: false,
      createAddress: vi.fn(),
      updateAddress: vi.fn(),
      deleteAddress: vi.fn(),
      markAsPrimary: markMock,
    });

    render(<ShippingForm />);

    // El botón "Marcar como principal" aparece SOLO en direcciones NO principales
    const nonPrimaryButton = screen.getAllByText("Marcar como principal")[0];

    await user.click(nonPrimaryButton);

    expect(markMock).toHaveBeenCalledWith(2);
  });

  // ----------------------------------------------------------
  it("llama a deleteAddress cuando se elimina una dirección", async () => {
    const user = userEvent.setup();
    const deleteMock = vi.fn();

    (useAddresses as any).mockReturnValue({
      addresses: mockAddresses,
      loading: false,
      createAddress: vi.fn(),
      updateAddress: vi.fn(),
      deleteAddress: deleteMock,
      markAsPrimary: vi.fn(),
    });

    render(<ShippingForm />);

    await user.click(screen.getAllByText("Eliminar")[0]);

    expect(deleteMock).toHaveBeenCalledWith(1);
  });
});
