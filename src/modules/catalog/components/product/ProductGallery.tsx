import { useState, useEffect, useRef } from 'react';
import { type FrontendProduct, type Variante } from '../../types';
import { useAtributos } from '../../contexts';
import './ProductGallery.css';

interface ProductGalleryProps {
  product: FrontendProduct;
  selectedVariant?: Variante | null;
  selectedColor?: number | null;
}

export const ProductGallery = ({ product, selectedVariant, selectedColor }: ProductGalleryProps) => {
  const { atributos } = useAtributos();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Obtener imágenes únicas por color (una por color + imágenes del producto)
  const getUniqueImagesByColor = () => {
    const images = [...product.productoImagenes.map(img => img.imagen)];
    const colorImages = new Map<string, string>();
    
    
    // Obtener atributo de color del contexto
    const colorAttribute = atributos.find(attr => attr.nombre.toLowerCase() === 'color');
    
    if (colorAttribute) {
      // Agrupar variantes por color usando IDs
      product.variantes.forEach(variant => {
        // Buscar atributos de color en la variante
        variant.varianteAtributos.forEach(varianteAttr => {
          const colorValue = colorAttribute.atributoValores.find(valor => 
            valor.id === varianteAttr.atributoValorId
          );
          
          if (colorValue && variant.varianteImagenes.length > 0) {
            const colorName = colorValue.valor;
                    if (!colorImages.has(colorName)) {
                      colorImages.set(colorName, variant.varianteImagenes[0].imagen);
                    }
          }
        });
      });
    }
    
    // Agregar imágenes de colores únicos
    colorImages.forEach(imageUrl => {
      if (!images.includes(imageUrl)) {
        images.push(imageUrl);
      }
    });
    return images;
  };

  const allImages = getUniqueImagesByColor();

  // Función para hacer scroll a una imagen específica
  const scrollToImage = (imageIndex: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const imageElement = container.children[imageIndex] as HTMLElement;
      
      if (imageElement) {
        const containerRect = container.getBoundingClientRect();
        const imageRect = imageElement.getBoundingClientRect();
        
        // Calcular si la imagen está fuera del viewport
        const isAbove = imageRect.top < containerRect.top;
        const isBelow = imageRect.bottom > containerRect.bottom;
        
        if (isAbove || isBelow) {
          // Hacer scroll suave a la imagen
          imageElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
          });
        }
      }
    }
  };

  // Cuando se selecciona un color o una variante, mostrar su imagen correspondiente
  useEffect(() => {

    let targetImageUrl: string | null = null;

    // Prioridad 1: Si hay variante seleccionada, usar su imagen
    if (selectedVariant && selectedVariant.varianteImagenes.length > 0) {
      targetImageUrl = selectedVariant.varianteImagenes[0].imagen;
    }
    // Prioridad 2: Si no hay variante pero sí color, usar imagen del color
    else if (selectedColor) {
      // Buscar variante que tenga el color seleccionado (por ID)
      const variantWithColor = product.variantes.find(variant => 
        variant.varianteAtributos.some(attr => attr.atributoValorId === selectedColor)
      );
      
      if (variantWithColor && variantWithColor.varianteImagenes.length > 0) {
        targetImageUrl = variantWithColor.varianteImagenes[0].imagen;
      }
    }

    if (targetImageUrl) {
      const targetImageIndex = allImages.findIndex(img => img === targetImageUrl);
      
      if (targetImageIndex !== -1 && targetImageIndex !== selectedImageIndex) {
        setSelectedImageIndex(targetImageIndex);
        
        // Hacer scroll a la imagen después de un pequeño delay
        setTimeout(() => {
          scrollToImage(targetImageIndex);
        }, 100);
      }
    }
  }, [selectedVariant, selectedColor, allImages, selectedImageIndex, product.variantes, atributos]);

  // Función para manejar selección manual de imágenes
  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  // Resetear a la primera imagen cuando no hay ni variante ni color seleccionados
  useEffect(() => {
    if (!selectedVariant && !selectedColor) {
      setSelectedImageIndex(0);
    }
  }, [selectedVariant, selectedColor]);

  return (
    <div className="flex space-x-4">
      {/* Contenedor de Imágenes Miniatura con Scroll Natural */}
      <div className="flex flex-col">
        {/* Contenedor de miniaturas con scroll invisible */}
        <div 
          ref={scrollContainerRef}
          className="flex flex-col space-y-2 max-h-[600px] overflow-y-auto pr-1 scrollbar-hide"
          style={{ 
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none', /* IE and Edge */
          }}
        >
          {allImages.map((imagen, index) => {
            return (
              <button
                key={index}
                onClick={() => handleImageClick(index)}
                className={`w-20 h-20 overflow-hidden rounded bg-gray-100 border-2 hover:border-gray-300 transition-all relative flex-shrink-0 ${
                  selectedImageIndex === index 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'border-gray-200'
                }`}
              >
                <img
                  src={imagen}
                  alt={`${product.nombre} ${index + 1}`}
                  className="h-full w-full object-cover object-center"
                />
              </button>
            );
          })}
        </div>

        {/* Indicador simple de cantidad de imágenes */}
        {allImages.length > 0 && (
          <div className="mt-2 text-xs text-gray-500 text-center">
            {allImages.length} imagen{allImages.length !== 1 ? 'es' : ''}
          </div>
        )}
      </div>
      
      {/* Imagen Principal */}
      <div className="flex-1 aspect-square overflow-hidden rounded-lg bg-gray-100 relative">
        <img
          src={allImages[selectedImageIndex] || ''}
          alt={product.nombre}
          className="h-full w-full object-contain object-center"
        />
        
      </div>
    </div>
  );
};
