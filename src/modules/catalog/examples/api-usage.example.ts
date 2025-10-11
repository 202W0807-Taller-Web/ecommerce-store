/**
 * EJEMPLO DE USO DE LAS NUEVAS INTERFACES
 * 
 * Este archivo muestra cómo usar las interfaces actualizadas
 * que coinciden con la estructura real de la API.
 */

import { CatalogService } from '../services/catalog.service';

// Ejemplo de respuesta real de la API para GET /product/:id
const apiProductDetailExample = {
  "id": 1,
  "nombre": "Producto 1",
  "descripcion": "Desc",
  "idPromocion": null,
  "productoImagenes": [
    {
      "id": 1,
      "productoId": 1,
      "principal": true,
      "imagen": "example://imagen-b350b901-51a0-41d2-b226-6839ae5b8362"
    },
    {
      "id": 2,
      "productoId": 1,
      "principal": false,
      "imagen": "example://imagen-963978f6-f397-4de7-bfb4-28e7604c287b"
    }
  ],
  "variantes": [],
  "productoAtributos": []
};

// Ejemplo de respuesta real de la API para GET /products
const apiProductSummaryExample = {
  "nombre": "Producto 1",
  "descripcion": "Desc",
  "imagenesBase64": [
    "imagen-1",
    "imagen-2"
  ]
};

// Ejemplo de uso en el servicio
export async function ejemploUsoServicio() {
  const catalogService = new CatalogService();
  
  // Obtener lista de productos
  const productos = await catalogService.getProducts();
  console.log('Productos obtenidos:', productos);
  
  // Obtener detalle de producto
  const productoDetalle = await catalogService.getProductDetail(1);
  console.log('Detalle del producto:', productoDetalle);
  
  // Obtener productos relacionados
  const productosRelacionados = await catalogService.getRelatedProducts(1);
  console.log('Productos relacionados:', productosRelacionados);
}

// Ejemplo de transformación manual de datos
export function ejemploTransformacionManual() {
  // Los datos ahora se transforman automáticamente en el servicio
  console.log('Ejemplo de producto detallado:', apiProductDetailExample);
  console.log('Ejemplo de producto resumen:', apiProductSummaryExample);
}

/**
 * NOTAS IMPORTANTES:
 * 
 * 1. Las interfaces ahora coinciden exactamente con la estructura de la API
 * 2. Los datos faltantes (precio, rating, etc.) se mockean automáticamente
 * 3. La nomenclatura es completamente en español para coincidir con la API
 * 4. Se eliminaron todas las propiedades de compatibilidad
 * 5. Los componentes usan directamente las propiedades en español
 * 6. Los métodos del servicio ya están actualizados para usar la API real
 */
