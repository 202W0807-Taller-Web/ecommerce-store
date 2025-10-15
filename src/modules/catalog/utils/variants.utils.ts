import { type Product, type Variante, type FrontendProduct } from '../types';

/**
 * Utilidades para manejar variantes de productos
 */

/**
 * Obtiene todos los colores disponibles en las variantes de un producto
 * @deprecated Usar getColoresDisponiblesById en su lugar
 */
export function getColoresDisponibles(variantes: Variante[]): string[] {
  const colores = new Set<string>();
  
  variantes.forEach(variante => {
    variante.varianteAtributos.forEach(atributo => {
      // Buscar atributos de color (asumiendo que el nombre del atributo es "Color")
      if (atributo.atributoValor && isColorAttribute(atributo.atributoValor)) {
        colores.add(atributo.atributoValor);
      }
    });
  });
  
  return Array.from(colores);
}

/**
 * Obtiene todos los colores disponibles usando IDs de atributos
 * Necesita el contexto de atributos para mapear IDs a valores
 */
export function getColoresDisponiblesById(
  variantes: Variante[], 
  colorAttribute: { id: number; nombre: string; atributoValores: { id: number; valor: string }[] } | undefined
): number[] {
  if (!colorAttribute) return [];
  
  const coloresDisponibles = new Set<number>();
  variantes.forEach(variant => {
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
}

/**
 * Obtiene todas las tallas disponibles para un color específico
 * @deprecated Usar getTallasPorColorById en su lugar
 */
export function getTallasPorColor(variantes: Variante[], colorSeleccionado: string): string[] {
  const tallas = new Set<string>();
  
  variantes.forEach(variante => {
    const hasColor = variante.varianteAtributos.some(atributo => 
      atributo.atributoValor === colorSeleccionado
    );
    
    if (hasColor) {
      variante.varianteAtributos.forEach(atributo => {
        // Buscar atributos de talla (asumiendo que son valores como "S", "M", "L", "XL")
        if (atributo.atributoValor && isTallaAttribute(atributo.atributoValor)) {
          tallas.add(atributo.atributoValor);
        }
      });
    }
  });
  
  return Array.from(tallas);
}

/**
 * Obtiene todas las tallas disponibles para un color específico usando IDs
 */
export function getTallasPorColorById(
  variantes: Variante[], 
  colorId: number,
  sizeAttribute: { id: number; nombre: string; atributoValores: { id: number; valor: string }[] } | undefined,
  colorAttribute: { id: number; nombre: string; atributoValores: { id: number; valor: string }[] } | undefined
): number[] {
  if (!sizeAttribute || !colorAttribute) return [];
  
  const tallasDisponibles = new Set<number>();
  
  // Obtener el valor del color seleccionado
  const selectedColorValue = colorAttribute.atributoValores.find(valor => valor.id === colorId);
  if (!selectedColorValue) return [];
  
  variantes.forEach(variant => {
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
}

/**
 * Encuentra la variante específica basada en color y talla seleccionados
 * @deprecated Usar encontrarVarianteById en su lugar
 */
export function encontrarVariante(
  variantes: Variante[], 
  colorSeleccionado: string, 
  tallaSeleccionada: string
): Variante | null {
  return variantes.find(variante => {
    const atributos = variante.varianteAtributos.map(a => a.atributoValor);
    return atributos.includes(colorSeleccionado) && atributos.includes(tallaSeleccionada);
  }) || null;
}

/**
 * Encuentra la variante específica basada en IDs de color y talla
 */
export function encontrarVarianteById(
  variantes: Variante[], 
  colorId: number, 
  tallaId: number
): Variante | null {
  return variantes.find(variante => {
    const hasSelectedColor = variante.varianteAtributos.some(atributo => 
      atributo.atributoValorId === colorId
    );
    const hasSelectedSize = variante.varianteAtributos.some(atributo => 
      atributo.atributoValorId === tallaId
    );
    return hasSelectedColor && hasSelectedSize;
  }) || null;
}

/**
 * Obtiene el precio de una variante específica
 */
export function getPrecioVariante(
  variantes: Variante[], 
  colorSeleccionado?: string, 
  tallaSeleccionada?: string
): number {
  if (!colorSeleccionado || !tallaSeleccionada) {
    return 0;
  }
  
  const variante = encontrarVariante(variantes, colorSeleccionado, tallaSeleccionada);
  return variante?.precio || 0;
}

/**
 * Obtiene las imágenes de una variante específica
 */
export function getImagenesVariante(
  variantes: Variante[], 
  colorSeleccionado?: string, 
  tallaSeleccionada?: string
): string[] {
  if (!colorSeleccionado || !tallaSeleccionada) {
    return [];
  }
  
  const variante = encontrarVariante(variantes, colorSeleccionado, tallaSeleccionada);
  return variante?.varianteImagenes.map(img => img.imagen) || [];
}

/**
 * Obtiene las imágenes de una variante específica usando IDs
 */
export function getImagenesVarianteById(
  variantes: Variante[], 
  colorId?: number, 
  tallaId?: number
): string[] {
  if (!colorId || !tallaId) {
    return [];
  }
  
  const variante = encontrarVarianteById(variantes, colorId, tallaId);
  return variante?.varianteImagenes.map(img => img.imagen) || [];
}

/**
 * Obtiene todas las imágenes del producto (incluyendo las de variantes)
 */
export function getTodasLasImagenes(producto: Product): string[] {
  const imagenes = [...producto.productoImagenes.map(img => img.imagen)];
  
  // Agregar imágenes de variantes únicas
  const imagenesVariantes = new Set<string>();
  producto.variantes.forEach(variante => {
    variante.varianteImagenes.forEach(img => {
      imagenesVariantes.add(img.imagen);
    });
  });
  
  return [...imagenes, ...Array.from(imagenesVariantes)];
}

/**
 * Obtiene la imagen principal del producto
 */
export function getImagenPrincipal(producto: Product): string {
  const imagenPrincipal = producto.productoImagenes.find(img => img.principal);
  return imagenPrincipal?.imagen || producto.productoImagenes[0]?.imagen || '';
}

/**
 * Calcula el rango de precios de todas las variantes
 */
export function getRangoPrecios(variantes: Variante[]): { min: number; max: number } {
  if (variantes.length === 0) {
    return { min: 0, max: 0 };
  }
  
  const precios = variantes.map(v => v.precio);
  return {
    min: Math.min(...precios),
    max: Math.max(...precios)
  };
}

/**
 * Convierte un Product a FrontendProduct con campos calculados
 */
export function enhanceProduct(producto: Product): FrontendProduct {
  const rangoPrecios = getRangoPrecios(producto.variantes);
  const colores = getColoresDisponibles(producto.variantes);
  const todasLasImagenes = getTodasLasImagenes(producto);
  const imagenPrincipal = getImagenPrincipal(producto);
  
  // Los datos de rating y reviewCount se pasarán como parámetros en el componente
  
  // Obtener todas las tallas disponibles (sin filtro de color)
  const todasLasTallas = new Set<string>();
  producto.variantes.forEach(variante => {
    variante.varianteAtributos.forEach(atributo => {
      if (atributo.atributoValor && isTallaAttribute(atributo.atributoValor)) {
        todasLasTallas.add(atributo.atributoValor);
      }
    });
  });
  
  return {
    ...producto,
    precioMinimo: rangoPrecios.min,
    precioMaximo: rangoPrecios.max,
    coloresDisponibles: colores,
    tallasDisponibles: Array.from(todasLasTallas),
    imagenPrincipal,
    todasLasImagenes
  };
}

/**
 * Verifica si un valor de atributo es un color
 */
function isColorAttribute(valor: string): boolean {
  const coloresConocidos = [
    'Negro', 'Blanco', 'Azul', 'Verde', 'Rojo', 'Amarillo', 
    'Morado', 'Rosado', 'Celeste', 'Naranja', 'Plomo', 'Multicolor'
  ];
  return coloresConocidos.includes(valor);
}

/**
 * Verifica si un valor de atributo es una talla
 */
function isTallaAttribute(valor: string): boolean {
  const tallasConocidas = ['S', 'M', 'L', 'XL', 'XXL'];
  return tallasConocidas.includes(valor) || /^\d+$/.test(valor); // También números para calzado
}
