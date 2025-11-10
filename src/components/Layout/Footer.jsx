import React from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-green-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              Amirthan <span className="text-yellow-400">Oil Mills</span>
            </h3>
            <p className="text-green-100 mb-4">
              Pure Quality Oils for Every Home & Kitchen. Traditional methods, modern quality standards.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 cursor-pointer hover:text-yellow-400 transition-colors" />
              <Twitter className="w-5 h-5 cursor-pointer hover:text-yellow-400 transition-colors" />
              <Instagram className="w-5 h-5 cursor-pointer hover:text-yellow-400 transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-green-100 hover:text-yellow-400 transition-colors">Home</a></li>
              <li><a href="#" className="text-green-100 hover:text-yellow-400 transition-colors">Products</a></li>
              <li><a href="#" className="text-green-100 hover:text-yellow-400 transition-colors">About Us</a></li>
              <li><a href="#" className="text-green-100 hover:text-yellow-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Products</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-green-100 hover:text-yellow-400 transition-colors">Coconut Oil</a></li>
              <li><a href="#" className="text-green-100 hover:text-yellow-400 transition-colors">Sesame Oil</a></li>
              <li><a href="#" className="text-green-100 hover:text-yellow-400 transition-colors">Groundnut Oil</a></li>
              <li><a href="#" className="text-green-100 hover:text-yellow-400 transition-colors">Essential Oils</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-yellow-400" />
                <span className="text-green-100">123 Main Street, Chennai, Tamil Nadu 600001</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-yellow-400" />
                <span className="text-green-100">+91 98765 43210</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-yellow-400" />
                <span className="text-green-100">info@amirthanoils.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-green-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-green-100 text-sm">
            © 2024 Amirthan Oil Mills. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="text-green-100 hover:text-yellow-400 text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-green-100 hover:text-yellow-400 text-sm transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
