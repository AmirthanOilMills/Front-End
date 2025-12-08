
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { getCurrentUser } from "./api/auth";
import ProtectedRoute from "./ProtectedRoute";
// 🧩 Context Providers
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext"; // ✅ correct
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";

// 🧱 Layout Components
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

// 📄 Public Pages
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import WishlistPage from "./pages/WishlistPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";

// 🔐 Admin Pages
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import OrderPage from "./pages/OrderPage";


// ------------------------------------------------------
// 🧭 Layouts
// ------------------------------------------------------

// Public App Layout
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


// ------------------------------------------------------
// 🚏 Application Routes
// ------------------------------------------------------
function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<OrderPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>
      <Route path="/login" element={<AdminLoginPage />} />
      {/* 🔐 Admin Routes */}
      <Route path="/admin/*" element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}


// ------------------------------------------------------
// 🚀 Main App Component
// ------------------------------------------------------
function App() {
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

export default App;
