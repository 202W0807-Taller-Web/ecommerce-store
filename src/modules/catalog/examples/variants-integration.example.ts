/**
 * Ejemplo de integración de variantes con la nueva estructura de datos
 * 
 * Este archivo muestra cómo usar las nuevas interfaces y hooks para manejar
 * la selección de variantes (color -> talla) y el manejo de imágenes.
 */

import { 
  type ProductWithUI, 
  enhanceProductWithUI,
  getColoresDisponibles,
  getTallasPorColor,
  encontrarVariante,
  getImagenesVariante
} from '../types';
import { useProductVariants } from '../hooks/useProductVariants';

// Ejemplo de datos de producto desde la API (GET /product/:id)
const ejemploProductoAPI = {
  id: 3,
  nombre: "Laptop-2",
  descripcion: "asdfasdas",
  idPromocion: null,
  productoImagenes: [
    {
      id: 5,
      productoId: 3,
      principal: true,
      imagen: "https://tallerwebgrupo4.blob.core.windows.net/data/a1f1dd22-a01e-47b5-9046-9ef97a374baf.png"
    },
    {
      id: 6,
      productoId: 3,
      principal: false,
      imagen: "https://tallerwebgrupo4.blob.core.windows.net/data/cdc82604-0721-4dac-9d60-e384a9e05888.jpg"
    }
  ],
  variantes: [
    {
      id: 3,
      productoId: 3,
      precio: 100012,
      sku: "LTP-NEG",
      varianteImagenes: [
        {
          id: 3,
          varianteId: 3,
          imagen: "https://tallerwebgrupo4.blob.core.windows.net/data/c309e985-fbf0-4414-8430-d14b3891ef70.jpg"
        }
      ],
      varianteAtributos: [
        {
          id: 4,
          varianteId: 3,
          atributoValorId: 50,
          atributoValor: "S"
        },
        {
          id: 5,
          varianteId: 3,
          atributoValorId: 28,
          atributoValor: "Negro"
        }
      ]
    }
  ],
  productoAtributos: [
    { id: 1, productoId: 3, atributoValorId: 13, valor: "Voleibol" },
    { id: 2, productoId: 3, atributoValorId: 4, valor: "Hombre" },
    { id: 3, productoId: 3, atributoValorId: 1, valor: "Ropa" }
  ]
};

// Transformar el producto de la API a ProductWithUI
const productoConUI: ProductWithUI = enhanceProductWithUI(ejemploProductoAPI);

// Ejemplo de uso del hook useProductVariants en un componente React
export function EjemploComponenteVariantes() {
  const {
    // Estado actual de selección
    colorSeleccionado,
    tallaSeleccionada,
    varianteSeleccionada,
    
    // Opciones disponibles
    coloresDisponibles,
    tallasDisponibles,
    
    // Acciones
    seleccionarColor,
    seleccionarTalla,
    
    // Estado calculado
    precioActual,
    imagenesVarianteActual,
    todasLasImagenesConVariante,
    hayStock,
    puedeComprar
  } = useProductVariants(productoConUI);

  // Ejemplo de lógica de negocio
  const manejarSeleccionColor = (color: string) => {
    seleccionarColor(color);
    // La talla se resetea automáticamente
    console.log(`Color seleccionado: ${color}`);
    console.log(`Tallas disponibles para ${color}:`, tallasDisponibles);
  };

  const manejarSeleccionTalla = (talla: string) => {
    seleccionarTalla(talla);
    console.log(`Talla seleccionada: ${talla}`);
    console.log(`Variante seleccionada:`, varianteSeleccionada);
    console.log(`Precio actual: $${precioActual}`);
    console.log(`Imágenes de la variante:`, imagenesVarianteActual);
  };

  // Ejemplo de renderizado (pseudocódigo JSX)
  return {
    // Renderizar selector de colores
    renderColores: coloresDisponibles.map(color => ({
      color,
      isSelected: colorSeleccionado === color,
      onClick: () => manejarSeleccionColor(color)
    })),

    // Renderizar selector de tallas (solo si hay color seleccionado)
    renderTallas: colorSeleccionado ? tallasDisponibles.map(talla => ({
      talla,
      isSelected: tallaSeleccionada === talla,
      onClick: () => manejarSeleccionTalla(talla)
    })) : [],

    // Renderizar galería de imágenes
    renderGaleria: todasLasImagenesConVariante.map((imagen, index) => ({
      src: imagen,
      isMain: index === 0, // La primera imagen es la principal
      alt: `Imagen ${index + 1} del producto`
    })),

    // Información del producto
    infoProducto: {
      nombre: productoConUI.nombre,
      precio: precioActual,
      varianteSeleccionada,
      puedeComprar,
      hayStock
    }
  };
}

// Ejemplo de uso directo de las funciones utilitarias
export function ejemploUsoFuncionesUtilitarias() {
  // Obtener colores disponibles
  const colores = getColoresDisponibles(productoConUI.variantes);
  console.log('Colores disponibles:', colores);

  // Obtener tallas para un color específico
  const tallasNegro = getTallasPorColor(productoConUI.variantes, 'Negro');
  console.log('Tallas disponibles para Negro:', tallasNegro);

  // Encontrar variante específica
  const variante = encontrarVariante(productoConUI.variantes, 'Negro', 'S');
  console.log('Variante Negro-S:', variante);

  // Obtener imágenes de una variante específica
  const imagenes = getImagenesVariante(productoConUI.variantes, 'Negro', 'S');
  console.log('Imágenes de la variante Negro-S:', imagenes);
}

// Ejemplo de integración con el servicio de catálogo
export async function ejemploIntegracionServicio() {
  const catalogService = new (await import('../services/catalog.service')).CatalogService();
  
  // Obtener detalle del producto (ya viene como ProductWithUI)
  const producto = await catalogService.getProductDetail(3);
  
  if (producto) {
    console.log('Producto obtenido:', producto);
    console.log('Colores disponibles:', producto.coloresDisponibles);
    console.log('Tallas disponibles:', producto.tallasDisponibles);
    console.log('Rango de precios:', `${producto.precioMinimo} - ${producto.precioMaximo}`);
    console.log('Imagen principal:', producto.imagenPrincipal);
    console.log('Todas las imágenes:', producto.todasLasImagenes);
  }
}
