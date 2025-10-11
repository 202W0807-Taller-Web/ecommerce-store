import { type ProductSummary, type Product, type Variante } from '../types';

/**
 * Mock de productos para listado (GET /product/listado)
 */
export function generarProductosMock(): ProductSummary[] {
  const productos: ProductSummary[] = [];
  
  for (let i = 1; i <= 50; i++) {
    productos.push({
      id: i,
      nombre: `Producto ${i}`,
      precio: 99000 + (i * 1000),
      imagen: `https://tallerwebgrupo4.blob.core.windows.net/data/cdc82604-0721-4dac-9d60-e384a9e05888.jpg`,
      tienePromocion: i % 3 === 0
    });
  }
  
  return productos;
}

/**
 * Mock de detalle de producto (GET /product/:id)
 */
export function generarProductoDetalleMock(id: number): Product {
  // Diferentes tallas disponibles por color
  const variantesPorColor: Record<string, string[]> = {
    'Negro': ['S', 'M', 'L', 'XL'],
    'Blanco': ['M', 'L', 'XL'],
    'Azul': ['S', 'M'],
    'Rojo': ['S', 'M', 'L', 'XL', 'XXL']
  };
  
  const colores = Object.keys(variantesPorColor);
  const variantes: Variante[] = [];
  
  // Generar variantes con diferentes tallas por color
  let varianteId = 1;
  colores.forEach((color, colorIndex) => {
    const tallasDisponibles = variantesPorColor[color];
    tallasDisponibles.forEach((talla, tallaIndex) => {
      variantes.push({
        id: varianteId,
        productoId: id,
        precio: 100000 + (varianteId * 1000),
        sku: `SKU-${id}-${talla}-${color.substring(0, 3).toUpperCase()}`,
        stock: Math.floor(Math.random() * 50) + 10, // Stock aleatorio entre 10 y 59
        varianteImagenes: [
          {
            id: varianteId,
            varianteId: varianteId,
            imagen: `https://picsum.photos/400/400?random=${varianteId}&color=${color.toLowerCase()}`
          }
        ],
        varianteAtributos: [
          {
            id: varianteId * 2,
            varianteId: varianteId,
            atributoValorId: 50 + tallaIndex, // IDs de talla del mock
            atributoValor: talla
          },
          {
            id: varianteId * 2 + 1,
            varianteId: varianteId,
            atributoValorId: 28 + colorIndex, // IDs de color del mock
            atributoValor: color
          }
        ]
      });
      varianteId++;
    });
  });
  
  // Generar atributos del producto
  const productoAtributos = [
    { id: 1, productoId: id, atributoValorId: 13, valor: "Voleibol" },
    { id: 2, productoId: id, atributoValorId: 4, valor: "Hombre" },
    { id: 3, productoId: id, atributoValorId: 1, valor: "Ropa" }
  ];
  
  return {
    id: id,
    nombre: `Producto ${id}`,
    descripcion: `Descripción detallada del producto ${id}. Este producto incluye variantes de talla y color para demostrar la funcionalidad completa.`,
    idPromocion: id % 2 === 0 ? 1 : null,
    productoImagenes: [
      {
        id: 1,
        productoId: id,
        principal: true,
        imagen: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvQJG1xf5jAtgD0POm7OV-_MK5mamvRC1IopJShbJYjacywK3WRdFp4fiehuw8IbqjiQM&usqp=CAU`
      },
      {
        id: 2,
        productoId: id,
        principal: false,
        imagen: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvQJG1xf5jAtgD0POm7OV-_MK5mamvRC1IopJShbJYjacywK3WRdFp4fiehuw8IbqjiQM&usqp=CAU`
      },
      {
        id: 3,
        productoId: id,
        principal: false,
        imagen: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvQJG1xf5jAtgD0POm7OV-_MK5mamvRC1IopJShbJYjacywK3WRdFp4fiehuw8IbqjiQM&usqp=CAU`
      },
      {
        id: 4,
        productoId: id,
        principal: false,
        imagen: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvQJG1xf5jAtgD0POm7OV-_MK5mamvRC1IopJShbJYjacywK3WRdFp4fiehuw8IbqjiQM&usqp=CAU`
      },
      {
        id: 5,
        productoId: id,
        principal: false,
        imagen: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvQJG1xf5jAtgD0POm7OV-_MK5mamvRC1IopJShbJYjacywK3WRdFp4fiehuw8IbqjiQM&usqp=CAU`
      }
    ],
    variantes,
    productoAtributos
  };
}
