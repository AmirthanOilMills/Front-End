import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Heart, Minus, Plus, Star, Leaf } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { mockProducts } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ProductDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const { product } = location.state || {};
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();


  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) =>
          prev === product.images.length - 1 ? 0 : prev + 1
        );
      }, 5000); // 3 seconds

      return () => clearInterval(interval);
    }
  }, [isHovered, product.images.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const relatedProducts = mockProducts
    .filter(p => p.category === product.category_id.category_name && p.id !== product._id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleWishlistClick = () => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const handleViewProduct = (selectedProduct) => {
    navigate('/product', { state: { selectedProduct } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/products')}
          className="flex items-center text-green-800 hover:text-green-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Products
        </button>

        {/* Product Detail */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div
              className="relative  w-full group overflow-hidden"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <img
                src={`http://localhost:5000${product?.images?.[currentIndex]}`}
                alt={product?.product_name}
                className="w-full h-full object-cover"
              />

              {/* Dots */}
              <div className="absolute bottom-2 w-full flex items-center justify-center gap-1">
                {product.images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all ${currentIndex === idx ? "bg-white" : "bg-white/50"
                      }`}
                  ></div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-4">
                <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                  {product.category_id.category_name}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.product_name}</h1>

              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600 ml-2">(24 reviews)</span>
              </div>

              <div className="text-3xl font-bold text-green-800 mb-6">₹{product.price}</div>

              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                {product.product_desc}
              </p>

              {/* Quantity Selector */}
              <div className="flex items-center mb-6">
                <span className="text-gray-700 mr-4">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.stock}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${product.stock
                    ? 'bg-green-800 hover:bg-green-900 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{product.stock ? 'Add to Cart' : 'Out of Stock'}</span>
                </button>

                <button
                  onClick={handleWishlistClick}
                  className={`px-6 py-3 rounded-lg border-2 transition-colors flex items-center justify-center ${isInWishlist(product.id)
                    ? 'border-red-300 bg-red-50 text-red-600'
                    : 'border-gray-300 hover:border-gray-400 text-gray-600'
                    }`}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock ? (
                  <div className="flex items-center text-green-600">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                    <span>In Stock</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                    <span>Out of Stock</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Oil Benefits */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-6">
            <Leaf className="w-6 h-6 text-green-800 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Health Benefits</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.health_benefits.map((benefit, index) => (
              <div key={index} className="flex items-start">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  onViewDetails={handleViewProduct}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
