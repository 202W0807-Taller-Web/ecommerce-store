import React from 'react';

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
  total
}: PaginationProps) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, total);

  if (totalPages <= 1) return null;

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
    <div className="bg-white px-4 py-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        
        {/* Items per page selector */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">
            Mostrar:
          </label>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#003669] focus:border-[#003669]"
          >
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={48}>48</option>
          </select>
          <span className="text-sm text-gray-500">por página</span>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-600">
          Mostrando {startItem} - {endItem} de {total} productos
        </p>

        {/* Page navigation */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Anterior
          </button>

          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                page === currentPage
                  ? 'bg-[#003669] text-white'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};
