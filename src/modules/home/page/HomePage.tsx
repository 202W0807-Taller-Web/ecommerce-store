import { Link } from "react-router-dom";
import ProductCard from "../../../components/ProductCard";
import { useProducts } from "../../../hooks/useProducts";

export default function HomePage() {
  const { products, loading, error } = useProducts();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-2xl shadow-lg p-8 text-center">
        <h1 className="text-4xl font-extrabold mb-4">Bienvenido a la Tienda</h1>
        <p className="text-lg mb-6">
          Explora nuestra colección y encuentra productos increíbles al mejor precio.
        </p>
        <Link
          to="/products"
          className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-100 transition"
        >
          Ver Todos los Productos
        </Link>
      </section>

      {/* Productos Destacados */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Productos Destacados</h2>

        {loading && <p className="text-gray-500">Cargando productos...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
