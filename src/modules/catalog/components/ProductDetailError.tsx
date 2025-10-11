import { Link } from 'react-router-dom';

interface ProductDetailErrorProps {
  error?: string;
  productNotFound?: boolean;
}

export const ProductDetailError = ({ error, productNotFound }: ProductDetailErrorProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-lg mb-4">
          {productNotFound 
            ? 'El producto que buscas no existe o ha sido eliminado.'
            : error || 'Ha ocurrido un error inesperado'
          }
        </div>
        <Link 
          to="/catalog" 
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-acce transition-colors inline-block"
        >
          Volver al Catálogo
        </Link>
      </div>
    </div>
  );
};

