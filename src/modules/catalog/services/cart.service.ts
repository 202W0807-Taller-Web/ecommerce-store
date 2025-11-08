import axios from 'axios';

const CART_API_URL = import.meta.env.VITE_API_CART_CHECKOUT_URL || 'http://localhost:8080';

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

export class CartService {
  private readonly baseUrl = `${CART_API_URL}/api/carritos/7/anonimo/items`;

  /**
   * Agregar un item al carrito
   * @param productId ID del producto
   * @param variantId ID de la variante
   * @param quantity Cantidad a agregar
   */
  async addToCart(
    productId: number,
    variantId: number,
    quantity: number = 1
  ): Promise<AddToCartResponse> {
    try {
      const request: AddToCartRequest = {
        idProducto: productId,
        idVariante: variantId,
        cantidad: quantity
      };

      console.log('🛒 Agregando al carrito:', request);
      
      const response = await axios.post<AddToCartResponse>(this.baseUrl, request);
      
      console.log('✅ Respuesta del carrito:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error al agregar al carrito:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 
          'Error al agregar el producto al carrito'
        );
      }
      throw new Error('Error desconocido al agregar al carrito');
    }
  }
}