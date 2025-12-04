import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { CategoriesModal } from './CategoriesModal';
import { FaBars, FaSearch, FaGraduationCap } from 'react-icons/fa';
import { FiShoppingBag, FiUser, FiHeart, FiShoppingCart, } from 'react-icons/fi';

export const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  // Los atributos ahora se manejan directamente en CategoriesModal

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header className="bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-24">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              {/* Logo Icon */}
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center relative">
                {/* Graduation cap */}
                <FaGraduationCap className="w-4 h-3 text-white" />
                {/* Shopping bag overlay */}
                <FiShoppingBag className="absolute -bottom-1 -right-1 w-2 h-3 text-white" />
              </div>
            </div>
            {/* Brand Text */}
            <Link to="/" className="text-xl font-bold text-primary">
              EzCommerce
            </Link>
          </div>

          {/* Navigation and Search Section */}
          <div className="flex-1 flex items-center justify-center mx-8">
            <div className="flex items-center space-x-4 w-full max-w-2xl">

              {/* Categories Button */}
              <button
                onClick={() => setIsCategoriesModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaBars className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Categorías</span>
              </button>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    placeholder="Buscar productos..."
                    className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary transition-colors"
                  >
                    <FaSearch className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* User Actions Section */}
          <div className="flex items-center space-x-4">
            {/* Shopping Bag */}
            <Link
                to="/mis-pedidos"
                className="relative p-2 text-primary hover:bg-gray-50 rounded-lg transition-colors"
              >
            {/* <button className="relative p-2 text-primary hover:bg-gray-50 rounded-lg transition-colors"> */}
              <FiShoppingBag className="w-6 h-6" />
              {/* Cart badge */}
              {/* <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span> */}
            {/* </button> */}
            </Link>

            {/* Heart/Wishlist */}
            <button className="p-2 text-primary hover:bg-gray-50 rounded-lg transition-colors">
              <FiHeart className="w-6 h-6" />
            </button>

            {/* Shopping Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-primary hover:bg-gray-50 rounded-lg transition-colors"
            >
              <FiShoppingCart className="w-6 h-6" />
              {/* Cart badge */}
            </Link>

            {/* User Profile */}
            <button className="p-2 text-primary hover:bg-gray-50 rounded-lg transition-colors">
              <FiUser className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Categories Modal */}
      <CategoriesModal
        isOpen={isCategoriesModalOpen}
        onClose={() => setIsCategoriesModalOpen(false)}
      />
    </header>
  );
};
