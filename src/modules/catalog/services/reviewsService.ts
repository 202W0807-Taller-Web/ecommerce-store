import axios from 'axios';

const API_URL = import.meta.env.VITE_REVIEWS_API_URL;

export interface CreateReviewDTO {
  id_detalle_orden: number;
  comentario: string;
  calificacion: number;
  fecha_resena: string;
  id_usuario: number;
  nombre_usuario: string;
}

export interface UpdateReviewDTO {
  comentario?: string;
  calificacion?: number;
}

export const reviewsService = {
  // GET - Obtener reseñas de un producto
  getProductReviews: async (productId: number) => {
    const response = await axios.get(`${API_URL}/api/productos/${productId}/reseñas`);
    return response.data;
  },

  // POST - Crear una nueva reseña
  createReview: async (reviewData: CreateReviewDTO) => {
    const response = await axios.post(`${API_URL}/api/resenas`, reviewData);
    return response.data;
  },

  // PATCH - Actualizar una reseña
  updateReview: async (reviewId: number, reviewData: UpdateReviewDTO) => {
    const response = await axios.patch(`${API_URL}/api/resenas/${reviewId}`, reviewData);
    return response.data;
  },

  // DELETE - Eliminar una reseña
  deleteReview: async (reviewId: number) => {
    const response = await axios.delete(`${API_URL}/api/resenas/${reviewId}`);
    return response.data;
  },
};