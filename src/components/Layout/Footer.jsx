import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

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
              Pure Quality Oils for Every Home & Kitchen. Traditional methods,
              modern quality standards.
            </p>
            <div className="flex space-x-4">
              <Facebook
                className="w-5 h-5 cursor-pointer hover:text-yellow-400 transition-colors"
                onClick={() => navigate("#")}
              />
              <Twitter
                className="w-5 h-5 cursor-pointer hover:text-yellow-400 transition-colors"
                onClick={() => navigate("#")}
              />
              <Instagram
                className="w-5 h-5 cursor-pointer hover:text-yellow-400 transition-colors"
                onClick={() =>
                  window.open(
                    "https://www.instagram.com/amirthanoilmills20/",
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="/"
                  className="text-green-100 hover:text-yellow-400 transition-colors"
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/products"
                  className="text-green-100 hover:text-yellow-400 transition-colors"
                >
                  Products
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className="text-green-100 hover:text-yellow-400 transition-colors"
                >
                  About Us
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className="text-green-100 hover:text-yellow-400 transition-colors"
                >
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Products</h4>
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="/products"
                  className="text-green-100 hover:text-yellow-400 transition-colors"
                >
                  Coconut Oil
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/products"
                  className="text-green-100 hover:text-yellow-400 transition-colors"
                >
                  Sesame Oil
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/products"
                  className="text-green-100 hover:text-yellow-400 transition-colors"
                >
                  Groundnut Oil
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/products"
                  className="text-green-100 hover:text-yellow-400 transition-colors"
                >
                  Essential Oils
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-green-100 flex">
                  <MapPin className="w-5 h-5 mr-3 text-yellow-400 " />
                  <p className="flex-1">RS No. 198, Plot No. 1a,Tnhb, Colony Mela, Anuppanadi
                  Anuppandi, Fire, Station, Madurai- 625009, Tamil Nadu, India</p>
                 
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-yellow-400" />
                <span className="text-green-100">+91 98765 43210</span>
              </div>

              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-yellow-400" />
                <span className="text-green-100">info@amirthanoils.com</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-100">GST No.33DRJPK3594Q1ZZ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-green-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-green-100 text-sm">
            © {new Date().getFullYear()} Amirthan Oil Mills. All rights
            reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <NavLink
              to="/"
              className="text-green-100 hover:text-yellow-400 transition-colors"
            >
              Privacy Policy
            </NavLink>
            <NavLink
              to="/"
              className="text-green-100 hover:text-yellow-400 transition-colors"
            >
              Terms of Service
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
