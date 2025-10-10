import { useState } from 'react';
import { RatingSummary } from './RatingSummary';
import { CommentBox } from './CommentBox';
import { ReviewCard } from './ReviewCard';
import { RatingModal } from './RatingModal';

interface Review {
  id: string;
  title: string;
  author: string;
  rating: number;
  content: string;
  date: string;
}

interface ProductReviewsProps {
  productId: number;
}

export const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Datos mock para las calificaciones
  const ratingData = {
    averageRating: 4.5,
    totalReviews: 555,
    ratingDistribution: {
      5: 20,
      4: 3,
      3: 3,
      2: 10,
      1: 5
    }
  };

  // Datos mock para los comentarios
  const reviews: Review[] = [
    {
      id: '1',
      title: 'Esta bueno',
      author: 'Juan Rodriguez',
      rating: 5,
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse non vehicula lectus. Morbi et rutrum neque. Suspendisse blandit blandit aliquam. Integer maximus nibh porttitor, euismod velit quis, laoreet nunc.',
      date: '2024-01-15'
    },
    {
      id: '2',
      title: 'El producto no cumplió con lo acordado',
      author: 'Juan Rodriguez',
      rating: 1,
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse non vehicula lectus. Morbi et rutrum neque. Suspendisse blandit blandit aliquam. Integer maximus nibh porttitor, euismod velit quis, laoreet nunc.',
      date: '2024-01-10'
    }
  ];

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitReview = (rating: number, title: string, comment: string) => {
    // TODO: Implementar lógica para enviar el comentario
    console.log('Enviando comentario:', { rating, title, comment, productId });
  };

  return (
    <div className="space-y-8">
      {/* Rating Summary and Comment Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RatingSummary
            averageRating={ratingData.averageRating}
            totalReviews={ratingData.totalReviews}
            ratingDistribution={ratingData.ratingDistribution}
          />
        </div>
        <div className="lg:col-span-1">
          <CommentBox onOpenModal={handleOpenModal} />
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900">Comentarios de usuarios</h3>
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
};
