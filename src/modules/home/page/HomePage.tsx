import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "../../catalog/components/catalog/ProductCard";
import { ProductCardSkeleton } from "../../catalog/components/skeletons/ProductCardSkeleton";
import {
  ChevronRight,
  TrendingUp,
  Star,
  Zap,
  Shirt,
  Footprints,
  Watch,
} from "lucide-react";
import { useCatalog } from "../../catalog/hooks/useCatalog";

export default function HomePage() {
  const { products, loading, error, fetchProducts } = useCatalog();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [newProducts, setNewProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts({}, { page: 1, limit: 12 });
  }, [fetchProducts]);

  useEffect(() => {
    if (products.data.length > 0) {
      setFeaturedProducts(products.data.slice(0, 4));
      setNewProducts(products.data.slice(4, 12));
    }
  }, [products]);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 via-neutral-600 to-secondary">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full mb-6">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium font-grotesk">
                Nueva Colección 2025
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-base mb-6 font-grotesk">
              Eleva Tu{" "}
              <span className="text-accent">Rendimiento</span>
            </h1>

            <p className="text-xl text-base/80 mb-8 font-dm">
              Descubre nuestra línea premium de ropa deportiva diseñada para
              atletas que buscan lo mejor.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 bg-accent text-neutral-800 px-8 py-4 rounded-lg font-semibold hover:bg-primary transition-all duration-300 shadow-lg hover:shadow-xl font-grotesk"
              >
                Explorar Catálogo
                <ChevronRight className="w-5 h-5" />
              </Link>

              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 bg-base/10 backdrop-blur-sm text-base border-2 border-base/20 px-8 py-4 rounded-lg font-semibold hover:bg-base/20 transition-all duration-300 font-grotesk"
              >
                Ver Ofertas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{
              title: "Ropa",
              description: "Prendas de alto rendimiento",
              icon: Shirt,
              color: "from-accent/20 to-primary/20",
              link: "Ropa",
            },
            {
              title: "Calzado",
              description: "Comodidad en cada paso",
              icon: Footprints,
              color: "from-primary/20 to-secondary/20",
              link: "Calzado",
            },
            {
              title: "Accesorios",
              description: "Completa tu equipamiento",
              icon: Watch,
              color: "from-secondary/20 to-accent/20",
              link: "Accesorios",
            }].map((category, index) => (
              <Link
                key={index}
                to={`/catalog?category=${category.link}`}
                className="group relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-primary/20 bg-white"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.color} group-hover:scale-105 transition-transform duration-300`}
                />
                <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
                  <div className="bg-accent/20 rounded-full p-6 mb-4 group-hover:bg-accent/30 transition-colors duration-300">
                    <category.icon
                      className="w-12 h-12 text-accent"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="text-3xl font-bold text-neutral-800 font-grotesk mb-2">
                    {category.title}
                  </h3>
                  <p className="text-neutral-600 font-dm">
                    {category.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-accent group-hover:gap-2 transition-all duration-300">
                    <span className="text-sm font-medium font-grotesk">
                      Explorar
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 text-accent mb-2">
                <Star className="w-5 h-5 fill-accent" />
                <span className="text-sm font-medium uppercase tracking-wider font-grotesk">
                  Destacados
                </span>
              </div>
              <h2 className="text-4xl font-bold text-neutral-800 font-grotesk">
                Productos Populares
              </h2>
            </div>

            <Link
              to="/catalog"
              className="hidden md:inline-flex items-center gap-2 text-accent hover:text-primary transition-colors font-grotesk font-medium"
            >
              Ver todos
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 text-gray-500 font-dm">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 text-accent hover:text-primary transition-colors font-grotesk font-medium"
            >
              Ver todos los productos
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 text-accent mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wider font-grotesk">
                  Recién llegados
                </span>
              </div>
              <h2 className="text-4xl font-bold text-neutral-800 font-grotesk">
                Nuevos Productos
              </h2>
            </div>

            <Link
              to="/catalog"
              className="hidden md:inline-flex items-center gap-2 text-accent hover:text-primary transition-colors font-grotesk font-medium"
            >
              Ver todos
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 text-gray-500 font-dm">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-secondary via-primary to-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-6 font-grotesk">
            ¿Listo para el próximo nivel?
          </h2>
          <p className="text-xl text-neutral-800/80 mb-8 font-dm">
            Únete a miles de atletas que confían en nuestra marca
          </p>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 bg-neutral-800 text-base px-10 py-5 rounded-lg font-semibold hover:bg-neutral-600 transition-all duration-300 shadow-xl hover:shadow-2xl font-grotesk text-lg"
          >
            Comprar Ahora
            <ChevronRight className="w-6 h-6" />
          </Link>
        </div>
      </section>
    </div>
  );
}
