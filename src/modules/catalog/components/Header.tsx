import React from 'react';
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              {/* Logo Icon */}
              <div className="w-8 h-8 bg-[#003669] rounded-lg flex items-center justify-center relative">
                {/* Graduation cap */}
                <div className="w-4 h-3 text-white">
                  <svg viewBox="0 0 16 12" fill="currentColor">
                    <path d="M8 0L2 4v8h4v-6h4v6h4V4L8 0z"/>
                  </svg>
                </div>
                {/* Shopping bag overlay */}
                <div className="absolute -bottom-1 -right-1 w-3 h-4 text-white">
                  <svg viewBox="0 0 12 16" fill="currentColor" className="w-full h-full">
                    <path d="M2 6v10h8V6H2zM3 7h6v8H3V7z"/>
                    <path d="M4 2v4h4V2H4z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Brand Text */}
            <Link to="/" className="text-xl font-bold text-[#003669]">
              EzCommerce
            </Link>
          </div>

          {/* Navigation and Search Section */}
          <div className="flex-1 flex items-center justify-center mx-8">
            <div className="flex items-center space-x-4 w-full max-w-lg">
              
              {/* Categories Button */}
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="w-4 h-4 flex flex-col justify-center space-y-1">
                  <div className="w-full h-0.5 bg-gray-600"></div>
                  <div className="w-full h-0.5 bg-gray-600"></div>
                  <div className="w-full h-0.5 bg-gray-600"></div>
                </div>
                <span className="text-sm font-medium text-gray-700">Categorías</span>
              </button>

              {/* Search Bar */}
              <div className="relative flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003669] focus:border-[#003669] text-sm placeholder-gray-400"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Actions Section */}
          <div className="flex items-center space-x-4">
            
            {/* Shopping Bag */}
            <button className="relative p-2 text-[#003669] hover:bg-gray-50 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7a2 2 0 01-2 2H8a2 2 0 01-2-2L5 9z"></path>
              </svg>
              {/* Cart badge */}
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* Heart/Wishlist */}
            <button className="p-2 text-[#003669] hover:bg-gray-50 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </button>

            {/* Shopping Cart */}
            <button className="relative p-2 text-[#003669] hover:bg-gray-50 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v6a1 1 0 001 1h8a1 1 0 001-1v-6M7 13l2.5 5"></path>
              </svg>
              {/* Cart badge */}
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                5
              </span>
            </button>

            {/* User Profile */}
            <button className="p-2 text-[#003669] hover:bg-gray-50 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
