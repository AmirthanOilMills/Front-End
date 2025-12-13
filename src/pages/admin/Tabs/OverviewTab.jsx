import React, { useState, useEffect } from "react";
import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { mockProducts, mockAdmins } from "../../../data/mockData";
import StatsCard from "../StatsCard";
import { getDashboardStats } from "../../../api/admin/dashboard";
import { getAllOrders } from "../../../api/public/Order";

const OverviewTab = () => {
  const [statsCount, setStatsCount] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalAdmins: 0,
  });
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMethod, setFilterMethod] = useState("");
  const [search, setSearch] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(3);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    dashboardstats();
  }, []);
  useEffect(() => {
    fetchOrders();
  }, [page, search, filterMethod, filterStatus]);

  const fetchOrders = async () => {
    try {
      const res = await getAllOrders(page, limit, search, filterMethod, filterStatus);
      console.log(res);
      setOrders(res.orders || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };


  const dashboardstats = async () => {
    try {
      const res = await getDashboardStats();
      console.log(res);
      if (res.success) {
        setStatsCount(res.data);
      } else showToast(res.message || "Failed to load products", "error");
    } catch (err) {
      showToast("Error loading products", "error");
    }
  };

  const mockOrders = [
    { id: "1", customer: "John Doe", total: 599, status: "processing", date: "2024-01-15" },
    { id: "2", customer: "Jane Smith", total: 899, status: "shipped", date: "2024-01-14" },
    { id: "3", customer: "Bob Johnson", total: 299, status: "delivered", date: "2024-01-13" },
  ];

  const stats = [
    { title: "Total Products", value: statsCount?.totalProducts || 0, icon: Package, color: "bg-blue-500" },
    { title: "Total Orders", value: statsCount?.totalOrders || 0, icon: ShoppingCart, color: "bg-green-500" },
    { title: "Total Revenue", value: statsCount?.totalRevenue || 0, icon: TrendingUp, color: "bg-yellow-500" },
    { title: "Active Admins", value: statsCount?.totalAdmins || 0, icon: Users, color: "bg-purple-500" },
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
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.orderId}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{order.userName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">₹{order.total}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${order.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "shipped"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>

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
