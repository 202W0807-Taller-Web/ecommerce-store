import { useState, useMemo, useCallback } from 'react';
import { 
  type FrontendProduct, 
  type Variante,
  getTodasLasImagenes
} from '../types';
import { getImagenesVarianteById } from '../utils/variants.utils';
import { useAtributos } from '../contexts';

interface UseProductVariantsReturn {
  // Estado actual de selección
  colorSeleccionado: number | null;
  tallaSeleccionada: number | null;
  varianteSeleccionada: Variante | null;
  
  // Opciones disponibles
  coloresDisponibles: number[];
  tallasDisponibles: number[];
  todasLasImagenes: string[];
  
  // Acciones
  seleccionarColor: (colorId: number) => void;
  seleccionarTalla: (tallaId: number) => void;
  resetearSeleccion: () => void;
  
  // Estado calculado
  precioActual: number;
  imagenesVarianteActual: string[];
  todasLasImagenesConVariante: string[];
  hayStock: boolean;
  puedeComprar: boolean;
  
  // Helpers para obtener nombres
  getColorName: (colorId: number) => string;
  getTallaName: (tallaId: number) => string;
}

/**
 * Hook para manejar la lógica de selección de variantes de productos
 */
export function useProductVariants(producto: FrontendProduct): UseProductVariantsReturn {
  const { atributos, loading } = useAtributos();
  const [colorSeleccionado, setColorSeleccionado] = useState<number | null>(null);
  const [tallaSeleccionada, setTallaSeleccionada] = useState<number | null>(null);

  // Obtener atributos de color y talla desde el contexto
  const colorAttribute = useMemo(() => {
    return atributos.find(attr => attr.nombre.toLowerCase() === 'color');
  }, [atributos]);

  const sizeAttribute = useMemo(() => {
    return atributos.find(attr => attr.nombre.toLowerCase() === 'talla');
  }, [atributos]);

  // Obtener colores disponibles usando IDs
  const coloresDisponibles = useMemo(() => {
    if (!colorAttribute || loading) return [];
    
    const coloresDisponibles = new Set<number>();
    producto.variantes.forEach(variant => {
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
  }, [producto.variantes, colorAttribute, loading]);

  // Obtener tallas disponibles para el color seleccionado usando IDs
  const tallasDisponibles = useMemo(() => {
    if (!colorSeleccionado || !sizeAttribute || !colorAttribute) {
      return [];
    }
    
    const tallasDisponibles = new Set<number>();
    
    // Obtener el valor del color seleccionado
    const selectedColorValue = colorAttribute.atributoValores.find(valor => valor.id === colorSeleccionado);
    if (!selectedColorValue) return [];
    
    producto.variantes.forEach(variant => {
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
  }, [producto.variantes, colorSeleccionado, sizeAttribute, colorAttribute]);

  // Encontrar la variante específica seleccionada usando IDs
  const varianteSeleccionada = useMemo(() => {
    if (!colorSeleccionado || !tallaSeleccionada || !colorAttribute || !sizeAttribute) {
      return null;
    }

    // Obtener los valores de los atributos seleccionados
    const selectedColorValue = colorAttribute.atributoValores.find(valor => 
      valor.id === colorSeleccionado
    );
    const selectedSizeValue = sizeAttribute.atributoValores.find(valor => 
      valor.id === tallaSeleccionada
    );

    if (!selectedColorValue || !selectedSizeValue) {
      return null;
    }

    return producto.variantes.find(variante => {
      // Verificar que coincida con color y talla seleccionados
      const hasSelectedColor = variante.varianteAtributos.some(atributo => 
        atributo.atributoValorId === selectedColorValue.id
      );
      const hasSelectedSize = variante.varianteAtributos.some(atributo => 
        atributo.atributoValorId === selectedSizeValue.id
      );
      return hasSelectedColor && hasSelectedSize;
    }) || null;
  }, [producto.variantes, colorSeleccionado, tallaSeleccionada, colorAttribute, sizeAttribute]);

  // Obtener todas las imágenes del producto
  const todasLasImagenes = useMemo(() => {
    return getTodasLasImagenes(producto);
  }, [producto]);

  // Obtener imágenes de la variante actual
  const imagenesVarianteActual = useMemo(() => {
    if (!colorSeleccionado || !tallaSeleccionada) {
      return [];
    }
    return getImagenesVarianteById(producto.variantes, colorSeleccionado, tallaSeleccionada);
  }, [producto.variantes, colorSeleccionado, tallaSeleccionada]);

  // Combinar todas las imágenes con las de la variante actual
  const todasLasImagenesConVariante = useMemo(() => {
    const imagenes = [...todasLasImagenes];
    
    // Agregar imágenes de la variante actual al inicio si existen
    if (imagenesVarianteActual.length > 0) {
      imagenesVarianteActual.forEach(imagen => {
        if (!imagenes.includes(imagen)) {
          imagenes.unshift(imagen); // Agregar al inicio
        }
      });
    }
    
    return imagenes;
  }, [todasLasImagenes, imagenesVarianteActual]);

  // Precio actual (de la variante seleccionada o rango de precios)
  const precioActual = useMemo(() => {
    if (varianteSeleccionada) {
      return varianteSeleccionada.precio;
    }
    
    if (colorSeleccionado && tallasDisponibles.length > 0) {
      // Si hay color seleccionado pero no talla, mostrar el precio más bajo para ese color
      const variantesDelColor = producto.variantes.filter(variante => 
        variante.varianteAtributos.some(atributo => atributo.atributoValorId === colorSeleccionado)
      );
      if (variantesDelColor.length > 0) {
        return Math.min(...variantesDelColor.map(v => v.precio));
      }
    }
    
    return producto.precioMinimo;
  }, [varianteSeleccionada, colorSeleccionado, tallasDisponibles, producto.variantes, producto.precioMinimo]);

  // Verificar si hay stock (hardcodeado)
  const hayStock = useMemo(() => {
    if (!varianteSeleccionada) return coloresDisponibles.length > 0;
    // Stock hardcodeado - simular disponibilidad basado en el ID de la variante
    const mockStock = (varianteSeleccionada.id % 5) + 1; // Stock entre 1-5
    return mockStock > 0;
  }, [varianteSeleccionada, coloresDisponibles.length]);

  
  const puedeComprar = useMemo(() => {
    return !!varianteSeleccionada && hayStock;
  }, [varianteSeleccionada, hayStock]);

  // Acciones
  const seleccionarColor = useCallback((colorId: number) => {
    setColorSeleccionado(colorId);
    // Resetear talla cuando se cambia el color
    setTallaSeleccionada(null);
  }, []);

  const seleccionarTalla = useCallback((tallaId: number) => {
    setTallaSeleccionada(tallaId);
  }, []);

  const resetearSeleccion = useCallback(() => {
    setColorSeleccionado(null);
    setTallaSeleccionada(null);
  }, []);

  // Funciones helper para obtener nombres
  const getColorName = useCallback((colorId: number): string => {
    return colorAttribute?.atributoValores.find(valor => valor.id === colorId)?.valor || '';
  }, [colorAttribute]);

  const getTallaName = useCallback((tallaId: number): string => {
    return sizeAttribute?.atributoValores.find(valor => valor.id === tallaId)?.valor || '';
  }, [sizeAttribute]);

  return {
    // Estado actual
    colorSeleccionado,
    tallaSeleccionada,
    varianteSeleccionada,
    
    // Opciones disponibles
    coloresDisponibles,
    tallasDisponibles,
    todasLasImagenes,
    
    // Acciones
    seleccionarColor,
    seleccionarTalla,
    resetearSeleccion,
    
    // Estado calculado
    precioActual,
    imagenesVarianteActual,
    todasLasImagenesConVariante,
    hayStock,
    puedeComprar,
    
    // Helpers
    getColorName,
    getTallaName
  };
}
