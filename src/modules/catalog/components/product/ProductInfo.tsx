import { useState } from "react";
import { type FrontendProduct, type Variante } from "../../types";
import { VariantSelector } from "./VariantSelector";
import { useFavorites } from "../../hooks/useFavorites";

interface ProductInfoProps {
  product: FrontendProduct;
  onAddToCart: (quantity: number, variant?: Variante) => void;
  onVariantChange?: (variant: Variante | null) => void;
  onColorChange?: (colorId: number | null) => void;
  isAddingToCart?: boolean;
  onLoginRequired?: () => void;
  mockRating?: number;
  mockReviewCount?: number;
}

export const ProductInfo = ({
  product,
  onAddToCart,
  onVariantChange,
  onColorChange,
  mockReviewCount,
  isAddingToCart = false,
  onLoginRequired,
}: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<Variante | null>(null);
  const { toggleFavorite, isFavorite, isAuthenticated } = useFavorites();
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  
  const isFav = isFavorite(product.id);

  // Función para manejar cambios de variante
  const handleVariantChange = (variant: Variante | null) => {
    setSelectedVariant(variant);
    if (onVariantChange) {
      onVariantChange(variant);
    }
  };

  // Función para manejar cambios de color
  const handleColorChange = (colorId: number | null) => {
    if (onColorChange) {
      onColorChange(colorId);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      return;
    }

    onAddToCart(quantity, selectedVariant);
  };

  // Manejar click en favoritos
  const handleFavoriteClick = async () => {
    if (!isAuthenticated) {
      onLoginRequired?.();
      return;
    }

    setIsTogglingFavorite(true);
    try {
      await toggleFavorite(product.id);
    } finally {
      setIsTogglingFavorite(false);
    }
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
          <div className="items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
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
        />
      )}

      {/* Quantity Selector */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">Cantidad:</label>
        <div className="flex items-center border border-gray-300 rounded">
          <button
            data-testid="decrease-quantity-btn"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={isAddingToCart}
            className="px-3 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            -
          </button>
          <span className="px-4 py-1 border-x border-gray-300">{quantity}</span>
          <button
            data-testid="increase-quantity-btn"
            onClick={() => setQuantity(quantity + 1)}
            disabled={isAddingToCart}
            className="px-3 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          data-testid="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={!selectedVariant || isAddingToCart}
          className={`flex-1 font-medium py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
            selectedVariant && !isAddingToCart
              ? "bg-primary hover:bg-primary/90 text-white cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isAddingToCart ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Agregando...</span>
            </>
          ) : (
            <>
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
            </>
          )}
        </button>

        <button 
          onClick={handleFavoriteClick}
          disabled={isAddingToCart || isTogglingFavorite}
          className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            isFav 
              ? 'border-red-500 bg-red-50 hover:bg-red-100' 
              : 'border-primary hover:bg-primary/10'
          }`}
          aria-label={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          {isTogglingFavorite ? (
            <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg
              className={`w-6 h-6 transition-colors ${
                isFav ? 'text-red-500 fill-red-500' : 'text-primary'
              }`}
              fill={isFav ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};
