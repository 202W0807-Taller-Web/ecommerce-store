import { useState } from 'react';
import { type Product } from '../../types';

interface ProductGalleryProps {
  product: Product;
}

export const ProductGallery = ({ product }: ProductGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="flex space-x-4">
      {/* Imágenes Miniatura - Apiladas verticalmente a la izquierda */}
      <div className="flex flex-col space-y-2">
        {product.productoImagenes.map((imagen, index) => (
          <button
            key={index}
            onClick={() => setSelectedImageIndex(index)}
            className="w-20 h-20 overflow-hidden rounded bg-gray-100 border border-gray-200 hover:border-gray-300"
          >
            <img
              src={imagen.imagen}
              alt={`${product.nombre} ${index + 1}`}
              className="h-full w-full object-cover object-center"
            />
          </button>
        ))}
      </div>
      
      {/* Imagen Principal */}
      <div className="flex-1 aspect-square overflow-hidden rounded-lg bg-gray-100">
        <img
          src={product.productoImagenes[selectedImageIndex]?.imagen || ''}
          alt={product.nombre}
          className="h-full w-full object-contain object-center"
        />
      </div>
    </div>
  );
};
