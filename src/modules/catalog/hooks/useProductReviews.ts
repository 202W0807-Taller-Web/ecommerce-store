import { useState, useEffect, useCallback } from 'react';
import { reviewsService, type UpdateReviewDTO, type CreateReviewDTO } from '../services/reviewsService'

interface ReviewResponse {
  id: number;
  id_detalle_orden: number;
  comentario: string;
  calificacion: number;
  fecha_resena: string;
  id_usuario: number;
  nombre_usuario: string;
}

export interface Review {
  id: string;
  order_id: number;
  user_id: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

interface RatingDistribution {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

export const useProductReviews = (productId: number) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState<RatingDistribution>({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  const calculateStatistics = useCallback((reviewsList: Review[]) => {
    if (reviewsList.length > 0) {
      const sum = reviewsList.reduce((acc, review) => acc + review.rating, 0);
      setAverageRating(sum / reviewsList.length);
    } else {
      setAverageRating(0);
    }

    const distribution: RatingDistribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    reviewsList.forEach((review) => {
      const roundedRating = Math.round(review.rating) as 1 | 2 | 3 | 4 | 5;
      distribution[roundedRating]++;
    });

    setRatingDistribution(distribution);
  }, []);

  const formatReviews = useCallback((data: ReviewResponse[]): Review[] => {
    return data.map((review) => ({
      id: review.id.toString(),
      order_id: review.id_detalle_orden,
      user_id: review.id_usuario,
      author: review.nombre_usuario,
      rating: review.calificacion,
      comment: review.comentario,
      date: review.fecha_resena,
    }));
  }, []);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await reviewsService.getProductReviews(productId);
      const formattedReviews = formatReviews(data);
      setReviews(formattedReviews);
      calculateStatistics(formattedReviews);
    } catch (err) {
      setError('Error al cargar las reseñas');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [productId, formatReviews, calculateStatistics]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const createReview = async (reviewData: CreateReviewDTO) => {
    try {
      setSubmitting(true);
      setError(null);
      await reviewsService.createReview(reviewData);
      await fetchReviews(); // Recargar las reseñas
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al crear la reseña';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  };

  const updateReview = async (reviewId: number, reviewData: UpdateReviewDTO) => {
    try {
      setSubmitting(true);
      setError(null);
      await reviewsService.updateReview(reviewId, reviewData);
      await fetchReviews(); // Recargar las reseñas
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al actualizar la reseña';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  };

  const deleteReview = async (reviewId: number) => {
    try {
      setSubmitting(true);
      setError(null);
      await reviewsService.deleteReview(reviewId);
      await fetchReviews(); // Recargar las reseñas
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al eliminar la reseña';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  };

  return {
    reviews,
    loading,
    error,
    averageRating,
    totalReviews: reviews.length,
    ratingDistribution,
    submitting,
    createReview,
    updateReview,
    deleteReview,
    refreshReviews: fetchReviews,
  };
};