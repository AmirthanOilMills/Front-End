import React from 'react';
import { Heart, ShoppingCart, X } from 'lucide-react';
import useStore from '../helpers/useStore';
import { useNavigate } from 'react-router-dom';

const WishlistPage = () => {
  const navigate = useNavigate();

  // Zustand store hooks
  const wishlist = useStore((state) => state.wishlist);
  const addToWishlist = useStore((state) => state.addToWishlist);
  const removeFromWishlist = useStore((state) => state.removeFromWishlist);
  const addToCart = useStore((state) => state.addToCart);

  // Move item from wishlist to cart
  const handleMoveToCart = (product) => {
    addToCart(product);            // add to cart or increase quantity
    removeFromWishlist(product.id); // remove from wishlist
  };

  // Empty wishlist view
  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-8">Save your favorite products to buy them later</p>
          <button
            onClick={() => navigate('/products')}
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
        {/* PAGE TITLE */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">
            {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved for later
          </p>
        </div>

        {/* WISHLIST PRODUCTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* PRODUCT IMAGE */}
              <div className="relative">
                <img
                  src={product.images?.[0]?.url || "../assets/no-image.png"}
                  alt={product.product_name}
                  className="w-full h-48 object-cover"
                />
                {/* REMOVE FROM WISHLIST BUTTON */}
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition-colors"
                >
                  <X className="w-4 h-4 text-red-600" />
                </button>
              </div>

              {/* PRODUCT DETAILS */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.product_name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.product_desc}</p>

                {/* PRICE & CATEGORY */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-green-800">₹{product.price}</span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {product?.category_id?.category_name || 'No Category'}
                  </span>
                </div>

                {/* ACTION BUTTONS */}
                <div className="space-y-2">
                  {/* MOVE TO CART BUTTON */}
                  <button
                    onClick={() => handleMoveToCart(product)}
                    disabled={!product.stock}
                    className={`w-full py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center space-x-2 ${
                      product.stock
                        ? 'bg-green-800 hover:bg-green-900 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{product.stock ? 'Move to Cart' : 'Out of Stock'}</span>
                  </button>

                  {/* REMOVE BUTTON */}
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="w-full py-2 px-4 rounded-md font-medium border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Remove from Wishlist
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CONTINUE SHOPPING */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/products')}
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
