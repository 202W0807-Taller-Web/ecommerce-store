import { type ProductoAtributo } from '../../types';
import { useAtributos } from '../../contexts';

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
  const { atributos } = useAtributos();

  if (attributes.length === 0) {
    return null;
  }

  // Función para obtener el nombre del atributo por su valor ID
  const getAttributeName = (atributoValorId: number): string => {
    const atributo = atributos.find(attr => 
      attr.atributoValores.some(valor => valor.id === atributoValorId)
    );
    return atributo?.nombre || 'Atributo';
  };

  // Función para obtener el valor del atributo por su valor ID
  const getAttributeValue = (atributoValorId: number): string => {
    for (const atributo of atributos) {
      const valor = atributo.atributoValores.find(valor => valor.id === atributoValorId);
      if (valor) return valor.valor;
    }
    return 'N/A';
  };

  return (
    <div className={`bg-gray-50 p-4 rounded-lg ${className}`}>
      <h4 className="text-sm font-medium text-gray-900 mb-3">
        {title}
      </h4>
      <div className="space-y-2">
        {attributes.map(attribute => (
          <div key={attribute.id} className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {getAttributeName(attribute.atributoValorId)}:
            </span>
            <span className="text-sm font-medium text-gray-900">
              {attribute.atributoValor || getAttributeValue(attribute.atributoValorId)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
