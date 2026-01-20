import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  Star,
  Leaf,
} from "lucide-react";
import useStore from "../helpers/useStore";
import { mockProducts } from "../data/mockData";
import ProductCard from "../components/ProductCard";
import { useLocation, useNavigate } from "react-router-dom";

const ProductDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {};

  // UI States
  const [isHovered, setIsHovered] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Zustand Store
  const addToCart = useStore((state) => state.addToCart);
  const addToWishlist = useStore((state) => state.addToWishlist);
  const removeFromWishlist = useStore((state) => state.removeFromWishlist);
  const wishlist = useStore((state) => state.wishlist);

  const isInWishlist = (id) => wishlist.some((item) => item._id === id);

  // Auto Image Slider
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) =>
          prev === product.images.length - 1 ? 0 : prev + 1
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isHovered, product.images.length]);

  // Next + Prev slide
  const nextSlide = () =>
    setCurrentIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  const prevSlide = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );

  // Related Products
  const relatedProducts = mockProducts
    .filter(
      (p) =>
        p.category === product.category_id.category_name && p.id !== product._id
    )
    .slice(0, 4);

  // Add to cart
  const handleAddToCart = () => addToCart(product, quantity);

  // Wishlist toggle
  const handleWishlistClick = () => {
    isInWishlist(product._id)
      ? removeFromWishlist(product._id)
      : addToWishlist(product);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/products")}
          className="flex items-center text-green-800 hover:text-green-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Products
        </button>

        {/* Product Container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div
              className="relative w-full group overflow-hidden"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <img
                src={product.images[currentIndex].url}
                alt={product.product_name}
                className="w-full h-full object-cover"
              />

              {/* Slider Dots */}
              <div className="absolute bottom-2 w-full flex items-center justify-center gap-1">
                {product.images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full ${currentIndex === idx ? "bg-white" : "bg-white/50"
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Category */}
              <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full mb-4 w-fit">
                {product.category_id.category_name}
              </span>

              {/* Name */}
              <h1 className="md:text-3xl text-xl font-bold text-gray-900 mb-4">
                {product.product_name}
              </h1>

              {/* Rating */}
              {/* <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
                <span className="text-gray-600 ml-2">(24 reviews)</span>
              </div> */}

              {/* Price */}
              <div className="md:text-3xl text-2xl font-bold text-green-800 mb-3">
                ₹{product.price}
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                {product.product_desc}
              </p>

              {/* Quantity */}
              <div className="flex items-center mb-6">
                <span className="text-gray-700 mr-4">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <span className="px-4 py-2 border-x min-w-[60px] text-center">
                    {quantity}
                  </span>

                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Cart + Wishlist Buttons */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 md:px-6 px-1 rounded-lg font-semibold bg-green-800 hover:bg-green-900 text-white flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleWishlistClick}
                  className={`md:px-6 px-4 py-3 rounded-lg border-2 flex items-center justify-center ${isInWishlist(product._id)
                      ? "border-red-300 bg-red-50 text-red-600"
                      : "border-gray-300 text-gray-600 hover:border-gray-400"
                    }`}
                >
                  <Heart
                    className={`w-5 h-5 ${isInWishlist(product._id) ? "fill-current" : ""
                      }`}
                  />
                </button>
              </div>

              {/* Stock */}
              <div>
                {product.stock ? (
                  <div className="text-green-600 flex items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                    In Stock
                  </div>
                ) : (
                  <div className="text-red-600 flex items-center">
                    <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                    Out of Stock
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        {product.health_benefits.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Leaf className="w-6 h-6 text-green-800 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">
                Health Benefits
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.health_benefits.map((b, i) => (
                <div key={i} className="flex items-start">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                  <span className="text-gray-700">{b}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {/* {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Related Products
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rp) => (
                <ProductCard
                  key={rp.id}
                  product={rp}
                  onViewDetails={() =>
                    navigate("/product", { state: { product: rp } })
                  }
                />
              ))}
            </div>
          </div>
        )}  */}
      </div>
    </div>
  );
};

export default ProductDetailPage;
