import React from "react";
import { Leaf, Award, Users, Heart, Target, Eye } from "lucide-react";
import useScrollAnimation from "../helpers/useScrollAnimation";
import G1 from "../assets/images/gallery/1.webp";
import G2 from "../assets/images/gallery/2.webp";
import G3 from "../assets/images/gallery/3.webp";
import G4 from "../assets/images/gallery/4.webp";
import G5 from "../assets/images/gallery/5.webp";
import G6 from "../assets/images/gallery/6.webp";
import G7 from "../assets/images/gallery/7.webp";
import G8 from "../assets/images/gallery/8.webp";
import G9 from "../assets/images/gallery/9.webp";
import G10 from "../assets/images/gallery/10.webp";
import G11 from "../assets/images/gallery/11.webp";
import G12 from "../assets/images/gallery/12.webp";
const row1Images = [G1, G2, G3, G4, G5, G6];
const row2Images = [G7, G8, G9, G10, G11, G12];
const row1Infinite = [...row1Images, ...row1Images];
const row2Infinite = [...row2Images, ...row2Images];
import { useNavigate } from "react-router-dom";
const AboutPage = () => {
  const navigate=useNavigate();
  useScrollAnimation();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-800 to-green-600 text-white py-16 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate slide-in-bottom">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              About <span className="text-yellow-400">Amirthan Oil Mills</span>
            </h1>
            <p className="text-xl lg:text-2xl text-green-100 max-w-3xl mx-auto">
              Three generations of expertise in producing the finest quality
              cold-pressed oils for health-conscious families across India
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate slide-in-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-700 text-lg">
                <p>
                  Founded in 1975, Amirthan Oil Mills began as a small family
                  business with a simple mission: to provide pure, natural oils
                  to local communities using traditional extraction methods
                  passed down through generations.
                </p>
                <p>
                  What started as a humble oil mill in a small town has grown
                  into a trusted brand, serving thousands of families across
                  India. Despite our growth, we've never compromised on our
                  commitment to quality, purity, and traditional methods.
                </p>
                <p>
                  Today, we continue to honor our heritage while embracing
                  modern quality standards, ensuring that every bottle of oil
                  that leaves our facility meets the highest standards of purity
                  and nutritional value.
                </p>
              </div>
            </div>
            <div className="animate slide-in-right">
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/vMOTJJLi44o?si=AxmgsaJl9ny2CEZ0"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision & Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate slide-in-top">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Mission, Vision & Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate slide-in-left">
              <div className="bg-green-100 p-4 rounded-full inline-block mb-4">
                <Target className="w-8 h-8 text-green-800" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Mission</h3>
              <p className="text-gray-600">
                To provide pure, natural, and nutritious oils to families
                worldwide, promoting health and wellness through traditional
                extraction methods and uncompromising quality standards.
              </p>
            </div>

            <div className="text-center animate slide-in-bottom delay-2">
              <div className="bg-yellow-100 p-4 rounded-full inline-block mb-4">
                <Eye className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Vision</h3>
              <p className="text-gray-600">
                To be the most trusted name in natural oils, setting industry
                standards for purity and quality while preserving traditional
                methods for future generations.
              </p>
            </div>

            <div className="text-center animate slide-in-right">
              <div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Values</h3>
              <p className="text-gray-600">
                Integrity, Quality, Tradition, Customer Focus, and Environmental
                Responsibility guide everything we do, from sourcing ingredients
                to delivering the final product.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Gallery Section */}
      <section className="py-16 bg-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center mb-12 animate slide-in-bottom">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Journey in Pictures
            </h2>
            <p className="text-lg text-gray-600">
              A glimpse into our legacy, production, and quality process
            </p>
          </div>

          {/* Row 1: Left ➜ Right */}
          <div className="marquee marquee-left group">
            <div className="marquee-track">
              {row1Infinite.map((img, i) => (
                <div key={i} className="marquee-item">
                  <img src={img} alt={`Gallery ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Right ➜ Left */}
          <div className="marquee marquee-right group mt-8">
            <div className="marquee-track">
              {row2Infinite.map((img, i) => (
                <div key={i} className="marquee-item">
                  <img src={img} alt={`Gallery ${i + 7}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate slide-in-bottom">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Amirthan Oils?
            </h2>
            <p className="text-lg text-gray-600">
              What makes us different from the rest
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center animate slide-in-left">
              <Leaf className="w-12 h-12 text-green-800 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">100% Natural</h3>
              <p className="text-gray-600">
                No chemicals, additives, or preservatives. Just pure, natural
                goodness.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center animate slide-in-left">
              <Award className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
              <p className="text-gray-600">
                Rigorous quality checks at every stage of production.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center animate slide-in-right">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Family Trust</h3>
              <p className="text-gray-600">
                Trusted by thousands of families for over 45 years.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center animate slide-in-right">
              <Heart className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Health First</h3>
              <p className="text-gray-600">
                Every product is crafted with your health and wellness in mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Oil Knowledge Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate slide-in-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Types of Oils We Produce
            </h2>
            <p className="text-lg text-gray-600">
              Understanding our diverse range of premium oils
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md animate slide-in-top">
              <h3 className="text-xl font-semibold text-green-800 mb-3">
                Coconut Oil
              </h3>
              <p className="text-gray-600 mb-4">
                Cold-pressed virgin coconut oil with natural aroma and flavor.
                Perfect for cooking, skincare, and hair care.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Rich in lauric acid</li>
                <li>• Natural moisturizer</li>
                <li>• High smoke point</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md animate slide-in-top">
              <h3 className="text-xl font-semibold text-green-800 mb-3">
                Sesame Oil
              </h3>
              <p className="text-gray-600 mb-4">
                Traditional gingelly oil perfect for South Indian cooking and
                Ayurvedic treatments. Rich in antioxidants and nutrients.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• High in vitamin E</li>
                <li>• Anti-inflammatory</li>
                <li>• Heart-healthy</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md animate slide-in-top">
              <h3 className="text-xl font-semibold text-green-800 mb-3">
                Groundnut Oil
              </h3>
              <p className="text-gray-600 mb-4">
                Pure groundnut oil with high smoke point, ideal for deep frying
                and everyday cooking. Neutral taste and aroma.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• High smoke point</li>
                <li>• Neutral flavor</li>
                <li>• Rich in healthy fats</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md animate slide-in-bottom">
              <h3 className="text-xl font-semibold text-green-800 mb-3 ">
                Sunflower Oil
              </h3>
              <p className="text-gray-600 mb-4">
                Light, healthy sunflower oil perfect for salad dressings and
                light cooking. High in vitamin E and essential fatty acids.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Light texture</li>
                <li>• High in vitamin E</li>
                <li>• Heart-healthy</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md animate slide-in-bottom">
              <h3 className="text-xl font-semibold text-green-800 mb-3">
                Castor Oil
              </h3>
              <p className="text-gray-600 mb-4">
                Pure castor oil for hair care and skincare. Known for its
                moisturizing and healing properties in traditional medicine.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Hair growth promoter</li>
                <li>• Natural moisturizer</li>
                <li>• Anti-inflammatory</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md animate slide-in-bottom">
              <h3 className="text-xl font-semibold text-green-800 mb-3">
                Mustard Oil
              </h3>
              <p className="text-gray-600 mb-4">
                Traditional mustard oil with strong flavor and aroma. Perfect
                for pickling, North Indian cooking, and massage therapy.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Strong flavor</li>
                <li>• Natural preservative</li>
                <li>• Warming properties</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center ">
          <h2 className="text-3xl font-bold mb-4 animate slide-in-left">
            Experience the Amirthan Difference
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto animate slide-in-right">
            Join thousands of satisfied customers who trust Amirthan Oil Mills
            for their family's health and nutrition needs.
          </p>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-green-900 font-bold py-4 px-8 rounded-lg text-lg transition-colors animate slide-in-bottom"
          onClick={()=>navigate('/products')}>
            Shop Our Products
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
