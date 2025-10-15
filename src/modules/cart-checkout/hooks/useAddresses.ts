import { useState, useEffect, useCallback } from "react";

export type Address = {
  id: number;
  direccion: string;
  distrito: string;
  provincia: string;
  codigoPostal: string;
  pais: string;
  referencia?: string;
  principal: boolean;
};

export type AddressForm = Omit<Address, "id">;

export function useAddresses(apiUrl: string) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Obtener todas las direcciones
  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error("Error al obtener direcciones");
      const data = await res.json();
      setAddresses(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  // 🔹 Crear nueva dirección
  const createAddress = useCallback(
    async (newAddress: AddressForm) => {
      try {
        const res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newAddress),
        });
        if (!res.ok) throw new Error("Error al crear dirección");
        const data = await res.json();
        setAddresses((prev) => [...prev, data]);
      } catch (err) {
        setError((err as Error).message);
      }
    },
    [apiUrl]
  );

  // 🔹 Editar dirección existente
  const updateAddress = useCallback(
    async (id: number, updatedAddress: Partial<AddressForm>) => {
      try {
        const res = await fetch(`${apiUrl}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedAddress),
        });
        if (!res.ok) throw new Error("Error al actualizar dirección");
        const data = await res.json();
        setAddresses((prev) => prev.map((a) => (a.id === id ? data : a)));
      } catch (err) {
        setError((err as Error).message);
      }
    },
    [apiUrl]
  );

  // 🔹 Eliminar dirección
  const deleteAddress = useCallback(
    async (id: number) => {
      try {
        const res = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Error al eliminar dirección");
        setAddresses((prev) => prev.filter((a) => a.id !== id));
      } catch (err) {
        setError((err as Error).message);
      }
    },
    [apiUrl]
  );

  // Cargar direcciones al montar el hook
  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  return {
    addresses,
    loading,
    error,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
  };
}
