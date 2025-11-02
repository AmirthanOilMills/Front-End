import React from 'react';
import { Heart, ShoppingCart, X } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';

interface WishlistPageProps {
  onPageChange: (page: string) => void;
}

const WishlistPage: React.FC<WishlistPageProps> = ({ onPageChange }) => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (productId: string) => {
    const item = wishlist.items.find(item => item.product.id === productId);
    if (item) {
      addToCart(item.product);
      removeFromWishlist(productId);
    }
  };

  if (wishlist.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-8">Save your favorite products to buy them later</p>
          <button
            onClick={() => onPageChange('products')}
            className="bg-green-800 hover:bg-green-900 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">{wishlist.items.length} item{wishlist.items.length !== 1 ? 's' : ''} saved for later</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => removeFromWishlist(item.product.id)}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition-colors"
                >
                  <X className="w-4 h-4 text-red-600" />
                </button>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.product.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-green-800">₹{item.product.price}</span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {item.product.category}
                  </span>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => handleMoveToCart(item.product.id)}
                    disabled={!item.product.inStock}
                    className={`w-full py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center space-x-2 ${
                      item.product.inStock
                        ? 'bg-green-800 hover:bg-green-900 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{item.product.inStock ? 'Move to Cart' : 'Out of Stock'}</span>
                  </button>
                  
                  <button
                    onClick={() => removeFromWishlist(item.product.id)}
                    className="w-full py-2 px-4 rounded-md font-medium border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Remove from Wishlist
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => onPageChange('products')}
            className="bg-green-800 hover:bg-green-900 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;