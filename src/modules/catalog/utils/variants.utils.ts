import { type Product, type Variante, type ProductWithUI } from '../types';

/**
 * Utilidades para manejar variantes de productos
 */

/**
 * Obtiene todos los colores disponibles en las variantes de un producto
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
 * Obtiene todas las tallas disponibles para un color específico
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
        if (isTallaAttribute(atributo.atributoValor)) {
          tallas.add(atributo.atributoValor);
        }
      });
    }
  });
  
  return Array.from(tallas);
}

/**
 * Encuentra la variante específica basada en color y talla seleccionados
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
 * Convierte un Product a ProductWithUI con campos calculados
 */
export function enhanceProductWithUI(producto: Product): ProductWithUI {
  const rangoPrecios = getRangoPrecios(producto.variantes);
  const colores = getColoresDisponibles(producto.variantes);
  const todasLasImagenes = getTodasLasImagenes(producto);
  const imagenPrincipal = getImagenPrincipal(producto);
  
  // Los datos de rating y reviewCount se pasarán como parámetros en el componente
  
  // Obtener todas las tallas disponibles (sin filtro de color)
  const todasLasTallas = new Set<string>();
  producto.variantes.forEach(variante => {
    variante.varianteAtributos.forEach(atributo => {
      if (isTallaAttribute(atributo.atributoValor)) {
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
    todasLasImagenes,
    // Datos por defecto (se sobrescribirán con parámetros en el componente)
    rating: 0,
    reviewCount: 0,
    categoria: 'Categoría Mock',
    isPromo: !!producto.idPromocion,
    precioOriginal: producto.idPromocion ? rangoPrecios.min * 1.3 : undefined
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
