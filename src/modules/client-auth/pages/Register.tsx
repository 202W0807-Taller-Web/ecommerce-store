import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMail, FiLock, FiUser, FiChevronDown, FiEye, FiEyeOff } from 'react-icons/fi';
import { FaRegAddressCard } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { register: registerUser } = useContext(AuthContext)!;
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombres: '',
    apellido_p: '',
    apellido_m: '',
    correo: '',
    contraseña: '',
    tipo_documento: 'DNI',
    nro_documento: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      await registerUser(formData);
      navigate('/');
    } catch (error) {
      console.error('Error al registrar:', error);
      setError('Ocurrió un error al intentar registrarse. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row-reverse bg-gray-50">
      {/* Right Side - Register Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:px-24 lg:py-20">
        
        <div className="w-full max-w-md mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Crear Cuenta</h1>
            <p className="text-gray-600">Únete a nuestra comunidad</p>
          </div>

          <div className="bg-white py-8 px-6 sm:px-10 rounded-xl shadow-sm border border-gray-100">
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Nombres */}
                <div className="col-span-2">
                  <div className="relative">
                    <input
                      type="text"
                      id="nombres"
                      name="nombres"
                      value={formData.nombres}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 pl-11 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EBC431] focus:border-transparent transition-all duration-200 shadow-sm hover:border-[#C0A648]"
                      placeholder="Nombres"
                      required
                    />
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Apellido Paterno */}
                <div className="relative">
                  <input
                    type="text"
                    id="apellido_p"
                    name="apellido_p"
                    value={formData.apellido_p}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 pl-11 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EBC431] focus:border-transparent transition-all duration-200 shadow-sm hover:border-[#C0A648]"
                    placeholder="Apellido Paterno"
                    required
                  />
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>

                {/* Apellido Materno */}
                <div className="relative">
                  <input
                    type="text"
                    id="apellido_m"
                    name="apellido_m"
                    value={formData.apellido_m}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 pl-11 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EBC431] focus:border-transparent transition-all duration-200 shadow-sm hover:border-[#C0A648]"
                    placeholder="Apellido Materno"
                  />
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>

                {/* Correo Electrónico */}
                <div className="col-span-2 relative">
                  <input
                    type="email"
                    id="correo"
                    name="correo"
                    value={formData.correo}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 pl-11 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EBC431] focus:border-transparent transition-all duration-200 shadow-sm hover:border-[#C0A648]"
                    placeholder="Correo Electrónico"
                    required
                  />
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>

                {/* Contraseña */}
                <div className="col-span-2 relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="contraseña"
                    name="contraseña"
                    value={formData.contraseña}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 pl-11 pr-10 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EBC431] focus:border-transparent transition-all duration-200 shadow-sm hover:border-[#C0A648]"
                    placeholder="Contraseña"
                    required
                    minLength={6}
                  />
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? (
                      <FiEyeOff className="w-5 h-5" />
                    ) : (
                      <FiEye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Fila para Tipo de Documento y Número de Documento */}
                <div className="col-span-2 grid grid-cols-5 gap-4">
                  {/* Tipo de Documento */}
                  <div className="relative col-span-2">
                    <div className="relative">
                      <select
                        id="tipo_documento"
                        name="tipo_documento"
                        value={formData.tipo_documento}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 pr-8 text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-[#EBC431] focus:border-transparent transition-all duration-200 shadow-sm hover:border-[#C0A648]"
                      >
                        <option value="DNI">DNI</option>
                        <option value="CE">Carné Ext.</option>
                        <option value="PASAPORTE">Pasaporte</option>
                      </select>
                      <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Número de Documento */}
                  <div className="relative col-span-3">
                    <div className="relative">
                      <input
                        type="text"
                        id="nro_documento"
                        name="nro_documento"
                        value={formData.nro_documento}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 pl-10 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EBC431] focus:border-transparent transition-all duration-200 shadow-sm hover:border-[#C0A648]"
                        placeholder="N° Documento"
                        required
                      />
                      <FaRegAddressCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#EBC431] hover:bg-[#d8b42c] text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creando cuenta...
                    </>
                  ) : (
                    'Crear cuenta'
                  )}
                </button>

                <div className="mt-4 text-center text-sm text-gray-600">
                  ¿Ya tienes una cuenta?{' '}
                  <Link to="/login" className="font-medium text-[#EBC431] hover:text-[#d8b42c] transition-colors">
                    Inicia sesión
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Left Side - Decorative with Background Image */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
        {/* Back Button */}
        <Link 
          to="/" 
          className="absolute top-6 left-6 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-white/90 shadow-md text-gray-500 hover:bg-white hover:text-gray-700 transition-all duration-200"
          aria-label="Volver al inicio"
        >
          <FiArrowLeft className="w-5 h-5" />
        </Link>
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
              ¡Bienvenido!
            </h2>
            <p className="text-white/90 leading-relaxed text-base">
              Crea una cuenta para disfrutar de una experiencia de compra personalizada y acceder a ofertas exclusivas.
            </p>
            <div className="pt-1">
              <Link 
                to="/login"
                className="inline-flex items-center justify-center px-6 py-2.5 border-2 border-transparent text-sm font-medium rounded-lg shadow-sm text-[#EBC431] bg-white hover:bg-gray-50 hover:border-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}