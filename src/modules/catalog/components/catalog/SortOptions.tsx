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
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
      );
    } else if (currentSort === 'price_desc') {
      // Precio mayor a menor (descendente) - flecha hacia abajo
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      );
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
