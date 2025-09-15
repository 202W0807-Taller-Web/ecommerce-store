import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">

      {/* Header */}
      <header className="bg-white shadow-md">
        <nav className="container mx-auto flex justify-between items-center p-4">
          <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
            🛒 E-Commerce
          </Link>
          <ul className="flex space-x-6 text-gray-600">
            <li>
              <Link to="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-blue-600 transition-colors">
                Productos
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-blue-600 transition-colors">
                Carrito
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t mt-6">
        <div className="container mx-auto text-center p-4 text-sm text-gray-500">
          © {new Date().getFullYear()} E-Commerce Store. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
