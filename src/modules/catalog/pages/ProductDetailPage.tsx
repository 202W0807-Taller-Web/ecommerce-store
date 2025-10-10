import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProductDetail } from "../hooks/useProductDetail";
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


  useEffect(() => {
    if (id) {
      fetchProductDetail(Number(id));
    }
  }, [id, fetchProductDetail]);


  const handleAddToCart = (quantity: number) => {
    // TODO: Implementar lógica de carrito
    console.log(`Agregando ${quantity} unidades del producto ${product?.id} al carrito`);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb productName={product.nombre} />

      {/* Product Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <ProductGallery product={product} />
        <ProductInfo product={product} onAddToCart={handleAddToCart} />
      </div>

      {/* Reviews del Producto */}
      <div className="mb-16">
        <ProductReviews productId={product.id} />
      </div>

    </div>
  );
};

export default ProductDetailPage;