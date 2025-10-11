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
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const generateMockData = (productId: number) => {
    const mockRating = 4.2 + (productId % 3) * 0.2; 
    const mockReviewCount = 120 + (productId * 15); 
    
    return { mockRating, mockReviewCount };
  };

  const { mockRating, mockReviewCount } = product ? generateMockData(product.id) : { mockRating: 4.5, mockReviewCount: 150 };

  const handleColorChange = (color: string | null) => {
    setSelectedColor(color);
    console.log('🎨 ProductDetailPage - Color seleccionado:', color);
  };

  useEffect(() => {
    if (id) {
      fetchProductDetail(Number(id));
    }
  }, [id, fetchProductDetail]);


  const handleAddToCart = (quantity: number, variant?: Variante) => {
    // TODO: Implementar lógica de carrito
    console.log('Producto agregado:', {
      id: product?.id,
      nombre: product?.nombre,
      precioBase: product?.precioMinimo,
      precioMaximo: product?.precioMaximo
    });
    
    console.log('Cantidad:', quantity);
    
    if (variant) {
      console.log('Variante seleccionada:', {
        id: variant.id,
        sku: variant.sku,
        precio: variant.precio,
        stock: variant.stock,
        atributos: variant.varianteAtributos.map(attr => ({
          nombre: attr.atributoValor,
          valor: attr.atributoValor
        }))
      });
      console.log('💰 Precio total:', `S/ ${(variant.precio * quantity).toFixed(2)}`);
    } else {
      console.log('⚠️  Sin variante seleccionada - usando precio base');
      console.log('💰 Precio total:', `S/ ${((product?.precioMinimo || 0) * quantity).toFixed(2)}`);
    }
    
    console.log('✅ Producto agregado al carrito correctamente');
    console.log('---');
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