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
    {
      title: "Total Products",
      value: statsCount.totalProducts,
      icon: Package,
      color: {
        text: "text-green-600",
        bg: "bg-green-50",
        hover: "hover:bg-green-100",
      },
    },
    {
      title: "Total Orders",
      value: statsCount.totalOrders,
      icon: ShoppingCart,
      color: {
        text: "text-blue-600",
        bg: "bg-blue-50",
        hover: "hover:bg-blue-100",
      },
    },
    {
      title: "Total Revenue",
      value: `₹${statsCount.totalRevenue}`,
      icon: TrendingUp,
      color: {
        text: "text-purple-600",
        bg: "bg-purple-50",
        hover: "hover:bg-purple-100",
      },
    },
    {
      title: "Active Admins",
      value: statsCount.totalAdmins,
      icon: Users,
      color: {
        text: "text-orange-600",
        bg: "bg-orange-50",
        hover: "hover:bg-orange-100",
      },
    },
  ];


  return (
    <div className="space-y-6 md:space-y-8 p-4 md:p-0">
      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>

      {/* ================= RECENT ORDERS ================= */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 md:px-6 py-3 md:py-4 border-b">
          <h3 className="text-base md:text-lg font-semibold">Recent Orders</h3>
        </div>

        {/* Mobile View - Card Layout */}
        <div className="block md:hidden">
          {loading ? (
            <div className="px-4 py-8 text-center text-gray-500">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              No orders found
            </div>
          ) : (
            <div className="divide-y">
              {orders.map((order,index) => (
                <div key={order._id} className={`px-4 py-4 space-y-2    transition-colors
  ${index % 2 === 0 ? "bg-white" : "bg-blue-50"}
  hover:bg-gray-100`}>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">
                      #{order.orderId}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium
                        ${order.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "shipped"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600">
                    <div className="font-medium text-gray-900">{order.userName}</div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Total</span>
                    <span className="font-semibold text-gray-900">₹{order.total}</span>
                  </div>

                  <div className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tablet & Desktop View - Table Layout */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>

            <tbody className="divide-y bg-white">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-4 lg:px-6 py-8 text-center text-gray-500">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 lg:px-6 py-8 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <tr key={order._id} className={`
      transition-colors
      ${index % 2 === 0 ? "bg-white" : "bg-blue-50"}
      hover:bg-gray-100
    `}>
                    <td className="px-4 lg:px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      #{order.orderId}
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-900">
                      {order.userName}
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
                      ₹{order.total}
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium whitespace-nowrap
                        ${order.status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "shipped"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 md:px-6 py-3 md:py-4 border-t bg-gray-50">
            <span className="text-xs md:text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="p-2 border rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Show all pages on desktop, limited on mobile */}
              <div className="hidden sm:flex items-center gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-3 py-1 text-sm rounded border transition-colors
                      ${page === i + 1
                        ? "bg-green-600 text-white border-green-600"
                        : "hover:bg-white"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              {/* Mobile: Show only current page number */}
              <div className="flex sm:hidden items-center gap-2">
                <span className="px-3 py-1 text-sm font-medium">
                  {page}
                </span>
              </div>

              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="p-2 border rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
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