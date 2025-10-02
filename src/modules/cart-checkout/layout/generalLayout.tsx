import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#333027] text-[#EBC431]">
      {/* Header */}
      <header className="bg-[#413F39] shadow-md">
        <nav className="container mx-auto flex justify-between items-center p-4">
          <Link
            to="/"
            className="text-2xl font-bold text-[#EBC431] hover:text-[#C0A648] transition-colors"
          >
            🛒 E-Commerce
          </Link>
          <ul className="flex space-x-6 text-[#C0A648]">
            <li>
              <Link
                to="/"
                className="hover:text-[#EBC431] transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="hover:text-[#EBC431] transition-colors"
              >
                Productos
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                className="hover:text-[#EBC431] transition-colors"
              >
                Carrito
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-6 bg-[#6B644C] rounded-lg shadow-md text-[#F5F5F5]">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#413F39] border-t mt-6">
        <div className="container mx-auto text-center p-4 text-sm text-[#968751]">
          © {new Date().getFullYear()} E-Commerce Store. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
