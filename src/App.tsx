import React, { useState, useEffect } from 'react';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import WishlistPage from './pages/WishlistPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import { Product } from './types';

interface AppState {
  currentPage: string;
  pageData?: any;
}

const AppContent: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    currentPage: 'home'
  });
  const { isAuthenticated } = useAuth();

  const handlePageChange = (page: string, data?: any) => {
    setAppState({ currentPage: page, pageData: data });
  };

  const renderPage = () => {
    switch (appState.currentPage) {
      case 'home':
        return <HomePage onPageChange={handlePageChange} />;
      case 'products':
        return <ProductsPage onPageChange={handlePageChange} />;
      case 'product-detail':
        return <ProductDetailPage product={appState.pageData as Product} onPageChange={handlePageChange} />;
      case 'cart':
        return <CartPage onPageChange={handlePageChange} />;
      case 'checkout':
        return <CheckoutPage onPageChange={handlePageChange} />;
      case 'wishlist':
        return <WishlistPage onPageChange={handlePageChange} />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'admin-login':
        if (isAuthenticated) {
          return <AdminDashboard onPageChange={handlePageChange} />;
        }
        return <AdminLoginPage onPageChange={handlePageChange} />;
      case 'admin-dashboard':
        if (isAuthenticated) {
          return <AdminDashboard onPageChange={handlePageChange} />;
        }
        return <AdminLoginPage onPageChange={handlePageChange} />;
      default:
        return <HomePage onPageChange={handlePageChange} />;
    }
  };

  const isAdminPage = appState.currentPage.startsWith('admin');

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminPage && (
        <Header currentPage={appState.currentPage} onPageChange={handlePageChange} />
      )}
      
      <main className="flex-1">
        {renderPage()}
      </main>
      
      {!isAdminPage && <Footer />}
      {!isAdminPage && <WhatsAppButton />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <AppContent />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;