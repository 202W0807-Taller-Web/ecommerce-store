import { useEffect, useRef, useState, useContext } from 'react';
import { FiX, FiEye, FiEyeOff, FiMail, FiLock, FiChevronDown } from 'react-icons/fi';
import { FaRegAddressCard } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterModal = ({ isOpen, onClose }: RegisterModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    setError(null);
    setIsSubmitting(true);
    
    try {
      await registerUser(formData);
      onClose();
    } catch (error) {
      console.error('Error al registrar:', error);
      const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error al intentar registrarse. Por favor, inténtalo de nuevo.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      // Agregar clase al body cuando el modal está abierto
      document.body.classList.add('modal-open');
      
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      // Remover clase cuando el modal se cierra
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Manejar el clic fuera del modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative my-8 border border-gray-100 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-white px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 font-grotesk">Crear Cuenta</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Cerrar modal"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">Únete a nuestra comunidad</p>
          {error && (
            <div className="mt-2 p-2 bg-red-50 text-red-600 text-sm rounded-md">
              {error}
            </div>
          )}
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
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
                                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EBC431] focus:border-transparent transition-all duration-200 shadow-sm hover:border-[#C0A648]"
                    placeholder="Nombres"
                    required
                  />
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
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EBC431] focus:border-transparent transition-all duration-200 shadow-sm hover:border-[#C0A648]"
                  placeholder="Apellido Paterno"
                  required
                />
              </div>

              {/* Apellido Materno */}
              <div className="relative">
                <input
                  type="text"
                  id="apellido_m"
                  name="apellido_m"
                  value={formData.apellido_m}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EBC431] focus:border-transparent transition-all duration-200 shadow-sm hover:border-[#C0A648]"
                  placeholder="Apellido Materno"
                />
              </div>

              {/* Correo Electrónico */}
              <div className="col-span-2 relative">
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 pl-10 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EBC431] focus:border-transparent transition-all duration-200 shadow-sm hover:border-[#C0A648]"
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
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 pl-10 pr-10 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EBC431] focus:border-transparent transition-all duration-200 shadow-sm hover:border-[#C0A648]"
                  placeholder="Contraseña"
                  required
                />
<FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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

            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">¿Ya tienes una cuenta?</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                navigate('/login');
              }}
              className="w-full mt-6 border border-[#EBC431] text-[#EBC431] hover:bg-gray-50 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              Iniciar sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
};