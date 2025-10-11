import { useState, useEffect, useRef } from 'react';
import { type ProductWithUI, type Variante } from '../../types';
import './ProductGallery.css';

interface ProductGalleryProps {
  product: ProductWithUI;
  selectedVariant?: Variante | null;
  selectedColor?: string | null;
}

export const ProductGallery = ({ product, selectedVariant, selectedColor }: ProductGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Obtener imágenes únicas por color (una por color + imágenes del producto)
  const getUniqueImagesByColor = () => {
    const images = [...product.productoImagenes.map(img => img.imagen)];
    const colorImages = new Map<string, string>();
    
    console.log('🖼️ ProductGallery - Imágenes base del producto:', images.length);
    
    // Agrupar variantes por color y tomar solo una imagen por color
    product.variantes.forEach(variant => {
      const colorAttr = variant.varianteAtributos.find(attr => 
        ['Negro', 'Blanco', 'Azul', 'Rojo'].includes(attr.atributoValor)
      );
      
      if (colorAttr && variant.varianteImagenes.length > 0) {
        const color = colorAttr.atributoValor;
        if (!colorImages.has(color)) {
          colorImages.set(color, variant.varianteImagenes[0].imagen);
          console.log(`🎨 ProductGallery - Agregando imagen para color ${color}:`, variant.varianteImagenes[0].imagen);
        }
      }
    });
    
    // Agregar imágenes de colores únicos
    colorImages.forEach(imageUrl => {
      if (!images.includes(imageUrl)) {
        images.push(imageUrl);
        console.log('🖼️ ProductGallery - Agregando imagen de variante:', imageUrl);
      }
    });
    
    console.log('🖼️ ProductGallery - Total de imágenes disponibles:', images.length);
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
    console.log('🖼️ ProductGallery - useEffect triggered:', {
      hasSelectedVariant: !!selectedVariant,
      selectedColor,
      variantId: selectedVariant?.id,
      currentSelectedIndex: selectedImageIndex,
      totalImages: allImages.length
    });

    let targetImageUrl: string | null = null;

    // Prioridad 1: Si hay variante seleccionada, usar su imagen
    if (selectedVariant && selectedVariant.varianteImagenes.length > 0) {
      targetImageUrl = selectedVariant.varianteImagenes[0].imagen;
      console.log('🎨 ProductGallery - Usando imagen de variante:', targetImageUrl);
    }
    // Prioridad 2: Si no hay variante pero sí color, usar imagen del color
    else if (selectedColor) {
      // Función para obtener la imagen de un color específico
      const getImageForColor = (color: string) => {
        const variantWithColor = product.variantes.find(variant => 
          variant.varianteAtributos.some(attr => attr.atributoValor === color)
        );
        
        if (variantWithColor && variantWithColor.varianteImagenes.length > 0) {
          return variantWithColor.varianteImagenes[0].imagen;
        }
        return null;
      };
      
      targetImageUrl = getImageForColor(selectedColor);
      console.log('🎨 ProductGallery - Usando imagen de color:', selectedColor, targetImageUrl);
    }

    if (targetImageUrl) {
      const targetImageIndex = allImages.findIndex(img => img === targetImageUrl);
      
      console.log('🖼️ ProductGallery - Buscando imagen:', {
        targetImageUrl,
        targetImageIndex,
        currentIndex: selectedImageIndex
      });
      
      if (targetImageIndex !== -1 && targetImageIndex !== selectedImageIndex) {
        setSelectedImageIndex(targetImageIndex);
        
        // Hacer scroll a la imagen después de un pequeño delay
        setTimeout(() => {
          scrollToImage(targetImageIndex);
        }, 100);
        
        console.log('🖼️ ProductGallery - Cambiando imagen:', {
          source: selectedVariant ? 'variante' : 'color',
          targetImageUrl,
          imageIndex: targetImageIndex,
          totalImages: allImages.length
        });
      } else {
        console.log('🖼️ ProductGallery - No se cambió la imagen:', {
          targetImageIndex,
          currentIndex: selectedImageIndex,
          reason: targetImageIndex === -1 ? 'imagen no encontrada' : 'ya está seleccionada'
        });
      }
    } else {
      console.log('🖼️ ProductGallery - No hay imagen objetivo (sin variante ni color)');
    }
  }, [selectedVariant, selectedColor, allImages, selectedImageIndex, product.variantes]);

  // Función para manejar selección manual de imágenes
  const handleImageClick = (index: number) => {
    console.log('🖼️ ProductGallery - Selección manual de imagen:', {
      imageIndex: index,
      totalImages: allImages.length,
      source: 'manual click'
    });
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
