import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProductDetail } from "../hooks/useProductDetail";
import { useCart } from "../hooks/useCart";
import { type Variante } from "../types";
import { RegisterModal } from "../../client-auth/components/RegisterModal";
import {
  ProductGallery,
  ProductInfo,
  Breadcrumb,
  ProductDetailError,
  ProductDetailLoading,
  ProductReviews,
} from "../components";

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error, fetchProductDetail } = useProductDetail();
  const {
    adding,
    error: cartError,
    success,
    addToCart,
    clearError,
  } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<Variante | null>(null);
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const generateMockData = (productId: number) => {
    const mockRating = 4.2 + (productId % 3) * 0.2;
    const mockReviewCount = 120 + productId * 15;

    return { mockRating, mockReviewCount };
  };

  const { mockRating, mockReviewCount } = product
    ? generateMockData(product.id)
    : { mockRating: 4.5, mockReviewCount: 150 };

  const handleColorChange = (colorId: number | null) => {
    setSelectedColor(colorId);
  };

  const handleLoginRequired = () => {
    setShowRegisterModal(true);
  };

  useEffect(() => {
    if (id) {
      fetchProductDetail(Number(id));
    }
  }, [id, fetchProductDetail]);

  const handleAddToCart = async (quantity: number, variant?: Variante) => {
    if (!variant || !product) {
      console.error(
        "No se puede agregar al carrito: falta variante o producto",
      );
      return;
    }

    await addToCart(product.id, variant.id, quantity);
  };

  // Estados de carga y error
  if (loading) {
    return <ProductDetailLoading />;
  }

  if (error) {
    return <ProductDetailError error={error} />;
  }

  if (!product) {
    return <ProductDetailError productNotFound />;
  }

  // No renderizar si el producto no tiene variantes
  if (!product.variantes || product.variantes.length === 0) {
    return (
      <ProductDetailError error="Este producto no tiene variantes disponibles" />
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb productName={product.nombre} />

        {/* Mensajes de feedback del carrito */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-green-800">
              ¡Producto agregado al carrito exitosamente!
            </span>
          </div>
        )}

        {cartError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <svg
              className="w-5 h-5 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span className="text-red-800">{cartError}</span>
            <button
              onClick={clearError}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ✕
            </button>
          </div>
        )}

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <ProductGallery
            product={product}
            selectedVariant={selectedVariant}
            selectedColor={selectedColor}
          />
          <ProductInfo
            product={product}
            onAddToCart={handleAddToCart}
            onVariantChange={setSelectedVariant}
            onColorChange={handleColorChange}
            mockRating={mockRating}
            mockReviewCount={mockReviewCount}
            isAddingToCart={adding}
            onLoginRequired={handleLoginRequired}
          />
        </div>

        {/* Reviews del Producto */}
        <div className="mb-16">
          <ProductReviews productId={product.id} />
        </div>
      </div>

      {/* Modal de registro */}
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      />
    </>
  );
};

export default ProductDetailPage;
