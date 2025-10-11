import { useEffect, useState, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  CiSearch,
  CiHeart,
  CiUser,
  CiShoppingCart,
  CiSettings,
  CiLogout,
  CiUser as CiProfile,
  CiShoppingTag,
  CiStar,
  CiHeadphones,
} from "react-icons/ci";
import { BsBoxSeam } from "react-icons/bs";
import textLogo from "../assets/text-logo.png";
import altertextLogo from "../assets/alter-text-logo.png";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";

type MainLayoutProps = {
  children: ReactNode;
};

// Menu Item Component
const MenuItem = ({
  icon,
  text,
  to,
  count,
  badge,
  isDanger = false,
  onClick,
}: {
  icon: ReactNode;
  text: string;
  to: string;
  count?: number;
  badge?: string;
  isDanger?: boolean;
  onClick?: () => void;
}) => (
  <li>
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center px-4 py-2.5 text-sm transition-colors ${
        isDanger
          ? "text-red-600 hover:bg-red-50"
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      <span
        className={`flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 mr-3 ${
          isDanger ? "text-red-500" : "text-gray-600"
        }`}
      >
        {icon}
      </span>
      <span className="flex-1">{text}</span>
      {count !== undefined && (
        <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
      {badge && (
        <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  </li>
);

export default function MainLayout({ children }: MainLayoutProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState<number>(0);
  const [cartCount, setCartCount] = useState<number>(0);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Buscando:", searchQuery);
  };

  useEffect(() => {
    // Set initial notification counts (you can replace these with actual data from your backend)
    setFavoritesCount(0);
    setCartCount(0);

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm relative z-20">
        <nav className="container mx-auto flex items-center justify-between py-3 px-6 gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 shrink-0">
            <img
              src={textLogo}
              alt="E-Commerce Logo"
              className="h-11 w-auto object-contain"
            />
          </Link>

          {/* Buscador */}
          <form
            onSubmit={handleSearch}
            className="flex flex-1 max-w-2xl items-center bg-white rounded-lg border border-gray-300 px-4 py-2"
          >
            <input
              type="search"
              placeholder="Buscar producto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-gray-800 placeholder-gray-700 text-sm"
            />
            <button
              type="submit"
              className="ml-2 text-gray-700 hover:text-blue-600 transition-colors"
              title="Buscar"
            >
              <CiSearch size={22} />
            </button>
          </form>

          {/* Navegación */}
          {!isLoggedIn ? (
            <ul className="flex items-center space-x-6 text-gray-700 text-sm font-medium whitespace-nowrap">
              <li>
                <Link
                  to="/login"
                  className="hover:text-blue-600 transition-colors"
                >
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="border border-gray-300 rounded-md px-5 py-2 hover:border-blue-600 hover:text-blue-600 transition-colors"
                >
                  Registrarse
                </Link>
              </li>
            </ul>
          ) : (
            <div className="relative flex items-center space-x-8 text-gray-800 text-2xl">
              <div className="relative group">
                <Link
                  to="/favorites"
                  className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
                  title="Favoritos"
                >
                  <CiHeart
                    size={24}
                    className="text-gray-700 group-hover:text-red-500 transition-colors"
                  />
                </Link>
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </div>

              <div className="relative group">
                <Link
                  to="/cart"
                  className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
                  title="Carrito"
                >
                  <CiShoppingCart
                    size={24}
                    className="text-gray-700 group-hover:text-blue-600 transition-colors"
                  />
                </Link>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>

              {/* Enhanced User Dropdown */}
              <div ref={menuRef} className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsUserMenuOpen((prev) => !prev);
                  }}
                  onMouseEnter={() => setIsUserMenuOpen(true)}
                  className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors relative cursor-pointer"
                  title="Menú de usuario"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  <CiUser
                    size={22}
                    className="text-gray-700 group-hover:text-blue-600 transition-colors"
                  />
                </button>

                {/* Dropdown Menu */}
                <div
                  className={`absolute right-0 mt-3 w-72 bg-white rounded-lg shadow-xl border border-gray-200 overflow-visible z-50 transition-all duration-200 origin-top-right ${
                    isUserMenuOpen
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-2 pointer-events-none"
                  }`}
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  {/* Caret pointing to the user icon */}
                  <div className="absolute -top-2 right-3 w-4 h-4 transform rotate-45 bg-white border-t border-l border-gray-200 shadow-[-1px_-1px_1px_-1px_rgba(0,0,0,0.1)]"></div>
                  {/* Profile Section */}
                  <div className="p-3 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-white shadow-sm">
                          <img
                            src={
                              "https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small_2x/default-avatar-profile-icon-of-social-media-user-vector.jpg"
                            }
                            alt="User avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">
                          Juan Luis Pérez
                        </h3>
                        <p className="text-xs text-gray-500">
                          juanperez@example.com
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <nav className="py-2">
                    <ul className="space-y-1">
                      <MenuItem
                        icon={<CiProfile size={20} />}
                        text="Mi perfil"
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      <MenuItem
                        icon={<BsBoxSeam size={18} />}
                        text="Mis compras"
                        to="/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      <MenuItem
                        icon={<CiStar size={20} />}
                        text="Lista de deseos"
                        to="/favorites"
                        count={favoritesCount}
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      <MenuItem
                        icon={<CiShoppingTag size={20} />}
                        text="Ofertas especiales"
                        to="/offers"
                        badge="Nuevo"
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      <div className="border-t border-gray-100 my-1"></div>
                      <MenuItem
                        icon={<CiSettings size={20} />}
                        text="Configuración"
                        to="/settings"
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      <MenuItem
                        icon={<CiHeadphones size={20} />}
                        text="Ayuda y soporte"
                        to="/help"
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      <div className="border-t border-gray-100 my-1"></div>
                      <MenuItem
                        icon={<CiLogout size={20} />}
                        text="Cerrar sesión"
                        to="#"
                        isDanger
                        onClick={() => {
                          setIsLoggedIn(false);
                          setIsUserMenuOpen(false);
                        }}
                      />
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-6">{children}</main>

      {/* Footer */}
      <footer className="bg-[#2E2E2E] text-gray-300 mt-10">
        <div className="container mx-auto px-6 py-10 flex flex-col md:flex-row justify-between gap-16 border-b border-white">
          {/* Bloque Izquierdo */}
          <div className="max-w-md">
            <div className="flex items-center space-x-2 mb-4">
              <img
                src={altertextLogo}
                alt="EzCommerce Logo"
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Una tienda virtual creada para conectar y apoyar a universitarios,
              donde cada compra y venta fortalece nuestra comunidad.
            </p>

            {/* Redes sociales */}
            <div className="flex space-x-4 mt-5">
              <a
                href="#"
                className="bg-gray-100 text-black rounded-full p-2 hover:bg-gray-200 transition"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
              <a
                href="#"
                className="bg-gray-100 text-black rounded-full p-2 hover:bg-gray-200 transition"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="bg-gray-100 text-black rounded-full p-2 hover:bg-gray-200 transition"
                aria-label="WhatsApp"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>

          {/* Bloque Derecho */}
          <div className="flex flex-col sm:flex-row gap-10">
            {/* Compañía */}
            <div>
              <h3 className="text-white font-semibold mb-3">Compañía</h3>
              <div className="w-full h-px my-2 bg-white"></div>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Nosotros
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Términos y condiciones
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Soporte
                  </a>
                </li>
              </ul>
            </div>

            {/* Comunidad */}
            <div>
              <h3 className="text-white font-semibold mb-3">Comunidad</h3>
              <div className="w-full h-px my-2 bg-white"></div>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Reportar problema
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Únete como marca
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center py-4 text-sm text-gray-400">
          Copyright © {new Date().getFullYear()} EzCommerce. Todos los derechos
          reservados.
        </div>
      </footer>

      {/* Botón temporal para probar login/logout */}
      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => setIsLoggedIn(!isLoggedIn)}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          {isLoggedIn ? "Cerrar sesión" : "Simular login"}
        </button>
      </div>
    </div>
  );
}
