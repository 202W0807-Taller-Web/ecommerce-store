import { useState } from 'react';
import { type ProductFilters, type Atributo } from '../../types';
import { obtenerColorPorNombre } from '../../data/colors';
import { useAtributos } from '../../contexts';

interface FilterMobileProps {
  filters: ProductFilters;
  onFilterChange: (key: keyof ProductFilters, value: unknown) => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
}

// Estados de filtros seleccionados
interface SelectedFilters {
  [atributoNombre: string]: string[];
}

export const FilterMobile = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  onApplyFilters 
}: FilterMobileProps) => {
  const { atributos, loading } = useAtributos();
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});

  const handleFilterToggle = (atributoNombre: string, valor: string) => {
    setSelectedFilters(prev => {
      const currentValues = prev[atributoNombre] || [];
      const isSelected = currentValues.includes(valor);
      
      let newValues;
      if (isSelected) {
        // Remover el valor
        newValues = currentValues.filter(v => v !== valor);
      } else {
        // Agregar el valor
        newValues = [...currentValues, valor];
      }
      
      const result = { ...prev };
      if (newValues.length > 0) {
        result[atributoNombre] = newValues;
      } else {
        delete result[atributoNombre];
      }
      return result;
    });
  };

  const handleApplyFilters = () => {
    // Aplicar todos los filtros seleccionados
    Object.entries(selectedFilters).forEach(([atributoNombre, valores]) => {
      if (valores && valores.length > 0) {
        if (atributoNombre === 'Categoría') {
          onFilterChange('category', valores[0]);
        } else if (atributoNombre === 'Color') {
          onFilterChange('tags', valores);
        }
        // Agregar más mapeos según necesites
      }
    });
    
    onApplyFilters();
  };

  const handleClearAllFilters = () => {
    setSelectedFilters({});
    onClearFilters();
  };

  const isFilterSelected = (atributoNombre: string, valor: string): boolean => {
    return selectedFilters[atributoNombre]?.includes(valor) || false;
  };

  const renderFilterValue = (atributo: Atributo, valor: { id: number; valor: string }) => {
    if (atributo.nombre === 'Color') {
      const colorData = obtenerColorPorNombre(valor.valor);
      const hexColor = colorData?.hex || '#000000';
      const isSelected = isFilterSelected(atributo.nombre, valor.valor);
      
      return (
        <button
          key={valor.id}
          onClick={() => handleFilterToggle(atributo.nombre, valor.valor)}
          className={`
            w-8 h-8 rounded-lg border-2 transition-all duration-200
            ${isSelected 
              ? 'border-primary scale-105 shadow-md ring-2 ring-primary/20' 
              : 'border-primary hover:scale-105 hover:shadow-sm'
            }
            cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1
          `}
          style={{ backgroundColor: hexColor }}
          title={valor.valor}
        />
      );
    }
    
    // Para otros atributos, usar checkboxes
    const isSelected = isFilterSelected(atributo.nombre, valor.valor);
    return (
      <label key={valor.id} className="flex items-center space-x-3 cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => handleFilterToggle(atributo.nombre, valor.valor)}
            className="sr-only"
          />
          <div className={`w-5 h-5 border-2 rounded-md transition-all duration-200 ${
            isSelected 
              ? 'bg-primary border-primary' 
              : 'bg-white border-primary hover:bg-primary/10'
          }`}>
            {isSelected && (
              <svg className="w-4 h-4 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
        <span className={`text-sm transition-colors ${
          isSelected ? 'text-gray-800 font-medium' : 'text-gray-700'
        }`}>
          {valor.valor}
        </span>
      </label>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-primary">Filtros</h3>
      </div>
      
      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Loading state */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-2 text-gray-600">Cargando...</span>
            </div>
          ) : (
            <>
              {/* Filtros dinámicos basados en los atributos */}
              {atributos
                .filter(atributo => atributo.atributoValores && atributo.atributoValores.length > 0)
                .map((atributo) => (
                <div key={atributo.id} className="pb-3">
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    {atributo.nombre}
                  </label>
                  
                  <div className={`max-h-24 overflow-y-auto ${
                    atributo.nombre === 'Color' ? 'grid grid-cols-6 gap-2' : 'space-y-2'
                  }`}>
                    {atributo.atributoValores
                      .filter(valor => valor.valor && valor.valor.trim() !== '')
                      .map((valor) => renderFilterValue(atributo, valor))}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Precio */}
          <div className="pb-4">
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Precio
            </label>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Desde</label>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-2 py-2 text-xs text-gray-600 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                    S/
                  </span>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.priceMin || ''}
                    onChange={(e) => onFilterChange('priceMin', e.target.value ? Number(e.target.value) : undefined)}
                    className="flex-1 px-2 py-2 text-sm border border-gray-300 rounded-r-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Hasta</label>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-2 py-2 text-xs text-gray-600 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                    S/
                  </span>
                  <input
                    type="number"
                    placeholder="100"
                    value={filters.priceMax || ''}
                    onChange={(e) => onFilterChange('priceMax', e.target.value ? Number(e.target.value) : undefined)}
                    className="flex-1 px-2 py-2 text-sm border border-gray-300 rounded-r-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Action Buttons */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <div className="flex gap-2">
          <button
            onClick={handleApplyFilters}
            className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm"
          >
            Aplicar
          </button>
          <button
            onClick={handleClearAllFilters}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm"
          >
            Limpiar
          </button>
        </div>
      </div>
    </div>
  );
};
