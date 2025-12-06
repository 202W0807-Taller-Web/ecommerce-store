import { useState, useMemo, useEffect } from 'react';
import { type Variante, type Atributo } from '../../types';
import { getColorHex } from '../../utils/colorMapper';
import { useAtributos } from '../../contexts';

interface VariantSelectorProps {
  variants: Variante[];
  onVariantChange: (variant: Variante | null) => void;
  onColorChange?: (colorId: number | null) => void;
}

export const VariantSelector = ({ variants, onVariantChange, onColorChange }: VariantSelectorProps) => {
  const { atributos, loading } = useAtributos();
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, number>>({});

  // Obtener atributos de color y talla desde el contexto
  const colorAttribute = useMemo(() => {
    return atributos.find(attr => attr.nombre.toLowerCase() === 'color');
  }, [atributos]);

  const sizeAttribute = useMemo(() => {
    return atributos.find(attr => attr.nombre.toLowerCase() === 'talla');
  }, [atributos]);

           // Obtener colores disponibles usando IDs
           const availableColors = useMemo(() => {
             if (!colorAttribute || loading) return [];
    
    const coloresDisponibles = new Set<number>();
    variants.forEach(variant => {
      variant.varianteAtributos.forEach(varianteAttr => {
        // Buscar el atributo de color por su atributoValorId
        const colorValue = colorAttribute.atributoValores.find(valor => 
          valor.id === varianteAttr.atributoValorId
        );
        if (colorValue) {
          coloresDisponibles.add(colorValue.id);
        }
      });
    });
    return Array.from(coloresDisponibles);
           }, [variants, colorAttribute, loading]);

  // Obtener tallas disponibles para un color específico usando IDs
  const getAvailableSizesForColor = useMemo(() => {
    return (colorId: number) => {
      if (!sizeAttribute || !colorAttribute) return [];
      
      const tallasDisponibles = new Set<number>();
      
      // Obtener el valor del color seleccionado
      const selectedColorValue = colorAttribute.atributoValores.find(valor => valor.id === colorId);
      if (!selectedColorValue) return [];
      
      variants.forEach(variant => {
        // Verificar si la variante tiene el color seleccionado
        const hasColor = variant.varianteAtributos.some(attr => 
          attr.atributoValorId === selectedColorValue.id
        );
        
        if (hasColor) {
          variant.varianteAtributos.forEach(varianteAttr => {
            // Buscar el atributo de talla por su atributoValorId
            const sizeValue = sizeAttribute.atributoValores.find(valor => 
              valor.id === varianteAttr.atributoValorId
            );
            if (sizeValue) {
              tallasDisponibles.add(sizeValue.id);
            }
          });
        }
      });
      
      return Array.from(tallasDisponibles);
    };
  }, [variants, sizeAttribute, colorAttribute]);

  // Encontrar la variante que coincide con los atributos seleccionados usando IDs
  const matchingVariant = useMemo(() => {
    if (!colorAttribute || !sizeAttribute || Object.keys(selectedAttributes).length < 2) {
      return null;
    }

    // Obtener los valores de los atributos seleccionados
    const selectedColorValue = colorAttribute.atributoValores.find(valor => 
      valor.id === selectedAttributes['Color']
    );
    const selectedSizeValue = sizeAttribute.atributoValores.find(valor => 
      valor.id === selectedAttributes['Talla']
    );

    if (!selectedColorValue || !selectedSizeValue) {
      return null;
    }

    return variants.find(variant => {
      // Verificar que coincida con color y talla seleccionados
      const hasSelectedColor = variant.varianteAtributos.some(atributo => 
        atributo.atributoValorId === selectedColorValue.id
      );
      const hasSelectedSize = variant.varianteAtributos.some(atributo => 
        atributo.atributoValorId === selectedSizeValue.id
      );
      return hasSelectedColor && hasSelectedSize;
    }) || null;
  }, [variants, selectedAttributes, colorAttribute, sizeAttribute]);

  // No establecer selección por defecto - el usuario debe elegir

  // Actualizar la variante seleccionada cuando cambien los atributos
  useEffect(() => {
    onVariantChange(matchingVariant);

    // Limpiar color si no hay variante seleccionada
    if (!matchingVariant && onColorChange) {
      onColorChange(null);
    }
  }, [matchingVariant, onVariantChange, onColorChange]);

  const handleColorChange = (colorId: number) => {
    setSelectedAttributes({
      Color: colorId,
      Talla: 0 // Limpiar talla cuando cambia el color
    });

    // Notificar al componente padre sobre el cambio de color
    if (onColorChange) {
      onColorChange(colorId);
    }
  };

  const handleSizeChange = (sizeId: number) => {
    setSelectedAttributes(prev => ({
      Color: prev.Color,
      Talla: sizeId
    }));
  };

  // Obtener tallas disponibles para el color seleccionado
  const availableSizes = selectedAttributes['Color'] 
    ? getAvailableSizesForColor(selectedAttributes['Color'])
    : [];

  // Función helper para obtener el nombre de un atributo por ID
  const getAttributeValueName = (attribute: Atributo | undefined, valueId: number) => {
    return attribute?.atributoValores.find(valor => valor.id === valueId)?.valor || '';
  };

           // No renderizar si no hay variantes, atributos no cargados, o atributos sin valores
           if (variants.length === 0 || loading || !colorAttribute || !sizeAttribute) {
             return null;
           }

  // Verificar que los atributos tengan valores
  if (colorAttribute.atributoValores.length === 0 || sizeAttribute.atributoValores.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Selector de Color - Primero */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Color: {selectedAttributes['Color'] ? (
            <span className="font-normal text-gray-600">
              {getAttributeValueName(colorAttribute, selectedAttributes['Color'])}
            </span>
          ) : (
            <span className="font-normal text-gray-400">Selecciona un color</span>
          )}
        </h4>
        <div className="flex flex-wrap gap-2">
          {availableColors.map(colorId => {
            const isSelected = selectedAttributes['Color'] === colorId;
            const colorName = getAttributeValueName(colorAttribute, colorId);
            const hexColor = getColorHex(colorName);
            
            return (
              <button
                data-testid={`color-btn-${colorId}`}
                key={colorId}
                onClick={() => handleColorChange(colorId)}
                className={`
                  w-10 h-10 rounded-full border-2 transition-all duration-200
                  ${isSelected 
                    ? 'border-primary scale-110 shadow-lg ring-2 ring-primary/20' 
                    : 'border-gray-300 hover:border-gray-400 hover:scale-105'
                  }
                  cursor-pointer
                `}
                style={{ backgroundColor: hexColor }}
                title={colorName}
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
              <span className="font-normal text-gray-600">
                {getAttributeValueName(sizeAttribute, selectedAttributes['Talla'])}
              </span>
            ) : (
              <span className="font-normal text-gray-400">Selecciona una talla</span>
            )}
          </h4>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map(sizeId => {
              const isSelected = selectedAttributes['Talla'] === sizeId;
              const sizeName = getAttributeValueName(sizeAttribute, sizeId);
              
              return (
                <button
                  data-testid={`size-btn-${sizeId}`}
                  key={sizeId}
                  onClick={() => handleSizeChange(sizeId)}
                  className={`
                    px-4 py-2 border-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isSelected 
                      ? 'border-primary bg-primary text-white' 
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }
                    cursor-pointer
                  `}
                >
                  {sizeName}
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
