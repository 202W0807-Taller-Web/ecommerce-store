interface RatingSummaryProps {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export const RatingSummary = ({ 
  averageRating, 
  totalReviews, 
  ratingDistribution 
}: RatingSummaryProps) => {
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${
          index < Math.floor(rating) ? 'text-primary' : 'text-gray-300'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const getBarWidth = (count: number) => {
    const maxCount = Math.max(...Object.values(ratingDistribution));
    return (count / maxCount) * 100;
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Calificación general</h2>
      
      <div className="flex items-start space-x-8">
        {/* Left side - Rating summary */}
        <div className="flex-shrink-0">
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex items-center space-x-1 mb-2">
            {renderStars(averageRating)}
          </div>
          <div className="text-sm text-gray-600">
            {totalReviews} comentarios
          </div>
        </div>

        {/* Right side - Rating distribution */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 w-8">{stars}★</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${getBarWidth(ratingDistribution[stars as keyof typeof ratingDistribution])}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8 text-right">
                {ratingDistribution[stars as keyof typeof ratingDistribution]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Report button */}
      <div className="mt-6">
        <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">Reportar producto</span>
        </button>
      </div>
    </div>
  );
};


