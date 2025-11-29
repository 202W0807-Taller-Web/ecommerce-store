import { FiChevronUp, FiChevronDown } from 'react-icons/fi';

interface SortOptionsProps {
  currentSort: string;
  onSortChange: (sort: string) => void;
}

export const SortOptions = ({ currentSort, onSortChange }: SortOptionsProps) => {
  const handlePriceSort = () => {
    if (currentSort === 'price asc') {
      onSortChange('price desc');
    } else if (currentSort === 'price desc') {
      onSortChange(''); // Desactivar sort
    } else {
      onSortChange('price asc');
    }
  };

  const getPriceIcon = () => {
    if (currentSort === 'price asc') {
      return <FiChevronUp className="w-4 h-4" />;
    } else if (currentSort === 'price desc') { 
      return <FiChevronDown className="w-4 h-4" />;
    }
    return null;
  };

  const isPriceSelected = currentSort === 'price asc' || currentSort === 'price desc';

  return (
    <div className="px-4 ">
      <div className="flex items-center justify-end space-x-4">
        <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
        <div className="flex space-x-1">
          <button
           data-testid="sort-select"
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
        </div>
      </div>
    </div>
  );
};
