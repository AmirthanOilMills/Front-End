// import React, { useState, useEffect } from 'react';
// import { CartProvider } from './contexts/CartContext';
// import { WishlistProvider } from './contexts/WishlistContext';
// import { AuthProvider, useAuth } from './contexts/AuthContext';
// import Header from './components/Layout/Header';
// import Footer from './components/Layout/Footer';
// import WhatsAppButton from './components/WhatsAppButton';
// import HomePage from './pages/HomePage';
// import ProductsPage from './pages/ProductsPage';
// import ProductDetailPage from './pages/ProductDetailPage';
// import CartPage from './pages/CartPage';
// import CheckoutPage from './pages/CheckoutPage';
// import WishlistPage from './pages/WishlistPage';
// import AboutPage from './pages/AboutPage';
// import ContactPage from './pages/ContactPage';
// import AdminLoginPage from './pages/admin/AdminLoginPage';
// import AdminDashboard from './pages/admin/AdminDashboard';

// const AppContent = () => {
//   const [appState, setAppState] = useState({
//     currentPage: 'home'
//   });
//   const { isAuthenticated } = useAuth();

//   const handlePageChange = (page, data) => {
//     setAppState({ currentPage: page, pageData: data });
//   };

//   const renderPage = () => {
//     switch (appState.currentPage) {
//       case 'home':
//         return <HomePage onPageChange={handlePageChange} />;
//       case 'products':
//         return <ProductsPage onPageChange={handlePageChange} />;
//       case 'product-detail':
//         return <ProductDetailPage product={appState.pageData} onPageChange={handlePageChange} />;
//       case 'cart':
//         return <CartPage onPageChange={handlePageChange} />;
//       case 'checkout':
//         return <CheckoutPage onPageChange={handlePageChange} />;
//       case 'wishlist':
//         return <WishlistPage onPageChange={handlePageChange} />;
//       case 'about':
//         return <AboutPage />;
//       case 'contact':
//         return <ContactPage />;
//       case 'admin-login':
//         if (isAuthenticated) {
//           return <AdminDashboard onPageChange={handlePageChange} />;
//         }
//         return <AdminLoginPage onPageChange={handlePageChange} />;
//       case 'admin-dashboard':
//         if (isAuthenticated) {
//           return <AdminDashboard onPageChange={handlePageChange} />;
//         }
//         return <AdminLoginPage onPageChange={handlePageChange} />;
//       default:
//         return <HomePage onPageChange={handlePageChange} />;
//     }
//   };

//   const isAdminPage = appState.currentPage.startsWith('admin');

//   return (
//     <div className="min-h-screen flex flex-col">
//       {!isAdminPage && (
//         <Header currentPage={appState.currentPage} onPageChange={handlePageChange} />
//       )}
      
//       <main className="flex-1">
//         {renderPage()}
//       </main>
      
//       {!isAdminPage && <Footer />}
//       {!isAdminPage && <WhatsAppButton />}
//     </div>
//   );
// };

// function App() {
//   return (
//     <AuthProvider>
//       <CartProvider>
//         <WishlistProvider>
//           <AppContent />
//         </WishlistProvider>
//       </CartProvider>
//     </AuthProvider>
//   );
// }

// export default App;
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

// 🧩 Context Providers
import { AuthProvider, useAuth } from "./contexts/AuthContext";
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


// ------------------------------------------------------
// 🔒 Protected Route Wrapper (for Admin Pages)
// ------------------------------------------------------
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};


// ------------------------------------------------------
// 🧭 Layouts
// ------------------------------------------------------

// 🌐 Public App Layout
const AppLayout = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1">
      <Outlet /> {/* 👈 Nested pages will render here */}
    </main>
    <Footer />
    <WhatsAppButton />
  </div>
);

// 🔐 Admin Layout
const AdminLayout = () => (
  <div className="min-h-screen flex flex-col">
    <main className="flex-1">
      <Outlet /> {/* 👈 Nested admin pages render here */}
    </main>
  </div>
);


// ------------------------------------------------------
// 🚏 Application Routes
// ------------------------------------------------------
function AppRoutes() {
  return (
    <Routes>

      {/* 🌐 Public Routes (shared layout) */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* 🔐 Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="login" element={<AdminLoginPage />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ❌ Fallback */}
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
