import { type ProductoAtributo } from '../../types';

interface ProductAttributesProps {
  attributes: ProductoAtributo[];
  title?: string;
  className?: string;
}

export const ProductAttributes = ({ 
  attributes, 
  title = "Características del Producto",
  className = ""
}: ProductAttributesProps) => {
  if (attributes.length === 0) {
    return null;
  }

  return (
    <div className={`bg-gray-50 p-4 rounded-lg ${className}`}>
      <h4 className="text-sm font-medium text-gray-900 mb-3">
        {title}
      </h4>
      <div className="space-y-2">
        {attributes.map(attribute => (
          <div key={attribute.id} className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {attribute.nombre}:
            </span>
            <span className="text-sm font-medium text-gray-900">
              {attribute.valor}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
