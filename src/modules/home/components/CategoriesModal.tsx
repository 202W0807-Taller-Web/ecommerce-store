import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Atributo } from '../../catalog/types';
import { useAtributos } from '../../catalog/contexts';

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CategoriesModal = ({ isOpen, onClose }: CategoriesModalProps) => {
  const navigate = useNavigate();
  const [hoveredAttribute, setHoveredAttribute] = useState<Atributo | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const { atributos, loading, error } = useAtributos();

  // Filtrar atributos para categorías
  const filteredAttributes = atributos.filter(attr => {
    // Excluir atributos que no son categorías
    const excludedAttributes = [
      'Talla', 'Color', 'Unidad medida', 'Medida', 'Size', 'Colour', 
      'Tamaño', 'Dimension', 'Peso', 'Weight', 'Material', 'Marca'
    ];
    
    // Convertir a minúsculas para comparación case-insensitive
    const attrNameLower = attr.nombre.toLowerCase();
    const isExcluded = excludedAttributes.some(excluded => 
      excluded.toLowerCase() === attrNameLower
    );
    
    // Excluir si está en la lista de excluidos
    if (isExcluded) return false;
    
    // Excluir si no tiene valores o tiene valores vacíos
    if (!attr.atributoValores || attr.atributoValores.length === 0) return false;
    
    // Excluir si todos los valores están vacíos o son null
    const hasValidValues = attr.atributoValores.some(valor => 
      valor.valor && valor.valor.trim() !== ''
    );
    
    return hasValidValues;
  });

  const handleAttributeClick = (attribute: Atributo) => {
    // Navegar al catálogo con el atributo seleccionado
    const searchParams = new URLSearchParams();
    searchParams.set('category', attribute.nombre);
    
    navigate(`/catalog?${searchParams.toString()}`);
    onClose();
  };

  const handleValueClick = (attribute: Atributo, value: string) => {
    // Navegar al catálogo con el valor específico seleccionado
    const searchParams = new URLSearchParams();
    searchParams.set('category', attribute.nombre);
    searchParams.set('value', value);
    
    navigate(`/catalog?${searchParams.toString()}`);
    onClose();
  };

  // Función mejorada para manejar el hover con delay
  const handleMouseEnter = (attribute: Atributo) => {
    // Limpiar timeout anterior si existe
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    
    // Establecer inmediatamente el hover
    setHoveredAttribute(attribute);
  };

  const handleMouseLeave = () => {
    // Agregar un delay más largo para permitir movimiento entre botón y panel
    const timeout = setTimeout(() => {
      setHoveredAttribute(null);
    }, 300); // 300ms de delay para mejor UX
    
    setHoverTimeout(timeout);
  };

  // Limpiar timeout al desmontar
  const handleClose = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    setHoveredAttribute(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)'
        }}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Categorías</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div 
            className="flex"
            onMouseEnter={() => {
              // Mantener hover activo cuando el mouse está en el área de contenido
              if (hoverTimeout) clearTimeout(hoverTimeout);
            }}
            onMouseLeave={handleMouseLeave}
          >
            {/* Left Sidebar - Attributes List */}
            <div className="w-64 bg-gray-50 border-r border-gray-200">
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                  Categorías
                </h3>
                
                {/* Loading State */}
                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="ml-2 text-sm text-gray-600">Cargando categorías...</span>
                  </div>
                )}
                
                {/* Error State */}
                {error && (
                  <div className="text-center py-8">
                    <div className="text-red-500 text-sm mb-2">{error}</div>
                    <button 
                      onClick={() => window.location.reload()} 
                      className="text-xs text-primary hover:underline"
                    >
                      Recargar
                    </button>
                  </div>
                )}
                
                {/* Empty State */}
                {!loading && !error && filteredAttributes.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-gray-500 text-sm">No hay categorías disponibles</div>
                  </div>
                )}
                
                {/* Attributes List */}
                {!loading && !error && filteredAttributes.length > 0 && (
                  <nav className="space-y-1">
                    {filteredAttributes.map((attribute) => (
                    <button
                      key={attribute.id}
                      onClick={() => handleAttributeClick(attribute)}
                      onMouseEnter={() => handleMouseEnter(attribute)}
                      onMouseLeave={handleMouseLeave}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-between transform ${
                        hoveredAttribute?.id === attribute.id
                          ? 'bg-primary text-white scale-[1.02] shadow-md'
                          : 'text-gray-700 hover:bg-gray-100 hover:scale-[1.01]'
                      }`}
                    >
                      <span className="transition-colors duration-200">{attribute.nombre}</span>
                      <div className={`transition-all duration-200 ${
                        hoveredAttribute?.id === attribute.id 
                          ? 'opacity-100 translate-x-0' 
                          : 'opacity-0 -translate-x-2'
                      }`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                    ))}
                  </nav>
                )}
              </div>
            </div>

            {/* Right Panel - Values for Hovered Attribute */}
            {hoveredAttribute && (
              <div 
                className="flex-1 p-6 animate-in slide-in-from-right duration-300"
                onMouseEnter={() => {
                  if (hoverTimeout) clearTimeout(hoverTimeout);
                }}
                onMouseLeave={handleMouseLeave}
              >
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-2xl font-bold text-primary animate-in fade-in duration-300">
                    {hoveredAttribute.nombre}
                  </h4>
                  <button
                    onClick={() => {
                      if (hoverTimeout) clearTimeout(hoverTimeout);
                      setHoveredAttribute(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Values Grid */}
                <div className="grid grid-cols-3 gap-6">
                  {hoveredAttribute.atributoValores
                    .filter(value => value.valor && value.valor.trim() !== '')
                    .map((value, index) => (
                    <div 
                      key={value.id} 
                      className="space-y-2 animate-in fade-in duration-300"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <button
                        onClick={() => handleValueClick(hoveredAttribute, value.valor)}
                        className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all duration-200 group transform hover:scale-[1.02] hover:shadow-md"
                      >
                        <h5 className="font-medium text-gray-900 group-hover:text-primary transition-colors duration-200">
                          {value.valor}
                        </h5>
                      </button>
                    </div>
                  ))}
                </div>


              </div>
            )}

            {/* Empty State when no attribute is hovered */}
            {!hoveredAttribute && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Selecciona una categoría
                  </h3>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
