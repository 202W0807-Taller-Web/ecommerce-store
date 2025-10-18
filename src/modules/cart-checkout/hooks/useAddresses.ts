import { useState, useEffect, useCallback } from "react";

export type Address = {
  id: number;
  direccionLinea1: string;
  direccionLinea2?: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  pais: string;
  principal: boolean;
};

export type AddressForm = Omit<Address, "id">;

export function useAddresses(apiUrl: string, idUsuarioEnvio: number | null) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    if (!idUsuarioEnvio) return;
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/usuario/${idUsuarioEnvio}/direcciones`);
      if (!res.ok) throw new Error("Error al obtener direcciones");
      const data = await res.json();
      setAddresses(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, idUsuarioEnvio]);

  const createAddress = useCallback(
    async (newAddress: AddressForm) => {
      if (!idUsuarioEnvio) return;
      const tempId = Date.now();
      const optimistic = { id: tempId, ...newAddress };

      setAddresses((prev) => [...prev, optimistic]);

      try {
        const res = await fetch(`${apiUrl}/usuario/${idUsuarioEnvio}/direcciones`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newAddress),
        });

        if (!res.ok) throw new Error("Error al crear dirección");
        const data = await res.json();

        setAddresses((prev) =>
          prev.map((a) => (a.id === tempId ? data : a))
        );
      } catch (err) {
        setError((err as Error).message);
        setAddresses((prev) => prev.filter((a) => a.id !== tempId));
      }
    },
    [apiUrl, idUsuarioEnvio]
  );

  const updateAddress = useCallback(
    async (id: number, updated: Partial<AddressForm>) => {
      const old = addresses.find((a) => a.id === id);
      if (!old) return;

      setAddresses((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...updated } : a))
      );

      try {
        const res = await fetch(`${apiUrl}/direcciones/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });

        if (!res.ok) throw new Error("Error al actualizar dirección");
        const data = await res.json();

        setAddresses((prev) =>
          prev.map((a) => (a.id === id ? data : a))
        );
      } catch (err) {
        setError((err as Error).message);
        setAddresses((prev) =>
          prev.map((a) => (a.id === id ? old : a))
        );
      }
    },
    [apiUrl, addresses]
  );

  const deleteAddress = useCallback(
    async (id: number) => {
      const old = addresses;
      setAddresses((prev) => prev.filter((a) => a.id !== id));

      try {
        const res = await fetch(`${apiUrl}/direcciones/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Error al eliminar dirección");
      } catch (err) {
        setError((err as Error).message);
        setAddresses(old);
      }
    },
    [apiUrl, addresses]
  );

  const markAsPrimary = useCallback(
    async (id: number) => {
      const old = addresses;
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, principal: a.id === id }))
      );

      try {
        const res = await fetch(
          `${apiUrl}/usuario/${idUsuarioEnvio}/direcciones/${id}/principal`,
          { method: "PATCH" }
        );
        if (!res.ok) throw new Error("Error al marcar como principal");
      } catch (err) {
        setError((err as Error).message);
        setAddresses(old);
      }
    },
    [apiUrl, idUsuarioEnvio, addresses]
  );

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
    markAsPrimary,
  };
}
