import { type Product } from '../../types';

interface PromotionBannerProps {
  product: Product;
  className?: string;
}

export const PromotionBanner = ({ product, className = "" }: PromotionBannerProps) => {
  if (!product.isPromo || !product.promotionId) {
    return null;
  }

  return (
    <div className={`bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-lg ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">¡Oferta Especial!</h3>
          <p className="text-sm opacity-90">
            Este producto está en promoción. ¡Aprovecha el descuento!
          </p>
        </div>
        {product.precioOriginal && (
          <div className="text-right">
            <div className="text-sm opacity-75">Antes:</div>
            <div className="text-lg line-through">
              S/ {product.precioOriginal.toFixed(2)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
