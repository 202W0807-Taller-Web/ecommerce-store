import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor ingresa tu correo y contraseña');
      return;
    }

    try {
      setIsLoading(true);
      await login({ correo: email, contraseña: password });
      navigate('/'); // Redirigir al dashboard o página principal después del login
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:px-24 lg:py-20 relative">
        {/* Back Button */}
        <Link 
          to="/" 
          className="absolute top-6 left-6 md:top-8 md:left-12 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200"
          aria-label="Volver al inicio"
        >
          <FiArrowLeft className="w-5 h-5" />
        </Link>
        
        <div className="w-full max-w-md mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido de vuelta</h1>
            <p className="text-gray-600">Inicia sesión para continuar</p>
          </div>

        <div className="bg-white py-8 px-6 sm:px-10 rounded-xl shadow-sm border border-gray-100">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-2 focus:ring-[#EBC431] focus:border-[#EBC431] block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none transition-all duration-200 sm:text-sm"
                  placeholder="tucorreo@ejemplo.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <Link 
                  to="/forgot-password" 
                  className="text-xs font-medium text-[#EBC431] hover:text-[#d8b42c] transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-2 focus:ring-[#EBC431] focus:border-[#EBC431] block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none transition-all duration-200 sm:text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5" />
                  ) : (
                    <FiEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#EBC431] hover:bg-[#d8b42c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EBC431] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </div>
          </form>

          {/* Mobile sign up link */}
          <div className="mt-8 md:hidden text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="font-medium text-[#EBC431] hover:text-[#d8b42c] transition-colors">
                Regístrate
              </Link>
            </p>
          </div>
          </div>
        </div>
      </div>
      
      {/* Right Side - Decorative with Background Image */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/src/assets/buy-online-ecommerce-parcel-box-s27djx84qkdna93g.jpg')"
          }}
        >
          {/* Yellow Overlay */}
          <div className="absolute inset-0 bg-[#EBC431] bg-opacity-90 mix-blend-multiply"></div>
        </div>
        
        {/* Content */}
        <div className="relative w-full h-full flex items-center justify-center p-8 z-10">
          <div className="max-w-xs mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold text-white leading-tight">
              ¿Nuevo aquí?
            </h2>
            <p className="text-white/90 leading-relaxed text-base">
              Únete a nuestra comunidad y descubre todas las ventajas de tener una cuenta en nuestro e-commerce.
            </p>
            <div className="pt-1">
              <Link 
                to="/register"
                className="inline-flex items-center justify-center px-6 py-2.5 border-2 border-transparent text-sm font-medium rounded-lg shadow-sm text-[#EBC431] bg-white hover:bg-gray-50 hover:border-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Crear Cuenta
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}