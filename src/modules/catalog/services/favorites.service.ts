import axios, { type AxiosResponse } from 'axios';
import type { FrontendProductSummary } from '../types';

interface FavoriteProductResponse {
  id: number; // ID del favorito
  productoId: number; // ID del producto
  nombreProducto: string;
  precioOriginal: number;
  precioFinal: number;
  porcentajeDescuento: number;
  imagenProducto: string;
  tienePromocion: boolean;
}

export class FavoritesService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.DEV 
      ? '' 
      : import.meta.env.VITE_CATALOG_API_URL || '';
  }

  private transformFavoriteProduct(apiProduct: FavoriteProductResponse): FrontendProductSummary {
    return {
      id: Number(apiProduct.productoId), // Asegurar que sea número
      nombre: apiProduct.nombreProducto,
      precio: Number(apiProduct.precioFinal),
      precioOriginal: apiProduct.tienePromocion ? Number(apiProduct.precioOriginal) : undefined,
      imagen: apiProduct.imagenProducto,
      tienePromocion: apiProduct.tienePromocion,
      rating: 0,
      reviewCount: 0,
      isPromo: apiProduct.tienePromocion
    };
  }

  async getFavorites(clienteId: number): Promise<FrontendProductSummary[]> {
    if (!import.meta.env.DEV && !this.baseUrl) {
      throw new Error('VITE_CATALOG_API_URL no está configurada.');
    }

    try {
      const url = import.meta.env.DEV 
        ? `/api/clientes/${clienteId}/favoritos`
        : `${this.baseUrl}/api/clientes/${clienteId}/favoritos`;
      
      const response: AxiosResponse<FavoriteProductResponse[]> = await axios.get(url);
      return response.data.map(product => this.transformFavoriteProduct(product));
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw new Error('No se pudieron cargar los favoritos.');
    }
  }

  async addFavorite(clienteId: number, productoId: number): Promise<void> {
    if (!import.meta.env.DEV && !this.baseUrl) {
      throw new Error('VITE_CATALOG_API_URL no está configurada.');
    }

    try {
      const url = import.meta.env.DEV 
        ? `/api/clientes/${clienteId}/favoritos`
        : `${this.baseUrl}/api/clientes/${clienteId}/favoritos`;
      
      await axios.post(url, { productoId: Number(productoId) });
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw new Error('No se pudo agregar el producto a favoritos.');
    }
  }

  async removeFavorite(clienteId: number, productoId: number): Promise<void> {
    if (!import.meta.env.DEV && !this.baseUrl) {
      throw new Error('VITE_CATALOG_API_URL no está configurada.');
    }

    try {
      const url = import.meta.env.DEV 
        ? `/api/clientes/${clienteId}/favoritos/${productoId}`
        : `${this.baseUrl}/api/clientes/${clienteId}/favoritos/${productoId}`;
      
      await axios.delete(url);
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw new Error('No se pudo quitar el producto de favoritos.');
    }
  }
}