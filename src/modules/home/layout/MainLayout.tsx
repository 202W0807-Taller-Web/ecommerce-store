import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#EBC431]">
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
            <li className="flex items-center">
              <Link
                to="/"
                className="hover:text-[#EBC431] transition-colors"
              >
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <Link
                to="/products"
                className="hover:text-[#EBC431] transition-colors"
              >
                Productos
              </Link>
            </li>
            <li className="flex items-center">
              <Link
                to="/cart"
                className="hover:text-[#EBC431] transition-colors"
              >
                Carrito
              </Link>
            </li>
            <li>
              <Link
                to="/mis-pedidos"
                className="group flex items-center space-x-2"
              >
                <svg
                  className="w-6 h-6 fill-[#C0A648] group-hover:fill-[#F4CF4A] transition-colors"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M24 10.25H21.5C21.5 6.75 18.75 4 15.25 4C11.75 4 9 6.75 9 10.25H6.5C5.125 10.25 4 11.375 4 12.75V27.75C4 29.125 5.125 30.25 6.5 30.25H24C25.375 30.25 26.5 29.125 26.5 27.75V12.75C26.5 11.375 25.375 10.25 24 10.25ZM15.25 6.5C17.375 6.5 19 8.125 19 10.25H11.5C11.5 8.125 13.125 6.5 15.25 6.5ZM24 27.75H6.5V12.75H24V27.75ZM15.25 17.75C13.125 17.75 11.5 16.125 11.5 14H9C9 17.5 11.75 20.25 15.25 20.25C18.75 20.25 21.5 17.5 21.5 14H19C19 16.125 17.375 17.75 15.25 17.75Z"/>
                </svg>
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-6 bg-white rounded-lg  text-[#F5F5F5]">
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
