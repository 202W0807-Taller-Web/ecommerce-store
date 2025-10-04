import { type ProductFilters } from '../types';

interface FilterSidebarProps {
  filters: ProductFilters;
  onFilterChange: (key: keyof ProductFilters, value: any) => void;
  onClearFilters: () => void;
}

const categories = [
  { id: 'electronics', name: 'Electrónica', checked: true },
  { id: 'fashion', name: 'Moda', checked: false },
  { id: 'video-games', name: 'Videojuegos', checked: false },
  { id: 'technology', name: 'Tecnología', checked: false },
  { id: 'footwear', name: 'Calzado', checked: false },
  { id: 'home-appliances', name: 'Electrohogar', checked: false },
];

const sizes = ['XS', 'XXS', 'S', 'M', 'L', 'XL'];

const colors = [
  { name: 'Negro', bg: 'bg-black', selected: false },
  { name: 'Verde', bg: 'bg-green-500', selected: false },
  { name: 'Rojo', bg: 'bg-red-500', selected: false },
  { name: 'Amarillo', bg: 'bg-yellow-400', selected: false },
  { name: 'Turquesa', bg: 'bg-teal-400', selected: false },
  { name: 'Burgundy', bg: 'bg-red-800', selected: false },
  { name: 'Dorado', bg: 'bg-yellow-600', selected: false },
];

export const FilterSidebar = ({ filters, onFilterChange, onClearFilters }: FilterSidebarProps) => {
  return (
    <aside className="bg-white p-6">
      {/* Title */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#003669]">Filtro</h3>
      </div>
      
      <div className="space-y-8">
        
        {/* Categorías */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Categorías
          </label>
          <div className="space-y-3">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={category.checked}
                  onChange={(e) => onFilterChange('category', e.target.checked ? category.name : undefined)}
                  className="w-4 h-4 text-[#003669] bg-gray-100 border-gray-300 rounded focus:ring-[#003669] dark:focus:ring-[#003669] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm text-gray-900">{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Talla */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Talla
          </label>
          <div className="grid grid-cols-2 gap-2">
            {sizes.map((size) => (
              <label key={size} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="size"
                  value={size}
                  className="w-4 h-4 text-[#003669] bg-gray-100 border-gray-300 focus:ring-[#003669] dark:focus:ring-[#003669] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm text-gray-900">{size}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Color
          </label>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
              <button
                key={color.name}
                className={`w-8 h-8 rounded-full border-2 ${color.bg} ${
                  color.selected ? 'ring-2 ring-[#003669]' : 'border-gray-300'
                } hover:ring-2 hover:ring-[#003669] transition-all`}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Precio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Precio
          </label>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Desde</label>
              <input
                type="number"
                placeholder="S/ 0.00"
                value={filters.priceMin || ''}
                onChange={(e) => onFilterChange('priceMin', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#003669] focus:border-[#003669]"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Hasta</label>
              <input
                type="number"
                placeholder="S/ 100.00"
                value={filters.priceMax || ''}
                onChange={(e) => onFilterChange('priceMax', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#003669] focus:border-[#003669]"
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
