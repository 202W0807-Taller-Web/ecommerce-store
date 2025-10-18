import { useState, useEffect, useCallback } from "react";

export type ShippingUser = {
  id: number;
  idUsuario: number;
  email: string;
  nombreCompleto: string;
  telefono: string;
};

export type ShippingUserForm = Omit<ShippingUser, "id">;

export function useShippingUser(apiUrl: string, idUsuario: number) {
  const [user, setUser] = useState<ShippingUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (!idUsuario) return;
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/usuario/${idUsuario}`);
      if (res.status === 404) {
        setUser(null);
        return;
      }
      if (!res.ok) throw new Error("Error al obtener usuario de envío");
      const data = await res.json();
      setUser(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, idUsuario]);

  const createUser = useCallback(
    async (newUser: ShippingUserForm) => {
      try {
        const res = await fetch(`${apiUrl}/usuario`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        });
        if (!res.ok) throw new Error("Error al crear usuario de envío");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError((err as Error).message);
      }
    },
    [apiUrl]
  );

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading, error, fetchUser, createUser };
}
