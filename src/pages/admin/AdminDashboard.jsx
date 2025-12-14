import React, { useState } from "react";
import { Routes, Route, useNavigate, NavLink } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Layers,
  CreditCard,
  MessageSquare,
  LogOut,
} from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";
import { logOut } from "../../api/auth";

import OverviewTab from "./Tabs/OverviewTab";
import ProductsTab from "./Tabs/ProductsTab";
import OrdersTab from "./Tabs/OrdersTab";
import AdminsTab from "./Tabs/UsersTab";
import CategoriesTab from "./Tabs/CategoriesTab";
import PaymentTab from "./Tabs/PaymentTab";
import ContactFormTab from "./Tabs/ContactFormTab";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logOut();
    logout();
    navigate("/");
  };

  const menuItems = [
    { name: "Overview", path: "", icon: LayoutDashboard },
    { name: "Categories", path: "categories", icon: Layers },
    { name: "Products", path: "products", icon: Package },
    { name: "Orders", path: "orders", icon: ShoppingCart },
    { name: "Payments", path: "payments", icon: CreditCard },
    { name: "Contact", path: "contact", icon: MessageSquare },
  ];

  if (user?.role === "admin") {
    menuItems.push({ name: "Admins", path: "admins", icon: Users });
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* ================= MOBILE SIDEBAR OVERLAY ================= */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed z-50 inset-y-0 left-0 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-green-700">Admin Panel</h2>
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path ? `/admin/${item.path}` : "/admin"}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition
                ${isActive
                  ? "bg-green-100 text-green-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between lg:justify-end">
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu />
          </button>

          <div className="text-right">
            <p className="font-medium">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route index element={<OverviewTab />} />
            <Route path="categories" element={<CategoriesTab />} />
            <Route path="products" element={<ProductsTab />} />
            <Route path="orders" element={<OrdersTab />} />
            <Route path="payments" element={<PaymentTab />} />
            <Route path="contact" element={<ContactFormTab />} />
            {user?.role === "admin" && (
              <Route path="admins" element={<AdminsTab />} />
            )}
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
