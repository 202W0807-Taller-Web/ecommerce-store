import { useState } from 'react';
import { RatingSummary } from './RatingSummary';
import { ReviewCard } from './ReviewCard';
import { useProductReviews } from '../../hooks/useProductReviews';


interface ProductReviewsProps {
  productId: number;
}

const REVIEWS_PER_PAGE = 5;

export const ProductReviews = ({ productId }: ProductReviewsProps) => {

  const [currentPage, setCurrentPage] = useState(1);
  
  const { 
    reviews, 
    loading, 
    error, 
    averageRating, 
    totalReviews, 
    ratingDistribution 
  } = useProductReviews(productId);

  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const endIndex = startIndex + REVIEWS_PER_PAGE;
  const currentReviews = reviews.slice(startIndex, endIndex);

  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Rating Summary and Comment Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RatingSummary
            averageRating={averageRating}
            totalReviews={totalReviews}
            ratingDistribution={ratingDistribution}
          />
        </div>
        {/* <div className="lg:col-span-1">
          <CommentBox onOpenModal={handleOpenModal} />
        </div> */}
      </div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Comentarios de usuarios</h3>
          <div className="space-y-4">
            {currentReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Anterior
              </button>

              <div className="flex space-x-1">
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-primary text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">Aún no hay comentarios para este producto.</p>
        </div>
      )}

      {/* Rating Modal */}
      {/* <RatingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitReview}
      /> */}
    </div>
  );
};
