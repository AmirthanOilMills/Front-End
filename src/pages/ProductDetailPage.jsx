import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  Leaf,
  Droplets,
  Calendar,
  Award,
  FlaskConical,
  CheckCircle,
} from "lucide-react";
import useStore from "../helpers/useStore";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { showToast } from "../components/common/Toast";

const ProductDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { product } = location.state || {};

  // Redirection/fallback if no product state was passed
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-md max-w-sm border border-gray-100">
          <p className="text-gray-600 mb-6 font-medium text-lg">No product details found.</p>
          <button
            onClick={() => navigate("/products")}
            className="w-full bg-green-800 hover:bg-green-900 text-white font-bold py-3 rounded-xl transition-all"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  // Variants Check
  const hasVariants = product.variants && product.variants.length > 0;

  // UI States
  const [selectedVariant, setSelectedVariant] = useState(
    hasVariants ? product.variants[0] : null
  );
  const [isHovered, setIsHovered] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Zustand Store
  const addToCart = useStore((state) => state.addToCart);
  const addToWishlist = useStore((state) => state.addToWishlist);
  const removeFromWishlist = useStore((state) => state.removeFromWishlist);
  const wishlist = useStore((state) => state.wishlist);

  const isInWishlist = (id) => wishlist.some((item) => String(item.id || item._id) === String(id));

  // Determine Images
  const images = product.images && product.images.length > 0
    ? product.images
    : product.main_image
    ? [product.main_image]
    : [];

  // Reset index if image list changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [product._id]);

  // Auto Image Slider
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

  // Dynamic values based on selected variant or fallback to base product
  const priceToDisplay = selectedVariant ? selectedVariant.selling_price : product.price;
  const mrpToDisplay = selectedVariant ? selectedVariant.mrp : product.mrp;
  const isOutOfStock = selectedVariant
    ? (selectedVariant.stock_qty !== undefined && selectedVariant.stock_qty <= 0)
    : (product.stock_status === "Out of Stock" || (product.stock_qty !== undefined && product.stock_qty <= 0));

  const calculateDiscount = () => {
    const mrp = mrpToDisplay;
    const price = priceToDisplay;
    if (mrp && mrp > price) {
      return Math.round(((mrp - price) / mrp) * 100);
    }
    return 0;
  };
  const discount = calculateDiscount();

  // Add to cart action
  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, selectedVariant);
    showToast(
      `${product.product_name}${selectedVariant ? ` (${selectedVariant.volume_size})` : ""} added to cart!`,
      "success"
    );
  };

  // Wishlist toggle
  const handleWishlistClick = () => {
    const productToStore = { ...product, id: product._id };
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      showToast("Removed from Wishlist", "info");
    } else {
      addToWishlist(productToStore);
      showToast("Added to Wishlist", "success");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Navigation */}
        <button
          onClick={() => navigate("/products")}
          className="inline-flex items-center text-green-800 hover:text-green-950 font-semibold mb-8 group transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Back to Products
        </button>

        {/* Product Card Container */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-6 sm:p-8 lg:p-10">
            
            {/* Left Column: Image Slideshow & Thumbnails */}
            <div className="flex flex-col">
              <div
                className="relative w-full h-[320px] sm:h-[400px] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {images.length > 0 ? (
                  <img
                    src={images[currentIndex]?.url}
                    alt={product.product_name}
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                    No image available
                  </div>
                )}

                {/* Dot Overlay Indicator for Slideshow */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/10 backdrop-blur-md px-3 py-1.5 rounded-full">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          currentIndex === idx ? "bg-white scale-110" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnails Row */}
              {images.length > 1 && (
                <div className="flex gap-2.5 mt-4 overflow-x-auto pb-2 scrollbar-thin">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                        currentIndex === idx 
                          ? "border-green-700 ring-2 ring-green-700/15" 
                          : "border-gray-200 hover:border-green-600"
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Info & Actions */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Category tag */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block bg-green-50 text-green-800 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-green-200/50">
                    {product.category_id?.category_name || "Organic Product"}
                  </span>
                  {!isOutOfStock && (
                    <span className="inline-block bg-emerald-50 text-emerald-700 text-xs px-3 py-1 rounded-full font-bold border border-emerald-100">
                      Fresh Batch
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-950 tracking-tight leading-tight">
                  {product.product_name}
                </h1>

                {/* Tagline */}
                {product.tagline && (
                  <p className="text-gray-500 italic mt-1 font-medium text-sm sm:text-base">
                    "{product.tagline}"
                  </p>
                )}

                {/* Pricing & Discount */}
                <div className="flex items-baseline gap-3 my-5 py-4 border-y border-gray-100">
                  <span className="text-3xl font-black text-green-800">
                    ₹{priceToDisplay}
                  </span>
                  {mrpToDisplay && mrpToDisplay > priceToDisplay && (
                    <>
                      <span className="text-lg text-gray-400 line-through font-medium">
                        ₹{mrpToDisplay}
                      </span>
                      <span className="bg-red-50 text-red-700 text-xs font-extrabold px-2.5 py-1 rounded-full border border-red-100">
                        {discount}% OFF
                      </span>
                    </>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6">
                  {product.product_desc || "Experience the health and purity of our locally sourced premium oil, processed organically without any added chemicals."}
                </p>

                {/* Variant Sizes Selector */}
                {hasVariants && (
                  <div className="mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2.5">
                      Select Bottle Size
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {product.variants.map((v, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setSelectedVariant(v);
                            setQuantity(1); // Reset quantity on variant switch
                          }}
                          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all border ${
                            selectedVariant?.volume_size === v.volume_size
                              ? "bg-green-800 text-white border-green-800 shadow-sm"
                              : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                          }`}
                        >
                          {v.volume_size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity and Checkout Controls */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Quantity:</span>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={isOutOfStock}
                      className="p-2.5 hover:bg-gray-50 disabled:opacity-50 transition"
                    >
                      <Minus className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                    <span className="px-4 py-1 min-w-[48px] text-center font-extrabold text-gray-800 text-sm select-none">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={isOutOfStock}
                      className="p-2.5 hover:bg-gray-50 disabled:opacity-50 transition"
                    >
                      <Plus className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`flex-1 py-4 px-6 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow transition-all ${
                      isOutOfStock
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                        : "bg-green-800 hover:bg-green-900 text-white active:scale-98"
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
                  </button>

                  <button
                    onClick={handleWishlistClick}
                    className={`px-5 rounded-2xl border-2 flex items-center justify-center transition-all ${
                      isInWishlist(product._id)
                        ? "border-red-350 bg-red-50 text-red-600 hover:bg-red-100"
                        : "border-gray-250 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${isInWishlist(product._id) ? "fill-current text-red-600" : ""}`}
                    />
                  </button>
                </div>

                {/* Stock Status Label */}
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isOutOfStock ? "bg-red-500 animate-pulse" : "bg-green-600"}`} />
                  <span className={`text-xs font-bold uppercase tracking-wider ${isOutOfStock ? "text-red-500" : "text-green-700"}`}>
                    {isOutOfStock ? "Temporarily Out of Stock" : "In Stock - Dispatching Today"}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Specifications Grid Section */}
        <div className="mt-8 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 pb-3 border-b border-gray-100">
            <Award className="w-5 h-5 text-green-800" />
            <span>Product Specifications & Details</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.oil_type && (
              <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-2xl border border-gray-100">
                <div className="bg-green-50 p-2.5 rounded-xl">
                  <Droplets className="w-5 h-5 text-green-800" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider">Oil Ingredient Type</span>
                  <span className="font-bold text-gray-800 text-sm sm:text-base">{product.oil_type}</span>
                </div>
              </div>
            )}
            
            {product.extraction_type && (
              <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-2xl border border-gray-100">
                <div className="bg-green-50 p-2.5 rounded-xl">
                  <FlaskConical className="w-5 h-5 text-green-800" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider">Extraction Method</span>
                  <span className="font-bold text-gray-800 text-sm sm:text-base">{product.extraction_type}</span>
                </div>
              </div>
            )}

            {product.shelf_life && (
              <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-2xl border border-gray-100">
                <div className="bg-green-50 p-2.5 rounded-xl">
                  <Calendar className="w-5 h-5 text-green-800" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider">Shelf Life / Expiry</span>
                  <span className="font-bold text-gray-800 text-sm sm:text-base">{product.shelf_life}</span>
                </div>
              </div>
            )}

            {product.fssai_number && (
              <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-2xl border border-gray-100">
                <div className="bg-green-50 p-2.5 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-800" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider">FSSAI License No.</span>
                  <span className="font-bold text-gray-800 text-sm sm:text-base">{product.fssai_number}</span>
                </div>
              </div>
            )}

            {product.ingredients && (
              <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-2xl border border-gray-100 sm:col-span-2 lg:col-span-2">
                <div className="bg-green-50 p-2.5 rounded-xl">
                  <Leaf className="w-5 h-5 text-green-800" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider">Complete Ingredients list</span>
                  <span className="font-bold text-gray-800 text-sm sm:text-base">{product.ingredients}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Key Health Benefits Section */}
        {product.health_benefits && product.health_benefits.length > 0 && (
          <div className="mt-8 bg-green-50/40 rounded-3xl border border-green-100 p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl font-bold text-green-900 mb-6 flex items-center gap-2 pb-3 border-b border-green-150/40">
              <Leaf className="w-5 h-5 text-green-800" />
              <span>Key Health Benefits</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.health_benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-green-100/30">
                  <div className="bg-green-100/60 text-green-800 font-bold p-1 rounded-full text-xs">
                    ✔
                  </div>
                  <span className="text-gray-700 text-sm sm:text-base font-semibold">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetailPage;
