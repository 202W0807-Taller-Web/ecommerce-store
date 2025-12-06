import { useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';

interface SearchAutocompleteProps {
  suggestions: string[];
  loading: boolean;
  show: boolean;
  onSelect: (suggestion: string) => void;
  onClose: () => void;
  searchQuery: string;
}

export const SearchAutocomplete = ({
  suggestions,
  loading,
  show,
  onSelect,
  onClose,
  searchQuery,
}: SearchAutocompleteProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, onClose]);

  if (!show) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      data-testid="search-autocomplete"
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto"
    >
      {loading ? (
        <div className="px-4 py-3 text-sm text-gray-500 flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span>Buscando...</span>
        </div>
      ) : suggestions.length > 0 ? (
        <ul className="py-2">
          {suggestions.map((suggestion, index) => (
            <li key={`${suggestion}-${index}`}>
              <button
                data-testid={`autocomplete-item-${index}`}
                onClick={() => onSelect(suggestion)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors group"
              >
                <FaSearch className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                <span className="text-sm text-gray-700 group-hover:text-primary">
                  {highlightMatch(suggestion, searchQuery)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : searchQuery.trim().length >= 2 ? (
        <div className="px-4 py-3 text-sm text-gray-500">
          No se encontraron sugerencias
        </div>
      ) : null}
    </div>
  );
};

/**
 * Resaltar coincidencias en el texto
 */
const highlightMatch = (text: string, query: string) => {
  if (!query.trim()) {
    return <span>{text}</span>;
  }

  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <strong key={index} className="font-semibold text-primary">
            {part}
          </strong>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
};