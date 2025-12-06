import axios from "axios";

const CART_API_URL =
  import.meta.env.VITE_API_CART_CHECKOUT_URL || "http://localhost:8080";

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
  idCarrito: number;
}

export class CartService {
  private readonly baseUrl = `${CART_API_URL}/api/carritos`;
  private readonly CART_ID_KEY = "carritoId";

  private getCartId(): number | null {
    const value = localStorage.getItem(this.CART_ID_KEY);
    return value ? parseInt(value) : null;
  }

  private saveCartId(id: number) {
    localStorage.setItem(this.CART_ID_KEY, id.toString());
  }

  /**
   * Crea un carrito en backend
   */
  private async createCart(): Promise<number> {
    const response = await axios.post<CreateCartResponse>(this.baseUrl);
    const idCarrito = response.data.idCarrito;

    this.saveCartId(idCarrito);
    console.log("🛒 Carrito creado:", idCarrito);

    return idCarrito;
  }

  /**
   * Asigna usuario al carrito (si está autenticado)
   */
  private async assignUser(cartId: number, userId?: number) {
    if (!userId) return;

    try {
      await axios.post(
        `${this.baseUrl}/${cartId}/asignar-usuario?idUsuario=${userId}`,
      );
      console.log("👤 Carrito asignado al usuario:", userId);
    } catch (err) {
      console.warn("⚠ No se pudo asignar usuario al carrito:", err);
    }
  }

  /**
   * Obtiene un carrito existente, o crea uno nuevo si no existe
   */
  private async getOrCreateCartId(userId?: number): Promise<number> {
    let cartId = this.getCartId();

    if (!cartId) {
      cartId = await this.createCart();
      await this.assignUser(cartId, userId);
    }

    return cartId;
  }

  /**
   * Agregar un item al carrito
   * @param productId ID del producto
   * @param variantId ID de la variante
   * @param quantity Cantidad a agregar
   */
  async addToCart(
    productId: number,
    variantId: number,
    quantity: number = 1,
    userId?: number,
  ): Promise<AddToCartResponse> {
    try {
      const cartId = await this.getOrCreateCartId(userId);

      const request: AddToCartRequest = {
        idProducto: productId,
        idVariante: variantId,
        cantidad: quantity,
      };

      console.log("🛒 Agregando al carrito:", request);

      const response = await axios.post<AddToCartResponse>(
        `${this.baseUrl}/${cartId}/anonimo/items`,
        request,
      );

      console.log("✅ Respuesta del carrito:", response.data);
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
}
