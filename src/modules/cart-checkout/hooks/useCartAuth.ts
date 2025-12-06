import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../client-auth/context/AuthContext";

const CART_ID_KEY = "carritoId";

/**
 * Hook que maneja la sincronización entre autenticación y carrito
 * Debe ser usado en un componente de alto nivel (App.tsx o Layout)
 */
export function useCartAuth() {
  const baseUrl = import.meta.env.VITE_API_CART_CHECKOUT_URL + "/api/carritos";
  const auth = useContext(AuthContext);

  // Guardar el estado previo de autenticación
  const prevIsAuthRef = useRef<boolean>(false);

  useEffect(() => {
    if (!auth) return;

    const { isAuth, user } = auth;
    const wasAuth = prevIsAuthRef.current;

    // Detectar LOGIN (cambio de no autenticado a autenticado)
    if (isAuth && !wasAuth && user) {
      const userId = user.id;
      const carritoTemporal = localStorage.getItem(CART_ID_KEY);

      const handleLogin = async () => {
        try {
          if (carritoTemporal) {
            // Hay carrito anónimo, asignarlo al usuario
            await fetch(
              `${baseUrl}/${carritoTemporal}/asignar-usuario?idUsuario=${userId}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
              },
            );
            console.log("✅ Carrito anónimo asignado al usuario");
          } else {
            // No hay carrito local, verificar si el usuario tiene uno en el backend
            try {
              const response = await fetch(`${baseUrl}/usuario/${userId}`);
              if (response.ok) {
                const data = await response.json();
                if (data?.idCarrito) {
                  localStorage.setItem(CART_ID_KEY, data.idCarrito.toString());
                  console.log("✅ Carrito del usuario recuperado");
                }
              }
            } catch (error) {
              // Usuario no tiene carrito previo, se creará cuando agregue un producto
              console.log("ℹ️ Usuario sin carrito previo");
            }
          }
        } catch (error) {
          console.error("❌ Error al sincronizar carrito:", error);
        }
      };

      handleLogin();
    }

    // Detectar LOGOUT (cambio de autenticado a no autenticado)
    if (!isAuth && wasAuth) {
      console.log("🚪 Logout detectado, limpiando carrito local");
      localStorage.removeItem(CART_ID_KEY);
    }

    // Actualizar el estado previo
    prevIsAuthRef.current = isAuth;
  }, [auth?.isAuth, auth?.user?.id, baseUrl]);

  return null;
}
