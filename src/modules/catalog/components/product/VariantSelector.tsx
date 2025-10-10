import { useState, useMemo, useEffect } from 'react';
import { type ProductoVariante } from '../../types';
import { obtenerColorPorNombre } from '../../data/colors';

interface VariantSelectorProps {
  variants: ProductoVariante[];
  onVariantChange: (variant: ProductoVariante | null) => void;
  selectedVariant: ProductoVariante | null;
}

export const VariantSelector = ({ variants, onVariantChange, selectedVariant }: VariantSelectorProps) => {
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

  // Agrupar atributos de variante (Talla, Color, etc.)
  const attributeGroups = useMemo(() => {
    const groups: Record<string, string[]> = {};
    
    // Obtener tallas únicas
    const tallas = variants.map(v => v.talla).filter((talla): talla is string => Boolean(talla));
    if (tallas.length > 0) {
      groups['Talla'] = [...new Set(tallas)];
    }
    
    // Obtener colores únicos
    const colores = variants.map(v => v.color).filter((color): color is string => Boolean(color));
    if (colores.length > 0) {
      groups['Color'] = [...new Set(colores)];
    }
    
    // Obtener unidades de medida únicas
    const unidades = variants.map(v => v.unidadMedida).filter((unidad): unidad is string => Boolean(unidad));
    if (unidades.length > 0) {
      groups['Unidad medida'] = [...new Set(unidades)];
    }
    
    return groups;
  }, [variants]);

  // Encontrar la variante que coincide con los atributos seleccionados
  const matchingVariant = useMemo(() => {
    if (Object.keys(selectedAttributes).length === 0) {
      return variants[0] || null;
    }

    return variants.find(variant => {
      // Verificar que coincida con los atributos seleccionados
      return Object.entries(selectedAttributes).every(([attrName, attrValue]) => {
        switch (attrName) {
          case 'Talla':
            return variant.talla === attrValue;
          case 'Color':
            return variant.color === attrValue;
          case 'Unidad medida':
            return variant.unidadMedida === attrValue;
          default:
            return true;
        }
      });
    }) || null;
  }, [variants, selectedAttributes]);

  // Establecer la primera combinación como selección por defecto
  useEffect(() => {
    if (Object.keys(selectedAttributes).length === 0 && variants.length > 0) {
      const defaultAttributes: Record<string, string> = {};
      
      // Obtener la primera talla disponible
      const firstTalla = variants.find(v => v.talla)?.talla;
      if (firstTalla) {
        defaultAttributes['Talla'] = firstTalla;
      }
      
      // Obtener el primer color disponible
      const firstColor = variants.find(v => v.color)?.color;
      if (firstColor) {
        defaultAttributes['Color'] = firstColor;
      }
      
      // Obtener la primera unidad de medida disponible
      const firstUnidad = variants.find(v => v.unidadMedida)?.unidadMedida;
      if (firstUnidad) {
        defaultAttributes['Unidad medida'] = firstUnidad;
      }
      
      setSelectedAttributes(defaultAttributes);
    }
  }, [variants, selectedAttributes]);

  // Actualizar la variante seleccionada cuando cambien los atributos
  useMemo(() => {
    onVariantChange(matchingVariant);
  }, [matchingVariant, onVariantChange]);

  const handleAttributeChange = (attributeName: string, value: string) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [attributeName]: value
    }));
  };

  // Verificar si una combinación de atributos está disponible
  const isAttributeAvailable = (attributeName: string, value: string) => {
    const testAttributes = { ...selectedAttributes, [attributeName]: value };
    
    return variants.some(variant => {
      return Object.entries(testAttributes).every(([attrName, attrValue]) => {
        switch (attrName) {
          case 'Talla':
            return variant.talla === attrValue;
          case 'Color':
            return variant.color === attrValue;
          case 'Unidad medida':
            return variant.unidadMedida === attrValue;
          default:
            return true;
        }
      });
    });
  };

  if (variants.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {Object.entries(attributeGroups).map(([attributeName, values]) => (
        <div key={attributeName}>
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            {(attributeName === 'Color' || attributeName === 'Talla' || attributeName === 'Unidad medida') && selectedAttributes[attributeName] ? (
              <>
                {attributeName}: <span className="font-normal text-gray-600">{selectedAttributes[attributeName]}</span>
              </>
            ) : (
              attributeName
            )}
          </h4>
          <div className="flex flex-wrap gap-2">
            {values.map(value => {
              const isSelected = selectedAttributes[attributeName] === value;
              const isAvailable = isAttributeAvailable(attributeName, value);
              const isDisabled = !isAvailable;
              
              // Si es un color, obtener el código hex y renderizar solo el círculo
              if (attributeName === 'Color') {
                const colorData = obtenerColorPorNombre(value);
                const hexColor = colorData?.hex || '#000000';
                
                return (
                  <button
                    key={value}
                    onClick={() => handleAttributeChange(attributeName, value)}
                    disabled={isDisabled}
                    className={`
                      w-8 h-8 rounded-full border-2 transition-all duration-200
                      ${isSelected 
                        ? 'border-primary scale-110 shadow-lg' 
                        : 'border-gray-300 hover:border-gray-400 hover:scale-105'
                      }
                      ${isDisabled 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'cursor-pointer'
                      }
                    `}
                    style={{ backgroundColor: hexColor }}
                    title={value} // Tooltip con el nombre del color
                  />
                );
              }
              
              // Para otros atributos (talla, etc.), mantener el diseño original
              return (
                <button
                  key={value}
                  onClick={() => handleAttributeChange(attributeName, value)}
                  disabled={isDisabled}
                  className={`
                    px-4 py-2 text-sm font-medium rounded-md border-2 transition-colors
                    ${isSelected 
                      ? 'bg-primary/80 text-white border-primary' 
                      : 'bg-white text-gray-900 border-gray-300 hover:border-gray-400'
                    }
                    ${isDisabled 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'cursor-pointer'
                    }
                  `}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Información de la variante seleccionada */}
      {selectedVariant && (
        <div className="bg-gray-50 p-4 rounded-lg">
          {selectedVariant.stock > 0 ? (
            <div className="flex items-center text-sm text-green-600">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              En stock ({selectedVariant.stock} unidades)
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
