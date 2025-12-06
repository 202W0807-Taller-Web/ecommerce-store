import axios from "axios";

const CART_API_URL =
  import.meta.env.VITE_API_CART_CHECKOUT_URL || "http://localhost:8080";
const CART_ID_KEY = "carritoId";

interface AddToCartRequest {
  idProducto: number;
  idVariante: number;
  cantidad: number;
}

interface AddToCartResponse {
  id: number;
  idProducto: number;
  idVariante: number;
  cantidad: number;
  precio: number;
  subtotal: number;
}

interface CreateCartResponse {
  id: number;
  // otros campos que devuelva tu backend
}

export class CartService {
  private baseUrl = `${CART_API_URL}/api/carritos`;

  /**
   * Obtiene o crea un carrito según el estado del usuario
   * @param userId - ID del usuario si está autenticado (opcional)
   */
  async getOrCreateCart(userId?: number): Promise<number> {
    // 1. Verificar si ya existe un carritoId en localStorage
    let carritoId = localStorage.getItem(CART_ID_KEY);

    if (carritoId) {
      return parseInt(carritoId);
    }

    // 2. No hay carrito, crear uno nuevo
    try {
      // Crear carrito
      const response = await axios.post<CreateCartResponse>(`${this.baseUrl}`);
      carritoId = response.data.id.toString();
      localStorage.setItem(CART_ID_KEY, carritoId);

      // Si hay usuario autenticado, asignar inmediatamente
      if (userId) {
        await this.assignUserToCart(parseInt(carritoId), userId);
      }

      console.log("✅ Carrito creado:", carritoId);
      return parseInt(carritoId);
    } catch (error) {
      console.error("❌ Error al crear carrito:", error);
      throw new Error("No se pudo crear el carrito");
    }
  }

  /**
   * Asigna un usuario a un carrito
   */
  async assignUserToCart(carritoId: number, userId: number): Promise<void> {
    if (!userId) return;

    try {
      await axios.post(
        `${this.baseUrl}/${carritoId}/asignar-usuario?idUsuario=${userId}`,
      );
      console.log("👤 Carrito asignado al usuario:", userId);
    } catch (err) {
      console.warn("⚠ No se pudo asignar usuario al carrito:", err);
    }
  }

  /**
   * Agregar un item al carrito
   * @param userId - ID del usuario si está autenticado (opcional)
   */
  async addToCart(
    productId: number,
    variantId: number,
    quantity: number = 1,
    userId?: number,
  ): Promise<AddToCartResponse> {
    try {
      // Obtener o crear carrito
      const carritoId = await this.getOrCreateCart(userId);

      const request: AddToCartRequest = {
        idProducto: productId,
        idVariante: variantId,
        cantidad: quantity,
      };

      console.log("🛒 Agregando al carrito:", request);

      const url = `${this.baseUrl}/${carritoId}/anonimo/items`;
      const response = await axios.post<AddToCartResponse>(url, request);

      console.log("✅ Producto agregado:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al agregar al carrito:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            "Error al agregar el producto al carrito",
        );
      }
      throw new Error("Error desconocido al agregar al carrito");
    }
  }

  /**
   * Maneja el login del usuario
   * Asigna el carrito anónimo al usuario o recupera su carrito existente
   */
  async handleLogin(userId: number): Promise<void> {
    try {
      const carritoTemporal = localStorage.getItem(CART_ID_KEY);

      if (carritoTemporal) {
        // Hay carrito anónimo, asignarlo al usuario
        await this.assignUserToCart(parseInt(carritoTemporal), userId);
        console.log("✅ Carrito anónimo asignado al usuario");
      } else {
        // No hay carrito local, verificar si el usuario tiene uno en el backend
        try {
          const response = await axios.get(`${this.baseUrl}/user/${userId}`);
          if (response.data?.id) {
            localStorage.setItem(CART_ID_KEY, response.data.id.toString());
            console.log("✅ Carrito del usuario recuperado");
          }
        } catch (error) {
          // Usuario no tiene carrito previo, se creará cuando agregue un producto
          console.log("ℹ️ Usuario sin carrito previo");
        }
      }
    } catch (error) {
      console.error("❌ Error en handleLogin:", error);
      throw error;
    }
  }

  /**
   * Maneja el logout del usuario
   */
  handleLogout(): void {
    localStorage.removeItem(CART_ID_KEY);
    console.log("✅ Sesión de carrito limpiada");
  }

  /**
   * Recupera el carrito al iniciar la app (si el usuario está autenticado)
   */
  async initializeCart(userId?: number): Promise<void> {
    const carritoId = localStorage.getItem(CART_ID_KEY);

    if (userId && !carritoId) {
      // Usuario autenticado pero sin carritoId local, intentar recuperar
      try {
        const response = await axios.get(`${this.baseUrl}/user/${userId}`);
        if (response.data?.id) {
          localStorage.setItem(CART_ID_KEY, response.data.id.toString());
          console.log("✅ Carrito recuperado al inicializar");
        }
      } catch (error) {
        console.log("ℹ️ Usuario sin carrito previo");
      }
    }
  }

  /**
   * Obtiene el ID del carrito actual (si existe)
   */
  getCurrentCartId(): number | null {
    const carritoId = localStorage.getItem(CART_ID_KEY);
    return carritoId ? parseInt(carritoId) : null;
  }
}
