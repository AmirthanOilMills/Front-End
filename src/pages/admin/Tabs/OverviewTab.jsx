import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  ShoppingBag,
  Tag,
  IndianRupee,
  Calendar,
  Award,
  Flame,
  ChevronLeft,
  ChevronRight,
  PackageCheck
} from "lucide-react";
import StatsCard from "../StatsCard";
import { getDashboardStats } from "../../../api/admin/dashboard";
import { getAllOrders } from "../../../api/public/Order";
import { showToast } from "../../../components/common/Toast";

const OverviewTab = () => {
  // Current Month YYYY-MM
  const now = new Date();
  const defaultMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const [selectedMonth, setSelectedMonth] = useState(defaultMonthStr);
  const [availableMonths, setAvailableMonths] = useState([]);

  const [statsData, setStatsData] = useState({
    totalRevenue: 0,
    overallSelledAmount: 0,
    discountAmount: 0,
    totalOrders: 0,
    topProducts: [],
  });

  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 5;
  const [totalPages, setTotalPages] = useState(1);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    fetchDashboardStats(selectedMonth);
  }, [selectedMonth]);

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchDashboardStats = async (month) => {
    try {
      setLoadingStats(true);
      const res = await getDashboardStats(month);
      if (res.success && res.data) {
        setStatsData(res.data);
        if (res.data.availableMonths?.length) {
          setAvailableMonths(res.data.availableMonths);
        }
      } else {
        showToast(res.message || "Failed to load dashboard stats", "error");
      }
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      showToast("Error loading dashboard stats", "error");
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await getAllOrders(page, limit);
      setOrders(res.orders || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // 4 Financial Metric Cards
  const statsList = [
    {
      title: "Total Revenue",
      value: `₹${(statsData.totalRevenue || 0).toLocaleString("en-IN")}`,
      icon: TrendingUp,
      color: {
        text: "text-green-600",
        bg: "bg-green-50",
        hover: "hover:bg-green-100",
      },
      subtitle: "Net collected from paid orders",
    },
    {
      title: "Selled Amount",
      value: `₹${(statsData.overallSelledAmount || 0).toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: {
        text: "text-blue-600",
        bg: "bg-blue-50",
        hover: "hover:bg-blue-100",
      },
      subtitle: "Gross sales value before discount",
    },
    {
      title: "Discount Amount",
      value: `₹${(statsData.discountAmount || 0).toLocaleString("en-IN")}`,
      icon: Tag,
      color: {
        text: "text-amber-600",
        bg: "bg-amber-50",
        hover: "hover:bg-amber-100",
      },
      subtitle: "Total coupon discounts applied",
    },
    {
      title: "Total Orders",
      value: (statsData.totalOrders || 0).toLocaleString("en-IN"),
      icon: ShoppingBag,
      color: {
        text: "text-purple-600",
        bg: "bg-purple-50",
        hover: "hover:bg-purple-100",
      },
      subtitle: "Orders placed in selected month",
    },
  ];

  // Highest quantity sold among top products (for progress bar scaling)
  const maxQtySold = statsData.topProducts?.[0]?.quantitySold || 1;

  return (
    <div className="space-y-6 md:space-y-8 p-4 md:p-0">
      {/* ================= HEADER WITH MONTH FILTER (TOP RIGHT) ================= */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Dashboard Overview
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Financial performance and top selling product metrics
          </p>
        </div>

        {/* TOP RIGHT MONTH FILTER */}
        <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg p-1.5 shadow-sm">
          <Calendar className="w-4 h-4 text-green-700 ml-1.5" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-transparent text-sm font-semibold text-gray-800 focus:outline-none cursor-pointer pr-2"
          >
            {availableMonths.length > 0 ? (
              availableMonths.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))
            ) : (
              <option value={defaultMonthStr}>Current Month</option>
            )}
          </select>
        </div>
      </div>

      {/* ================= 4 FINANCIAL STATS CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statsList.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>

      {/* ================= TOP SELLING PRODUCTS REPORT (WHICH PRODUCT SELLS HIGHER) ================= */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-green-50 to-white">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-green-700 text-white rounded-lg shadow-sm">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-gray-900">
                Which Product Sells Higher
              </h3>
              <p className="text-xs text-gray-500">
                Top performing products by quantity sold & revenue
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold text-green-800 bg-green-100 px-3 py-1 rounded-full">
            Top Sellers
          </span>
        </div>

        <div className="p-4 md:p-6">
          {loadingStats ? (
            <div className="py-8 text-center text-gray-500 text-sm">
              Loading top selling products...
            </div>
          ) : !statsData.topProducts || statsData.topProducts.length === 0 ? (
            <div className="py-8 text-center text-gray-500 text-sm space-y-1">
              <PackageCheck className="w-8 h-8 mx-auto text-gray-300 mb-2" />
              <p className="font-semibold text-gray-700">No product sales recorded for this month.</p>
              <p className="text-xs text-gray-400">Select a different month from the top right filter.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {statsData.topProducts.map((prod, index) => {
                const rankColor =
                  index === 0
                    ? "bg-amber-400 text-amber-900 border-amber-300"
                    : index === 1
                      ? "bg-gray-300 text-gray-800 border-gray-400"
                      : index === 2
                        ? "bg-amber-600 text-white border-amber-700"
                        : "bg-gray-100 text-gray-600 border-gray-200";

                const percentage = Math.round((prod.quantitySold / maxQtySold) * 100);

                return (
                  <div
                    key={index}
                    className="p-4 rounded-xl border border-gray-100 hover:border-green-200 bg-gray-50/50 hover:bg-green-50/30 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        {/* Rank Badge */}
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs border shadow-sm ${rankColor}`}
                        >
                          #{index + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm md:text-base">
                            {prod.product_name}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {prod.quantitySold} Units Sold
                          </span>
                        </div>
                      </div>

                      {/* Sales Revenue */}
                      <div className="text-right">
                        <span className="text-xs text-gray-400 block font-normal">Sales Revenue</span>
                        <span className="text-sm md:text-base font-bold text-green-700">
                          ₹{(prod.totalSales || 0).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ================= RECENT ORDERS TABLE ================= */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 md:px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <h3 className="text-base md:text-lg font-bold text-gray-900">
            Recent Orders
          </h3>
        </div>

        {/* Mobile View - Card Layout */}
        <div className="block md:hidden">
          {loadingOrders ? (
            <div className="px-4 py-8 text-center text-gray-500 text-sm">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500 text-sm">
              No orders found
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {orders.map((order) => (
                <div key={order._id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-900 font-mono">
                      #{order.orderId}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 text-xs rounded-full font-semibold ${order.status?.toLowerCase() === "success"
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                        }`}
                    >
                      {order.status || "Pending"}
                    </span>
                  </div>

                  <div className="text-sm text-gray-700 font-medium">
                    {order.userName}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                    <span>
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="font-bold text-green-700 text-sm">
                      ₹{order.total}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tablet & Desktop View - Table Layout */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3 text-left">Order ID</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Payment Status</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-right">Total</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white text-sm">
              {loadingOrders ? (
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
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-gray-900 whitespace-nowrap">
                      #{order.orderId}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {order.userName}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 text-xs rounded-full font-semibold ${order.status?.toLowerCase() === "success"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                          }`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-green-700 whitespace-nowrap">
                      ₹{(order.total || 0).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t bg-gray-50 text-xs">
            <span className="text-gray-500">
              Page {page} of {totalPages}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="p-1.5 border rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="font-semibold text-gray-800">{page}</span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="p-1.5 border rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
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