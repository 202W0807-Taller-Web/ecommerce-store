import { useFavorites } from '../hooks/useFavorites';
import { ProductCard } from '../components/catalog/ProductCard';
import { ProductCardSkeleton } from '../components/skeletons/ProductCardSkeleton';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { RegisterModal } from '../../client-auth/components/RegisterModal';
import { Heart, ShoppingBag, Sparkles, ArrowRight, RefreshCw } from 'lucide-react';

export const FavoritesPage = () => {
  const { favorites, isLoading, error, isAuthenticated, refreshFavorites } = useFavorites();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleLoginRequired = () => {
    setShowRegisterModal(true);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshFavorites();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Estado no autenticado
  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen bg-white to-gray-50 flex items-center justify-center px-4">
          <div className="text-center max-w-lg">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-red-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-red-50 to-pink-50 rounded-full p-8 shadow-lg">
                <Heart className="w-24 h-24 text-red-400 animate-pulse" strokeWidth={1.5} />
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-grotesk">
              Guarda tus favoritos
            </h2>
            <p className="text-lg text-gray-600 mb-8 font-dm">
              Inicia sesión para guardar tus productos favoritos y acceder a ellos desde cualquier dispositivo
            </p>
            
            <button
              onClick={() => setShowRegisterModal(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-accent to-primary text-neutral-800 font-semibold py-4 px-8 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-grotesk"
            >
              <Heart className="w-5 h-5" />
              Iniciar sesión
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto">
              {/*
                { icon: Heart, label: 'Guarda favoritos' },
                { icon: ShoppingBag, label: 'Compra rápido' },
                { icon: Sparkles, label: 'Ofertas exclusivas' }
              */}
            </div>
          </div>
        </div>
        <RegisterModal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)} />
      </>
    );
  }

  // Estado de carga
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 mb-6">
            <div className="bg-red-100 rounded-full p-4 inline-block mb-4">
              <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-red-900 mb-2 font-grotesk">Error al cargar favoritos</h3>
            <p className="text-red-700 mb-6 font-dm">{error}</p>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-grotesk"
            >
              <RefreshCw className="w-4 h-4" />
              Reintentar
            </button>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-accent to-primary text-neutral-800 font-medium py-3 px-6 rounded-lg hover:shadow-lg transition-all font-grotesk"
            >
              <ShoppingBag className="w-4 h-4" />
              Ir al catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Estado vacío
  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl opacity-50"></div>
            <div className="relative bg-gradient-to-br from-gray-100 to-gray-50 rounded-full p-8 shadow-lg">
              <Heart className="w-24 h-24 text-gray-300" strokeWidth={1.5} />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-grotesk">
            Aún no tienes favoritos
          </h2>
          <p className="text-lg text-gray-600 mb-8 font-dm">
            Explora nuestro catálogo y guarda los productos que más te gusten haciendo clic en el 
            <Heart className="w-5 h-5 inline mx-1 text-red-400" strokeWidth={2} />
          </p>
          
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-accent to-primary text-neutral-800 font-semibold py-4 px-8 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-grotesk"
          >
            <ShoppingBag className="w-5 h-5" />
            Explorar productos
            <ArrowRight className="w-5 h-5" />
          </Link>

          <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 max-w-md mx-auto">
            <h3 className="font-semibold text-gray-900 mb-3 font-grotesk">¿Sabías que?</h3>
            <ul className="space-y-2 text-sm text-gray-600 text-left font-dm">
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span>Tus favoritos se sincronizan en todos tus dispositivos</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span>Recibe notificaciones cuando bajen de precio</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span>Comparte tu lista con amigos y familia</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Vista con favoritos
  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-3">
                  <Heart className="w-6 h-6 text-red-500" fill="currentColor" strokeWidth={1.5} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 font-grotesk">Mis Favoritos</h1>
                  <p className="text-gray-600 mt-1 font-dm">
                    {favorites.length} {favorites.length === 1 ? 'producto guardado' : 'productos guardados'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 font-grotesk"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Actualizar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-gradient-to-r from-accent/10 via-primary/10 to-accent/10 rounded-xl p-4 border border-accent/20">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-accent flex-shrink-0" />
              <p className="text-sm text-gray-700 font-dm">
                <strong className="font-semibold">¡Genial!</strong> Tus productos favoritos están guardados. 
                Te notificaremos si hay cambios de precio o promociones especiales.
              </p>
            </div>
          </div>
        </div>

        {/* Grid de productos */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                onLoginRequired={handleLoginRequired}
              />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gradient-to-r from-secondary via-primary to-accent rounded-2xl p-8 text-center shadow-lg">
            <h3 className="text-2xl font-bold text-neutral-800 mb-3 font-grotesk">
              ¿Buscas más productos?
            </h3>
            <p className="text-neutral-800/80 mb-6 font-dm">
              Explora nuestro catálogo completo y encuentra exactamente lo que necesitas
            </p>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 bg-neutral-800 text-white font-semibold py-3 px-6 rounded-lg hover:bg-neutral-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-grotesk"
            >
              <ShoppingBag className="w-5 h-5" />
              Ver catálogo completo
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <RegisterModal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)} />
    </>
  );
};