import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  total: number;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  total: _total // eslint-disable-line @typescript-eslint/no-unused-vars
}: PaginationProps) => {
  // Variables calculadas para información de productos
  // const startItem = (currentPage - 1) * itemsPerPage + 1;
  // const endItem = Math.min(currentPage * itemsPerPage, total);

  // Mostrar información de productos incluso si solo hay 1 página
  if (totalPages <= 1) {
    return (
      <div className="bg-white px-4 py-6 ">
        <div className="flex items-center justify-between">
          {/* Items per page selector */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">
              Mostrar:
            </label>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            >
                <option value={6}>6</option>
                <option value={9}>9</option>
                <option value={15}>15</option>
                <option value={24}>24</option>
            </select>
            <span className="text-sm text-gray-500">por página</span>
          </div>

          {/* No navigation buttons for single page */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Página 1 de 1</span>
          </div>
        </div>
      </div>
    );
  }

  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
    let page;
    if (totalPages <= 5) {
      page = idx + 1;
    } else if (currentPage <= 3) {
      page = idx + 1;
    } else if (currentPage >= totalPages - 2) {
      page = totalPages - 4 + idx;
    } else {
      page = currentPage - 2 + idx;
    }
    return page;
  });

  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between">
        
        {/* Items per page selector */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">
            Mostrar:
          </label>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
          >
                <option value={3}>3</option>
                <option value={9}>9</option>
                <option value={15}>15</option>
                <option value={24}>24</option>
          </select>
          <span className="text-sm text-gray-500">por página</span>
        </div>


        {/* Page navigation */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Página anterior"
          >
            <FiChevronLeft className="w-4 h-4" />
          </button>

          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                page === currentPage
                  ? 'bg-primary text-white'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Página siguiente"
          >
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
