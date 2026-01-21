import React, { useState, useEffect } from "react";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import useStore from "../helpers/useStore"; // Zustand store

const ProductCard = ({ product, onViewDetails }) => {
  const [isHovered, setIsHovered] = useState(false); // Track hover state for slideshow
  const [currentIndex, setCurrentIndex] = useState(0); // Current slide index

  // Zustand store hooks
  const cart = useStore(state => state.cart);
  const wishlist = useStore(state => state.wishlist);
  const addToCart = useStore(state => state.addToCart);
  const addToWishlist = useStore(state => state.addToWishlist);
  const removeFromWishlist = useStore(state => state.removeFromWishlist);

  // Check if product is already in wishlist
  const wishlistActive = wishlist.some(
    (item) => String(item.id) === String(product._id || product.id)
  );

  // Automatic slideshow when not hovered
  const images = product?.images || [];

  useEffect(() => {
    if (!isHovered && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) =>
          prev === images.length - 1 ? 0 : prev + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isHovered, images.length]);

  // Navigate to next slide
  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  // Navigate to previous slide
  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  // Add/remove product from wishlist
  const handleWishlistClick = () => {
    const productToStore = { ...product, id: product._id || product.id };
    if (wishlistActive) {
      removeFromWishlist(productToStore.id);
    } else {
      addToWishlist(productToStore);
    }
  };


  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:scale-105 transition-transform transition-shadow
  duration-300 ease-out ">

      {/* IMAGE SLIDESHOW */}
      <div
        className="relative h-48 w-full group overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={images[currentIndex]?.url || "../assets/no-image.png"}
          alt={product.product_name}
          className="w-full h-full object-cover transition-all duration-500"
        />

        {/* Slide indicators (dots) */}
        <div className="absolute bottom-2 w-full flex items-center justify-center gap-1">
          {images.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-all ${currentIndex === idx ? "bg-white" : "bg-white/50"
                }`}
            ></div>
          ))}
        </div>

        {/* Hover overlay buttons */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">

            {/* VIEW PRODUCT BUTTON */}
            <button
              onClick={() => onViewDetails(product)}
              className="bg-white p-2 rounded-full hover:bg-green-50 transition-colors"
            >
              <Eye className="w-5 h-5 text-green-800" />
            </button>

            {/* WISHLIST BUTTON */}
            <button
              onClick={handleWishlistClick}
              className={`p-2 rounded-full transition-colors ${wishlistActive
                  ? "bg-red-100 text-red-600"
                  : "bg-white hover:bg-red-50 text-gray-600"
                }`}
            >
              <Heart
                className={`w-5 h-5 ${wishlistActive ? "fill-current" : ""}`}
              />
            </button>

          </div>
        </div>
      </div>

      {/* PRODUCT DETAILS */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {product.product_name}
        </h3>

        {/* <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.product_desc}
        </p> */}

        {/* PRICE & CATEGORY */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-green-800">
            ₹{product.price}
          </span>

          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product?.category_id?.category_name || "No Category"}
          </span>
        </div>

        {/* ADD TO CART BUTTON */}
        <button
          onClick={() => addToCart(product)}
          disabled={!product.stock}
          className={`w-full mt-4 py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center space-x-2 ${product.stock
            ? "bg-green-800 hover:bg-green-900 text-white"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{product.stock ? "Add to Cart" : "Out of Stock"}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
