import React, { useState, useEffect } from "react";
import { Package, ShoppingCart, TrendingUp, Users, ChevronLeft, ChevronRight } from "lucide-react";
import StatsCard from "../StatsCard";
import { getDashboardStats } from "../../../api/admin/dashboard";
import { getAllOrders } from "../../../api/public/Order";
import { showToast } from "../../../components/common/Toast";

const OverviewTab = () => {
  const [statsCount, setStatsCount] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalAdmins: 0,
  });

  const [orders, setOrders] = useState([]);

  // Filters (already future-ready)
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMethod, setFilterMethod] = useState("");
  const [search, setSearch] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 5;
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [page, search, filterMethod, filterStatus]);

  const fetchDashboardStats = async () => {
    try {
      const res = await getDashboardStats();
      if (res.success) {
        setStatsCount(res.data);
      } else {
        showToast(res.message || "Failed to load dashboard stats", "error");
      }
    } catch (err) {
      showToast("Error loading dashboard stats", "error");
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllOrders(page, limit, search, filterMethod, filterStatus);
      setOrders(res.orders || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      showToast("Error fetching orders", "error");
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { title: "Total Products", value: statsCount.totalProducts, icon: Package },
    { title: "Total Orders", value: statsCount.totalOrders, icon: ShoppingCart },
    { title: "Total Revenue", value: `₹${statsCount.totalRevenue}`, icon: TrendingUp },
    { title: "Active Admins", value: statsCount.totalAdmins, icon: Users },
  ];

  return (
    <div className="space-y-8">
      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>

      {/* ================= RECENT ORDERS ================= */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Recent Orders</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y bg-white">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 text-sm font-medium">#{order.orderId}</td>
                    <td className="px-6 py-4 text-sm">{order.userName}</td>
                    <td className="px-6 py-4 text-sm">₹{order.total}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium
                        ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "shipped"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ================= PAGINATION ================= */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t">
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="p-2 border rounded disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 text-sm rounded border
                    ${
                      page === i + 1
                        ? "bg-green-600 text-white border-green-600"
                        : "hover:bg-gray-100"
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="p-2 border rounded disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewTab;
