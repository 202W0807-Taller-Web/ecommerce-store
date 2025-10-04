interface SortOptionsProps {
  currentSort: string;
  onSortChange: (sort: string) => void;
}

export const SortOptions = ({ currentSort, onSortChange }: SortOptionsProps) => {
  const sortOptions = [
    { value: 'price', label: 'Precio', selected: currentSort === 'price' },
    { value: 'relevance', label: 'Relevancia', selected: currentSort === 'relevance' },
    { value: 'orders', label: 'Pedidos', selected: currentSort === 'orders' },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
        <div className="flex space-x-1">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center space-x-2 ${
                option.selected
                  ? 'bg-[#003669] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{option.label}</span>
              {option.value === 'price' && option.selected && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
