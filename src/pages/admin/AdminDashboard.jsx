import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import TabNav from "./TabNav";
import OverviewTab from "./Tabs/OverviewTab";
import ProductsTab from "./Tabs/ProductsTab";
import OrdersTab from "./Tabs/OrdersTab";
import AdminsTab from "./Tabs/UsersTab";
import CategoriesTab from "./Tabs/CategoriesTab"
import { logOut } from "../../api/auth";
import PaymentTab from "./Tabs/PaymentTab";
const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut();
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-green-800">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Role:{" "}
                <span className="font-medium capitalize">{user?.role}</span>
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>



      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs Navigation */}
        <TabNav role={user?.role} />
        <Routes>
          <Route index element={<OverviewTab />} />
          <Route path="categories" element={<CategoriesTab />} />
          <Route path="products" element={<ProductsTab />} />
          <Route path="orders" element={<OrdersTab />} />
          <Route path="payments" element={<PaymentTab />} />
          {user?.role == "admin" && (
            <Route path="admins" element={<AdminsTab />} />
          )}
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
