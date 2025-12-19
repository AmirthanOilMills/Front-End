import React, { useState, useEffect } from "react";
import { ArrowRight, Leaf, Award, Truck, Users, Star } from "lucide-react";
import { mockProducts, mockTestimonials } from "../data/mockData";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";
import { showToast } from "../components/common/Toast";
import { getAllProducts } from "../api/public/products";
import useScrollAnimation from "../helpers/useScrollAnimation";
import Chekku from "../assets/videos/chekku.mp4";
const HomePage = () => {
  useScrollAnimation();
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await getAllProducts(1, 8);
      if (res.success) {
        setFeaturedProducts(res.products);
      } else showToast(res.message || "Failed to load products", "error");
    } catch (err) {
      showToast("Error loading products", "error");
    }
  };
  const handleViewProduct = (product) => {
    navigate("/product", { state: { product } });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-800 to-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0 animate slide-in-left">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Amirthan <span className="text-yellow-400">Oil Mills</span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-green-100">
                Pure Quality Oils for Every Home & Kitchen
              </p>
              <p className="text-lg mb-8 text-green-200">
                Experience the authentic taste and natural goodness of
                traditional cold-pressed oils, made using time-tested methods
                for your health and well-being.
              </p>
              <button
                onClick={() => navigate("/products")}
                className="bg-yellow-500 hover:bg-yellow-600 text-green-900 font-bold py-4 px-8 rounded-lg text-lg transition-colors flex items-center space-x-2"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            {/* <div className="lg:w-1/2 animate slide-in-right">
              <video
                src={Chekku} // replace with your video path or URL
                className="rounded-lg shadow-2xl w-full h-60"
                autoPlay
                muted
                playsInline
                onTimeUpdate={(e) => {
                  if (e.target.currentTime >= 18) {
                    e.target.currentTime = 0;
                    e.target.play();
                  }
                }}
              />
            </div> */}
            <div className="lg:w-1/2 animate slide-in-right flex justify-center">
              <video
                src={Chekku}
                className="rounded-lg shadow-2xl w-full max-w-[380px] aspect-[7/6] object-cover bg-black"
                autoPlay
                muted
                playsInline
                loop
                onTimeUpdate={(e) => {
                  if (e.target.currentTime >= 18) {
                    e.target.currentTime = 0;
                    e.target.play();
                  }
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate slide-in-bottom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full inline-block mb-4">
                <Leaf className="w-8 h-8 text-green-800" />
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Natural</h3>
              <p className="text-gray-600">
                Pure, cold-pressed oils without any chemicals or additives
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 p-4 rounded-full inline-block mb-4">
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                Carefully selected ingredients processed with traditional
                methods
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick and secure delivery to your doorstep
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full inline-block mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Family Trust</h3>
              <p className="text-gray-600">
                Trusted by thousands of families across India
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 animate slide-in-right">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 animate slide-in-left">
              Discover our most popular and premium quality oils
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={handleViewProduct}
              />
            ))}
          </div>

          <div className="text-center mt-12 animate slide-in-bottom">
            <button
              onClick={() => navigate("/products")}
              className="bg-green-800 hover:bg-green-900 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* About Oils Section */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 animate slide-in-top">
                Why Choose Our Oils?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-green-200 p-2 rounded-full mr-4">
                    <Leaf className="w-6 h-6 text-green-800" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 animate slide-in-left">
                      Cold-Pressed Excellence
                    </h3>
                    <p className="text-gray-600 animate slide-in-bottom">
                      Our oils are extracted using traditional cold-press
                      methods that preserve all the natural nutrients and
                      authentic flavors.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-yellow-200 p-2 rounded-full mr-4">
                    <Award className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 animate slide-in-left">
                      Purity Guaranteed
                    </h3>
                    <p className="text-gray-600 animate slide-in-bottom">
                      No chemicals, no additives, no preservatives - just pure,
                      natural oils as nature intended.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-200 p-2 rounded-full mr-4">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 animate slide-in-left">
                      Traditional Methods
                    </h3>
                    <p className="text-gray-600 animate slide-in-bottom">
                      We follow age-old techniques passed down through
                      generations, ensuring authentic taste and quality.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="animate slide-in-right">
              <img
                src="https://images.pexels.com/photos/4226861/pexels-photo-4226861.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Oil Making Process"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Health Benefits */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate slide-in-bottom">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Health Benefits of Our Oils
            </h2>
            <p className="text-lg text-gray-600">
              Natural goodness for your health and wellness
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md animate slide-in-top">
              <div className="bg-green-100 p-3 rounded-full inline-block mb-4">
                <Leaf className="w-6 h-6 text-green-800" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Coconut Oil</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Boosts immunity and metabolism</li>
                <li>• Rich in healthy saturated fats</li>
                <li>• Natural moisturizer for skin</li>
                <li>• Antimicrobial properties</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md animate slide-in-bottom">
              <div className="bg-yellow-100 p-3 rounded-full inline-block mb-4">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Sesame Oil</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Rich in antioxidants</li>
                <li>• Supports heart health</li>
                <li>• Good for oral hygiene</li>
                <li>• Anti-inflammatory properties</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md animate slide-in-top">
              <div className="bg-blue-100 p-3 rounded-full inline-block mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Groundnut Oil</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• High smoke point for cooking</li>
                <li>• Rich in vitamin E</li>
                <li>• Good for heart health</li>
                <li>• Neutral taste and aroma</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 animate slide-in-right">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600 animate slide-in-left">
              Real reviews from satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white p-6 rounded-lg shadow-md animate slide-in-top"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.comment}"</p>
                <p className="font-semibold text-green-800">
                  - {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
