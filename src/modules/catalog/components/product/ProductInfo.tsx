import { useState } from 'react';
import { type Product, type ProductoVariante } from '../../types';
import { VariantSelector } from './VariantSelector';
import { PromotionBanner } from './PromotionBanner';

interface ProductInfoProps {
  product: Product;
  onAddToCart: (quantity: number, variant?: ProductoVariante) => void;
}

export const ProductInfo = ({ product, onAddToCart }: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductoVariante | null>(null);

  const handleAddToCart = () => {
    onAddToCart(quantity, selectedVariant || undefined);
  };

  // Calcular precio a mostrar (variante seleccionada o precio base)
  const displayPrice = selectedVariant ? selectedVariant.precio : product.precio;

  return (
    <div className="space-y-6">
      {/* Nombre del Producto */}
      <h1 className="text-3xl font-bold text-gray-900">{product.nombre}</h1>
      
      {/* Contador de Ventas */}
      <div className="text-orange-500 text-sm">
        {product.reviewCount} vendidos
      </div>

      {/* Precio */}
      <div className="space-y-2">
        <div className="text-3xl font-bold text-gray-900">
          S/ {displayPrice.toFixed(2)}
        </div>
        {product.precioOriginal && (
          <div className="text-lg text-gray-500 line-through">
            S/ {product.precioOriginal.toFixed(2)}
          </div>
        )}
        {product.isPromo && (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
            🎉 En Promoción
          </div>
        )}
      </div>

      {/* Descripción */}
      <div>
        <p className="text-gray-600 leading-relaxed">
          {product.descripcion}
        </p>
      </div>

      {/* Promotion Banner */}
      <PromotionBanner product={product} />

      {/* Selección de Variantes */}
      {product.variantes && product.variantes.length > 0 && (
        <VariantSelector
          variants={product.variantes}
          onVariantChange={setSelectedVariant}
          selectedVariant={selectedVariant}
        />
      )}

      {/* Quantity Selector */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">
          Cantidad:
        </label>
        <div className="flex items-center border border-gray-300 rounded">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-1 text-gray-600 hover:text-gray-800"
          >
            -
          </button>
          <span className="px-4 py-1 border-x border-gray-300">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-1 text-gray-600 hover:text-gray-800"
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Añadir al carrito</span>
        </button>
        
        <button className="w-12 h-12 border-2 border-primary rounded-lg flex items-center justify-center hover:bg-primary/10">
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
};
