import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProductDetail } from "../hooks/useProductDetail";
import { Layout } from "../components/Layout";

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error, fetchProductDetail } = useProductDetail();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProductDetail(Number(id));
    }
  }, [id, fetchProductDetail]);

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-gray-500 transition duration-150 ease-in-out">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Cargando producto...
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Error" subtitle="Hubo un problema al cargar el producto">
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <Link 
            to="/catalog" 
            className="px-6 py-2 bg-[#003669] text-white rounded-lg hover:bg-blue-800 transition-colors inline-block"
          >
            Volver al Catálogo
          </Link>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout title="Producto no encontrado" subtitle="El producto que buscas no existe">
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">
            El producto que buscas no existe o ha sido eliminado.
          </div>
          <Link 
            to="/catalog" 
            className="px-6 py-2 bg-[#003669] text-white rounded-lg hover:bg-blue-800 transition-colors inline-block"
          >
            Volver al Catálogo
          </Link>
        </div>
      </Layout>
    );
  }

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Layout showHeader={false}>
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-[#003669] transition-colors">Inicio</Link>
        <span>›</span>
        <Link to="/catalog" className="hover:text-[#003669] transition-colors">Catálogo</Link>
        <span>›</span>
        <span className="text-gray-700">{product.category}</span>
        <span>›</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        
        {/* Galería de imágenes */}
        <section className="space-y-4">
          {/* Imagen principal */}
          <div className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-white">
            <img
              src={product.images[selectedImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Miniaturas */}
          <div className="grid grid-cols-4 gap-3">
            {product.images.slice(0, 4).map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                  selectedImageIndex === index 
                    ? 'border-[#003669]' 
                    : 'border-gray-200 hover:border-gray-300'
                } bg-white`}
              >
                <img
                  src={image}
                  alt={`${product.name} vista ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </section>

        {/* Información del producto */}
        <section className="space-y-6">
          
          {/* Header */}
          <header>
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
             
              <span>•</span>
              <Link to={`/catalog?category=${encodeURIComponent(product.category)}`} className="hover:text-[#003669] transition-colors">
                {product.category}
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-[#003669] leading-tight">
              {product.name}
            </h1>
          </header>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <span className="text-yellow-400">⭐</span>
              <span className="ml-1 text-lg font-semibold">{product.rating}</span>
            </div>
            <span className="text-gray-500">({product.reviewCount} reseñas)</span>
          </div>

          {/* Precios */}
          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-[#003669]">
              ${product.price}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
                <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  -{discountPercentage}%
                </span>
              </>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center space-x-2">
            {product.inStock ? (
              <div className="flex items-center space-x-2 text-green-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">En stock ({product.stockCount} unidades disponibles)</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-red-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Agotado</span>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex space-x-4">
            <button 
              disabled={!product.inStock}
              className="flex-1 bg-[#003669] hover:bg-blue-800 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
          Agregar al Carrito
            </button>
            <button 
              disabled={!product.inStock}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Comprar Ahora
            </button>
          </div>

          {/* Descripción */}
          <div>
            <h3 className="text-lg font-semibold text-[#003669] mb-3">Descripción</h3>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Características */}
          <div>
            <h3 className="text-lg font-semibold text-[#003669] mb-3">Características Destacadas</h3>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2 text-gray-700">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* Especificaciones */}
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-[#003669] mb-6">Especificaciones del Producto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(product.specifications).map(([key, value]) => (
            <div key={key} className="border-b border-gray-100 pb-3">
              <dt className="text-sm font-medium text-gray-900 mb-1">{key}</dt>
              <dd className="text-sm text-gray-700">{value}</dd>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetailPage;