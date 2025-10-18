import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProductDetail } from "../hooks/useProductDetail";
import { type Variante } from "../types";
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
  const [selectedVariant, setSelectedVariant] = useState<Variante | null>(null);
  const [selectedColor, setSelectedColor] = useState<number | null>(null);

  const generateMockData = (productId: number) => {
    const mockRating = 4.2 + (productId % 3) * 0.2; 
    const mockReviewCount = 120 + (productId * 15); 
    
    return { mockRating, mockReviewCount };
  };

  const { mockRating, mockReviewCount } = product ? generateMockData(product.id) : { mockRating: 4.5, mockReviewCount: 150 };

  const handleColorChange = (colorId: number | null) => {
    setSelectedColor(colorId);
  };

  useEffect(() => {
    if (id) {
      fetchProductDetail(Number(id));
    }
  }, [id, fetchProductDetail]);


  const handleAddToCart = (quantity: number, variant?: Variante) => {
    // TODO: Implementar lógica de carrito
    // Producto agregado al carrito
    console.log('Agregando al carrito:', { quantity, variant: variant?.id });
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
    return <ProductDetailError error="Este producto no tiene variantes disponibles" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb productName={product.nombre} />

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
        />
      </div>

      {/* Reviews del Producto */}
      <div className="mb-16">
        <ProductReviews productId={product.id} />
      </div>

    </div>
  );
};

export default ProductDetailPage;