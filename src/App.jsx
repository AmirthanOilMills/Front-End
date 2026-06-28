import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation
} from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";

import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

// Pages
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import WishlistPage from "./pages/WishlistPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import OrderPage from "./pages/OrderPage";
import ProtectedRoute from "./ProtectedRoute";

import LoadingScreen from "./components/LoadingScreen";


// ----------------------------
// Layout
// ----------------------------
const AppLayout = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
    <WhatsAppButton />
  </div>
);


// ----------------------------
// Loader Wrapper (FIX)
// ----------------------------
function LoaderWrapper() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return loading ? <LoadingScreen /> : <Outlet />;
}


// ----------------------------
// Routes
// ----------------------------
function AppRoutes() {
  return (
    <Routes>

      {/* 🔥 Loader wrapper for all public pages */}
      <Route element={<LoaderWrapper />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product" element={<ProductDetailPage />} />
          <Route path="/orders" element={<OrderPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>
        
        {/* Auth pages under loader but without store header/footer */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
      </Route>

      {/* Admin */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}


// ----------------------------
// Final App Wrapper
// ----------------------------
export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <AppRoutes />
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
