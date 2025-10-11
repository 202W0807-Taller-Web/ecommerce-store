import { FiChevronUp, FiChevronDown } from 'react-icons/fi';

interface SortOptionsProps {
  currentSort: string;
  onSortChange: (sort: string) => void;
}

export const SortOptions = ({ currentSort, onSortChange }: SortOptionsProps) => {
  const sortOptions = [
    { value: 'relevance', label: 'Relevancia', selected: currentSort === 'relevance' },
    { value: 'orders', label: 'Pedidos', selected: currentSort === 'orders' },
  ];

  const handlePriceSort = () => {
    // Alternar entre precio ascendente y descendente
    if (currentSort === 'price_asc') {
      onSortChange('price_desc');
    } else {
      onSortChange('price_asc');
    }
  };

  const getPriceIcon = () => {
    if (currentSort === 'price_asc') {
      // Precio menor a mayor (ascendente) - flecha hacia arriba
      return <FiChevronUp className="w-4 h-4" />;
    } else if (currentSort === 'price_desc') {
      // Precio mayor a menor (descendente) - flecha hacia abajo
      return <FiChevronDown className="w-4 h-4" />;
    }
    return null;
  };

  const isPriceSelected = currentSort === 'price_asc' || currentSort === 'price_desc';

  return (
    <div className="px-4 ">
      <div className="flex items-center justify-end space-x-4">
        <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
        <div className="flex space-x-1">
          {/* Botón de Precio separado */}
          <button
            onClick={handlePriceSort}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center space-x-2 ${
              isPriceSelected
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>Precio</span>
            {isPriceSelected && getPriceIcon()}
          </button>

          {/* Otros botones de ordenamiento */}
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center space-x-2 ${
                option.selected
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
