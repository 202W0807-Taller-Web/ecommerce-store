import { useContext, useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import {
  FiUser, FiShoppingBag, FiHeart,
  FiCreditCard, FiMapPin, FiBell, FiLogOut, FiSettings,
  FiChevronRight
} from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
}

// Componente para los ítems del menú
const MenuItem = ({
  icon,
  text,
  onClick,
  showArrow = false
}: {
  icon: ReactNode;
  text: string;
  onClick: () => void;
  showArrow?: boolean;
}) => (
  <li>
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 text-left"
    >
      <span className="flex items-center">
        <span className="text-gray-400 mr-3">
          {icon}
        </span>
        {text}
      </span>
      {showArrow && <FiChevronRight className="text-gray-400 w-4 h-4" />}
    </button>
  </li>
);

const formatToDDMMYYYY = (dateString: string) => {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("T")[0].split("-");
  return `${day}/${month}/${year}`;
};

export const ProfileModal = ({ isOpen, onClose, anchorEl }: ProfileModalProps) => {
  const { user, logout } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar el menú al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
        anchorEl && !anchorEl.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, anchorEl]);

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0, width: 320 });

  // Función para actualizar solo la posición horizontal del menú
  const updateHorizontalPosition = useCallback(() => {
    if (!anchorEl) return;

    const anchorRect = anchorEl.getBoundingClientRect();
    const menuWidth = Math.min(320, window.innerWidth - 40);
    const triangleOffset = 20;

    // Calcular la posición horizontal
    const menuRight = window.innerWidth - anchorRect.right + (anchorRect.width / 2) - triangleOffset - 25;

    setMenuPosition(prev => ({
      ...prev,
      right: Math.max(10, Math.min(menuRight, window.innerWidth - menuWidth - 10)),
      width: menuWidth
    }));
  }, [anchorEl]);

  // Función para establecer la posición inicial (solo se llama una vez)
  const setInitialPosition = useCallback(() => {
    if (!anchorEl) return;

    const anchorRect = anchorEl.getBoundingClientRect();
    const menuWidth = Math.min(320, window.innerWidth - 40);
    const triangleOffset = 20;

    const menuRight = window.innerWidth - anchorRect.right + (anchorRect.width / 2) - triangleOffset - 25;

    setMenuPosition({
      top: anchorRect.bottom + 8, // Usamos la posición inicial sin scrollY
      right: Math.max(10, Math.min(menuRight, window.innerWidth - menuWidth - 10)),
      width: menuWidth
    });
  }, [anchorEl]);

  // Configurar posición inicial al abrir el menú
  useEffect(() => {
    if (!isOpen || !anchorEl) return;

    // Establecer posición inicial
    setInitialPosition();

    // Solo actualizar posición horizontal al redimensionar
    const handleResize = () => updateHorizontalPosition();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, anchorEl, setInitialPosition, updateHorizontalPosition]);

  if (!isOpen || !anchorEl) return null;

  const menuStyle = {
    position: 'fixed' as const,
    top: `${menuPosition.top}px`,
    right: `${menuPosition.right}px`,
    width: `${menuPosition.width}px`,
    zIndex: 50,
  };

  // Estilos para el triángulo que apunta al botón
  const triangleStyle = {
    position: 'absolute' as const,
    top: '-8px',
    right: '20px', // Usamos un valor fijo ya que el ancho del menú es fijo
    width: '16px',
    height: '16px',
    transform: 'rotate(45deg)',
    backgroundColor: 'white',
    borderTop: '1px solid #e5e7eb',
    borderLeft: '1px solid #e5e7eb',
    zIndex: 1,
    boxShadow: '-1px -1px 1px 0 rgba(0,0,0,0.05)',
  };

  return (
    <div
      ref={menuRef}
      className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-visible relative"
      style={menuStyle}
    >
      {/* Triángulo que apunta al botón */}
      <div style={triangleStyle}></div>
      {/* Encabezado del menú */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center space-x-3">
          {/* Aquí vamos a mostrar el avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <FiUser className="w-5 h-5 text-gray-500" />
            )}
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 text-sm">
              {user?.nombres} {user?.apellido_p}
            </h3>
            <p className="text-xs text-gray-500">{user?.correo}</p>

            <p className="text-xs text-gray-500">
              Celular: {user?.celular ? user.celular : "Sin registrar"}
            </p>

            <p className="text-xs text-gray-500">
              Fecha de nacimiento:{" "}
              {user?.f_nacimiento
                ? formatToDDMMYYYY(user.f_nacimiento)
                : "Sin registrar"}

            </p>
          </div>
        </div>
      </div>

      <div className="py-1">
        <nav>
          <ul>
            <MenuItem
              icon={<FiUser className="w-5 h-5" />}
              text="Mi perfil"
              onClick={() => {
                onClose();
                navigate('/profile');
              }}
            />
            <MenuItem
              icon={<FiShoppingBag className="w-5 h-5" />}
              text="Mis pedidos"
              onClick={() => { }}
              showArrow
            />
            <MenuItem
              icon={<FiHeart className="w-5 h-5" />}
              text="Lista de deseos"
              onClick={() => { }}
              showArrow
            />
            <MenuItem
              icon={<FiCreditCard className="w-5 h-5" />}
              text="Métodos de pago"
              onClick={() => { }}
            />
            <MenuItem
              icon={<FiMapPin className="w-5 h-5" />}
              text="Direcciones"
              onClick={() => { }}
              showArrow
            />
            <MenuItem
              icon={<FiBell className="w-5 h-5" />}
              text="Notificaciones"
              onClick={() => { }}
            />
            <MenuItem
              icon={<FiSettings className="w-5 h-5" />}
              text="Configuración"
              onClick={() => { }}
            />
          </ul>
        </nav>

        <div className="border-t border-gray-100 my-1"></div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <span className="flex items-center">
            <FiLogOut className="mr-3 w-5 h-5" />
            Cerrar sesión
          </span>
        </button>
      </div>
    </div>
  );
};