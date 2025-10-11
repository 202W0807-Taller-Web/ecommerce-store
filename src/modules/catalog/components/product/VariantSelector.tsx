import { useState, useMemo, useEffect } from 'react';
import { type Variante } from '../../types';
import { obtenerColorPorNombre } from '../../data/colors';

interface VariantSelectorProps {
  variants: Variante[];
  onVariantChange: (variant: Variante | null) => void;
  onColorChange?: (color: string | null) => void;
  selectedVariant: Variante | null;
}

export const VariantSelector = ({ variants, onVariantChange, onColorChange, selectedVariant }: VariantSelectorProps) => {
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

  // Obtener colores disponibles
  const availableColors = useMemo(() => {
    const colores = new Set<string>();
    variants.forEach(variant => {
      variant.varianteAtributos.forEach(atributo => {
        if (['Negro', 'Blanco', 'Azul', 'Rojo', 'Verde', 'Morado'].includes(atributo.atributoValor)) {
          colores.add(atributo.atributoValor);
        }
      });
    });
    return Array.from(colores);
  }, [variants]);

  // Obtener tallas disponibles para un color específico
  const getAvailableSizesForColor = useMemo(() => {
    return (color: string) => {
      const tallas = new Set<string>();
      variants.forEach(variant => {
        const hasColor = variant.varianteAtributos.some(attr => attr.atributoValor === color);
        if (hasColor) {
          variant.varianteAtributos.forEach(atributo => {
            if (['S', 'M', 'L', 'XL', 'XXL'].includes(atributo.atributoValor)) {
              tallas.add(atributo.atributoValor);
            }
          });
        }
      });
      return Array.from(tallas);
    };
  }, [variants]);

  // Encontrar la variante que coincide con los atributos seleccionados
  const matchingVariant = useMemo(() => {
    if (Object.keys(selectedAttributes).length < 2) {
      return null; // No se selecciona ninguna variante por defecto
    }

    return variants.find(variant => {
      // Verificar que coincida con color y talla seleccionados
      const hasSelectedColor = variant.varianteAtributos.some(atributo => 
        atributo.atributoValor === selectedAttributes['Color']
      );
      const hasSelectedSize = variant.varianteAtributos.some(atributo => 
        atributo.atributoValor === selectedAttributes['Talla']
      );
      return hasSelectedColor && hasSelectedSize;
    }) || null;
  }, [variants, selectedAttributes]);

  // No establecer selección por defecto - el usuario debe elegir

  // Actualizar la variante seleccionada cuando cambien los atributos
  useEffect(() => {
    if (matchingVariant) {
      console.log('🎨 VariantSelector - Variante encontrada:', {
        id: matchingVariant.id,
        sku: matchingVariant.sku,
        precio: matchingVariant.precio,
        stock: matchingVariant.stock,
        atributos: matchingVariant.varianteAtributos.map(attr => attr.atributoValor)
      });
    }
    onVariantChange(matchingVariant);

    // Limpiar color si no hay variante seleccionada
    if (!matchingVariant && onColorChange) {
      onColorChange(null);
    }
  }, [matchingVariant, onVariantChange, onColorChange]);

  const handleColorChange = (color: string) => {
    console.log('🎨 VariantSelector - Color seleccionado:', {
      color,
      currentAttributes: selectedAttributes
    });
    
    setSelectedAttributes({
      Color: color,
      Talla: '' // Limpiar talla cuando cambia el color
    });

    // Notificar al componente padre sobre el cambio de color
    if (onColorChange) {
      onColorChange(color);
    }
  };

  const handleSizeChange = (size: string) => {
    console.log('📏 VariantSelector - Talla seleccionada:', {
      size,
      currentAttributes: selectedAttributes
    });
    
    setSelectedAttributes(prev => ({
      Color: prev.Color,
      Talla: size
    }));
  };

  // Obtener tallas disponibles para el color seleccionado
  const availableSizes = selectedAttributes['Color'] 
    ? getAvailableSizesForColor(selectedAttributes['Color'])
    : [];

  if (variants.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Selector de Color - Primero */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Color: {selectedAttributes['Color'] ? (
            <span className="font-normal text-gray-600">{selectedAttributes['Color']}</span>
          ) : (
            <span className="font-normal text-gray-400">Selecciona un color</span>
          )}
        </h4>
        <div className="flex flex-wrap gap-2">
          {availableColors.map(color => {
            const isSelected = selectedAttributes['Color'] === color;
            const colorData = obtenerColorPorNombre(color);
            const hexColor = colorData?.hex || '#000000';
            
            return (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className={`
                  w-10 h-10 rounded-full border-2 transition-all duration-200
                  ${isSelected 
                    ? 'border-primary scale-110 shadow-lg ring-2 ring-primary/20' 
                    : 'border-gray-300 hover:border-gray-400 hover:scale-105'
                  }
                  cursor-pointer
                `}
                style={{ backgroundColor: hexColor }}
                title={color}
              />
            );
          })}
        </div>
      </div>

      {/* Selector de Talla - Segundo, solo visible si hay color seleccionado */}
      {selectedAttributes['Color'] && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Talla: {selectedAttributes['Talla'] ? (
              <span className="font-normal text-gray-600">{selectedAttributes['Talla']}</span>
            ) : (
              <span className="font-normal text-gray-400">Selecciona una talla</span>
            )}
          </h4>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map(size => {
              const isSelected = selectedAttributes['Talla'] === size;
              
              return (
                <button
                  key={size}
                  onClick={() => handleSizeChange(size)}
                  className={`
                    px-4 py-2 border-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isSelected 
                      ? 'border-primary bg-primary text-white' 
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }
                    cursor-pointer
                  `}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Información de la variante seleccionada */}
      {selectedVariant && (
        <div className="bg-gray-50 p-4 rounded-lg">
          {(selectedVariant.stock || 0) > 0 ? (
            <div className="flex items-center text-sm text-green-600">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              En stock ({selectedVariant.stock || 0} unidades)
            </div>
          ) : (
            <div className="flex items-center text-sm text-red-600">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              Agotado
            </div>
          )}
        </div>
      )}
    </div>
  );
};
