import React from "react";
import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { mockProducts, mockAdmins } from "../../../data/mockData";
import StatsCard from "../StatsCard";

const OverviewTab = () => {
  const mockOrders = [
    { id: "1", customer: "John Doe", total: 599, status: "processing", date: "2024-01-15" },
    { id: "2", customer: "Jane Smith", total: 899, status: "shipped", date: "2024-01-14" },
    { id: "3", customer: "Bob Johnson", total: 299, status: "delivered", date: "2024-01-13" },
  ];

  const stats = [
    { title: "Total Products", value: mockProducts.length, icon: Package, color: "bg-blue-500" },
    { title: "Total Orders", value: mockOrders.length, icon: ShoppingCart, color: "bg-green-500" },
    { title: "Total Revenue", value: `₹${mockOrders.reduce((sum, o) => sum + o.total, 0)}`, icon: TrendingUp, color: "bg-yellow-500" },
    { title: "Active Admins", value: mockAdmins.length, icon: Users, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{order.customer}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">₹{order.total}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "shipped"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
