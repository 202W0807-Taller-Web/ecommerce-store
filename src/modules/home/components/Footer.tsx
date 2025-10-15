
import { FaFacebookF, FaInstagram, FaWhatsapp, FaGraduationCap } from 'react-icons/fa';
import { FiShoppingBag } from 'react-icons/fi';

export const Footer = () => {
  return (
    <footer className="bg-foreground text-gray-100">
      {/* Contenido principal del footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Sección izquierda - Logo, descripción y redes sociales */}
          <div className="space-y-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                {/* Logo Icon */}
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center relative">
                  {/* Graduation cap */}
                  <FaGraduationCap className="w-4 h-3 text-foreground" />
                  {/* Shopping bag overlay */}
                  <FiShoppingBag className="absolute -bottom-1 -right-1 w-2 h-3 text-foreground" />
                </div>
              </div>
              
              {/* Brand Text */}
              <span className="text-xl font-bold text-amber-100">
                EzCommerce
              </span>
            </div>

            {/* Descripción */}
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              Una tienda virtual creada para conectar y apoyar a los deportistas desde la comodidad de su casa.
            </p>

            {/* Redes sociales */}
            <div className="flex space-x-3">
              {/* Facebook */}
              <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                <FaFacebookF className="w-4 h-4 text-gray-800" />
              </button>

              {/* Instagram */}
              <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                <FaInstagram className="w-4 h-4 text-gray-800" />
              </button>

              {/* WhatsApp */}
              <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                <FaWhatsapp className="w-4 h-4 text-gray-800" />
              </button>
            </div>
          </div>

          {/* Sección central - Compañía */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Compañía</h3>
              <div className="w-8 h-0.5 bg-gray-400 mb-4"></div>
            </div>
            
            <nav className="space-y-3">
              <button className="block text-gray-300 hover:text-gray-100 transition-colors text-left">
                Nosotros
              </button>
              <button className="block text-gray-300 hover:text-gray-100 transition-colors text-left">
                Términos y condiciones
              </button>
              <button className="block text-gray-300 hover:text-gray-100 transition-colors text-left">
                Soporte
              </button>
            </nav>
          </div>

          {/* Sección derecha - Comunidad */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Comunidad</h3>
              <div className="w-8 h-0.5 bg-gray-400 mb-4"></div>
            </div>
            
            <nav className="space-y-3">
              <button className="block text-gray-300 hover:text-gray-100 transition-colors text-left">
                Reportar problema
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Línea separadora */}
      <div className="border-t border-gray-700"></div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          <p className="text-gray-300 text-sm">
            Copyright @ 2025 EzCommerce. Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  );
};
