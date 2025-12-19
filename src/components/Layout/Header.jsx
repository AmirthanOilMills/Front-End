import React, { useState } from 'react';
import { ShoppingCart, Heart, Menu, X, User, Phone , Truck  } from 'lucide-react';
import useStore from '../../helpers/useStore'; // Zustand store
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Zustand store
  const cart = useStore((state) => state.cart);
  const wishlist = useStore((state) => state.wishlist);
  const orders = useStore((state) => state.orders);

  // Count functions
  // const cartCount = cart.reduce((total, item) => total + item.qty, 0);
  const cartCount = cart.length;
  const wishlistCount = wishlist.length;
  // const ordersCount = orders.length; 

  // Navigation items
  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-green-800 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span>+91 80150 79866</span>
              </div>
            </div>
            <div className="hidden md:block">
              {/* <span>Free delivery on orders above ₹500</span> */}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div
            className="flex-shrink-0 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <h1 className="lg:text-2xl font-extrabold text-green-800 sm:text-xl text-[14px]">
              அமிர்தன் <span className="text-yellow-500">ஆயில் மில்ஸ்</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-2 lg:space-x-8">
            {navigation.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(item.path)
                    ? 'bg-green-100 text-green-800'
                    : 'text-gray-700 hover:text-green-800 hover:bg-green-50'
                  }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center md:space-x-4">
            {/* Wishlist */}
            <button
              onClick={() => navigate('/wishlist')}
              className="p-1 sm:p-2 text-gray-600 hover:text-green-800 relative"
            >
              <Heart className="sm:w-6 sm:h-6 w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => navigate('/cart')}
              className="p-1 sm:p-2 text-gray-600 hover:text-green-800 relative"
            >
              <ShoppingCart className="sm:w-6 sm:h-6 w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>


            {/* Cart */}
            <button
              onClick={() => navigate('/orders')}
              className="p-1 sm:p-2 text-gray-600 hover:text-green-800 relative"
            >
              <Truck   className="sm:w-6 sm:h-6 w-5 h-5" />
              {/* {ordersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {ordersCount}
                </span>
              )} */}
            </button>

            {/* Admin Login */}
            {/* <button
              onClick={() => navigate('/admin')}
              className="p-2 text-gray-600 hover:text-green-800"
            >
              <User className="w-6 h-6" />
            </button> */}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-1 sm:p-2 text-gray-600"
            >
              {isMenuOpen ? <X className="sm:w-6 sm:h-6 w-5 h-5" /> : <Menu className="sm:w-6 sm:h-6 w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive(item.path)
                      ? 'bg-green-100 text-green-800'
                      : 'text-gray-700 hover:text-green-800 hover:bg-green-50'
                    }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

