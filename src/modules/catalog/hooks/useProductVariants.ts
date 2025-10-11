import { useState, useMemo, useCallback } from 'react';
import { 
  type ProductWithUI, 
  type Variante,
  getColoresDisponibles,
  getTallasPorColor,
  encontrarVariante,
  getImagenesVariante,
  getTodasLasImagenes
} from '../types';

interface UseProductVariantsReturn {
  // Estado actual de selección
  colorSeleccionado: string | null;
  tallaSeleccionada: string | null;
  varianteSeleccionada: Variante | null;
  
  // Opciones disponibles
  coloresDisponibles: string[];
  tallasDisponibles: string[];
  todasLasImagenes: string[];
  
  // Acciones
  seleccionarColor: (color: string) => void;
  seleccionarTalla: (talla: string) => void;
  resetearSeleccion: () => void;
  
  // Estado calculado
  precioActual: number;
  imagenesVarianteActual: string[];
  todasLasImagenesConVariante: string[];
  hayStock: boolean;
  puedeComprar: boolean;
}

/**
 * Hook para manejar la lógica de selección de variantes de productos
 * Implementa la lógica: seleccionar color -> mostrar tallas disponibles -> seleccionar talla
 */
export function useProductVariants(producto: ProductWithUI): UseProductVariantsReturn {
  const [colorSeleccionado, setColorSeleccionado] = useState<string | null>(null);
  const [tallaSeleccionada, setTallaSeleccionada] = useState<string | null>(null);

  // Obtener colores disponibles (todas las variantes)
  const coloresDisponibles = useMemo(() => {
    return getColoresDisponibles(producto.variantes);
  }, [producto.variantes]);

  // Obtener tallas disponibles para el color seleccionado
  const tallasDisponibles = useMemo(() => {
    if (!colorSeleccionado) {
      // Si no hay color seleccionado, mostrar todas las tallas disponibles
      return producto.tallasDisponibles;
    }
    return getTallasPorColor(producto.variantes, colorSeleccionado);
  }, [producto.variantes, colorSeleccionado, producto.tallasDisponibles]);

  // Encontrar la variante específica seleccionada
  const varianteSeleccionada = useMemo(() => {
    if (!colorSeleccionado || !tallaSeleccionada) {
      return null;
    }
    return encontrarVariante(producto.variantes, colorSeleccionado, tallaSeleccionada);
  }, [producto.variantes, colorSeleccionado, tallaSeleccionada]);

  // Obtener todas las imágenes del producto
  const todasLasImagenes = useMemo(() => {
    return getTodasLasImagenes(producto);
  }, [producto]);

  // Obtener imágenes de la variante actual
  const imagenesVarianteActual = useMemo(() => {
    if (!colorSeleccionado || !tallaSeleccionada) {
      return [];
    }
    return getImagenesVariante(producto.variantes, colorSeleccionado, tallaSeleccionada);
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
        variante.varianteAtributos.some(atributo => atributo.atributoValor === colorSeleccionado)
      );
      if (variantesDelColor.length > 0) {
        return Math.min(...variantesDelColor.map(v => v.precio));
      }
    }
    
    return producto.precioMinimo;
  }, [varianteSeleccionada, colorSeleccionado, tallasDisponibles, producto.variantes, producto.precioMinimo]);

  // Verificar si hay stock (asumiendo que todas las variantes tienen stock por ahora)
  const hayStock = useMemo(() => {
    return varianteSeleccionada ? true : coloresDisponibles.length > 0;
  }, [varianteSeleccionada, coloresDisponibles.length]);

  // Verificar si se puede comprar (selección completa)
  const puedeComprar = useMemo(() => {
    return !!varianteSeleccionada && hayStock;
  }, [varianteSeleccionada, hayStock]);

  // Acciones
  const seleccionarColor = useCallback((color: string) => {
    setColorSeleccionado(color);
    // Resetear talla cuando se cambia el color
    setTallaSeleccionada(null);
  }, []);

  const seleccionarTalla = useCallback((talla: string) => {
    setTallaSeleccionada(talla);
  }, []);

  const resetearSeleccion = useCallback(() => {
    setColorSeleccionado(null);
    setTallaSeleccionada(null);
  }, []);

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
    puedeComprar
  };
}
