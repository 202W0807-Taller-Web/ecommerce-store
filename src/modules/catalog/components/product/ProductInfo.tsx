import { useState } from "react";
import { type ProductWithUI, type Variante } from "../../types";
import { VariantSelector } from "./VariantSelector";

interface ProductInfoProps {
  product: ProductWithUI;
  onAddToCart: (quantity: number, variant?: Variante) => void;
  onVariantChange?: (variant: Variante | null) => void;
  onColorChange?: (color: string | null) => void;
  // Datos hardcodeados que se pasan como parámetros
  mockRating?: number;
  mockReviewCount?: number;
}

export const ProductInfo = ({
  product,
  onAddToCart,
  onVariantChange,
  onColorChange,
  mockReviewCount,
}: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<Variante | null>(null);

  // Función para manejar cambios de variante
  const handleVariantChange = (variant: Variante | null) => {
    setSelectedVariant(variant);
    if (onVariantChange) {
      onVariantChange(variant);
    }
  };

  // Función para manejar cambios de color
  const handleColorChange = (color: string | null) => {
    console.log('🎨 ProductInfo - Color seleccionado:', color);
    
    // Pasar el color al componente padre
    if (onColorChange) {
      onColorChange(color);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      console.log(
        "⚠️ ProductInfo - No se puede agregar al carrito sin variante seleccionada"
      );
      return;
    }

    console.log("🔄 ProductInfo - Enviando al carrito:");
    console.log("📊 Estado actual:", {
      quantity,
      selectedVariant: {
        id: selectedVariant.id,
        sku: selectedVariant.sku,
        precio: selectedVariant.precio,
        stock: selectedVariant.stock,
      },
      displayPrice,
    });

    onAddToCart(quantity, selectedVariant);
  };

  // Calcular precio a mostrar (variante seleccionada o precio base)
  const displayPrice = selectedVariant
    ? selectedVariant.precio
    : product.precioMinimo;

  return (
    <div className="space-y-4">
      {/* Nombre del Producto */}
      <div className="flex flex-row items-center gap-2">
        {product.idPromocion && (
          <div className=" items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Promo
          </div>
        )}
        <h1 className="text-3xl font-bold text-gray-900">{product.nombre}</h1>
      </div>

      {/* Contador de Ventas */}
      <div className="text-accent text-sm">
        {mockReviewCount || 0} vendidos
      </div>

      {/* Precio */}
      <div className="space-y-2">
        <div className="text-3xl font-bold text-gray-900">
          S/ {(displayPrice || 0).toFixed(2)}
        </div>
        {product.idPromocion && (
          <div className="text-lg text-gray-500 line-through">
            S/ {(displayPrice * 1.3).toFixed(2)}
          </div>
        )}
      </div>

      {/* Descripción */}
      <div>
        <p className="text-gray-600 leading-relaxed">{product.descripcion}</p>
      </div>

      {/* Selección de Variantes */}
      {product.variantes && product.variantes.length > 0 && (
        <VariantSelector
          variants={product.variantes}
          onVariantChange={handleVariantChange}
          onColorChange={handleColorChange}
          selectedVariant={selectedVariant}
        />
      )}

      {/* Quantity Selector */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">Cantidad:</label>
        <div className="flex items-center border border-gray-300 rounded">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-1 text-gray-600 hover:text-gray-800"
          >
            -
          </button>
          <span className="px-4 py-1 border-x border-gray-300">{quantity}</span>
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
          disabled={!selectedVariant}
          className={`flex-1 font-medium py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
            selectedVariant
              ? "bg-primary hover:bg-primary/90 text-white cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span>
            {selectedVariant ? "Añadir al carrito" : "Selecciona variante"}
          </span>
        </button>

        <button className="w-12 h-12 border-2 border-primary rounded-lg flex items-center justify-center hover:bg-primary/10">
          <svg
            className="w-6 h-6 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
