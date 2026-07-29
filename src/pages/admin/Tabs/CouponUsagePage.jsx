import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, ShoppingBag, Tag, IndianRupee, Calendar, Percent, RefreshCw } from "lucide-react";
import { getCouponUsage } from "../../../api/admin/coupon";
import { showToast } from "../../../components/common/Toast";

const CouponUsagePage = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  const [couponInfo, setCouponInfo] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalCustomers: 0,
    totalDiscountGiven: 0,
    totalSalesValue: 0,
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [range, setRange] = useState("today"); // today, week, month, custom
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchUsageData();
  }, [code, range]);

  const fetchUsageData = async () => {
    try {
      setLoading(true);
      const res = await getCouponUsage(code, range, startDate, endDate);
      if (res.success) {
        setCouponInfo(res.coupon);
        setStats(res.stats || {});
        setOrders(res.orders || []);
      } else {
        showToast(res.message || "Failed to load coupon usage", "error");
      }
    } catch (err) {
      console.error("Error fetching coupon usage:", err);
      showToast("Error loading coupon usage details", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomDateSearch = () => {
    if (!startDate) {
      showToast("Please select a start date", "error");
      return;
    }
    fetchUsageData();
  };

  return (
    <div className="space-y-6 p-4 md:p-0">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate("/admin/coupons")}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition"
            title="Back to Coupons"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 uppercase">
                {code}
              </h2>
              {couponInfo && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
                  {couponInfo.percentage}% OFF
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              Coupon Usage & Customer Details
              {couponInfo?.influencer_name && (
                <span className="ml-2 text-gray-700 font-medium">
                  • Influencer: {couponInfo.influencer_name}
                </span>
              )}
            </p>
          </div>
        </div>

        <button
          onClick={fetchUsageData}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Date Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
        {/* Range Buttons */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2 hidden md:inline">
            Timeframe:
          </span>
          {[
            { id: "today", label: "Today" },
            { id: "week", label: "This Week" },
            { id: "month", label: "This Month" },
            { id: "custom", label: "Custom Date" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setRange(item.id);
                if (item.id !== "custom") {
                  setStartDate("");
                  setEndDate("");
                }
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${range === item.id
                  ? "bg-green-800 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Custom Date Picker Controls */}
        {range === "custom" && (
          <div className="flex flex-wrap items-center gap-2 border-t sm:border-t-0 pt-3 sm:pt-0">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">From:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-xs focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-xs focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
            <button
              onClick={handleCustomDateSearch}
              className="px-4 py-1.5 bg-green-700 text-white text-xs font-semibold rounded-md hover:bg-green-800 transition"
            >
              Apply Filter
            </button>
          </div>
        )}
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Customers */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Customers Used</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers || 0}</p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Orders Placed</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalOrders || 0}</p>
          </div>
        </div>

        {/* Total Discount Amount */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Discount Given</p>
            <p className="text-2xl font-bold text-amber-700">
              ₹{(stats.totalDiscountGiven || 0).toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Total Sales Value */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4">
          <div className="p-3 bg-green-50 text-green-700 rounded-xl">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-green-700">
              ₹{(stats.totalSalesValue || 0).toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      {/* Customer Usage Details Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-800 text-sm md:text-base">
            Customer Details & Order History ({orders.length})
          </h3>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            Loading usage details...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm space-y-2">
            <p className="font-semibold text-gray-700">No orders found for this timeframe.</p>
            <p className="text-xs text-gray-400">
              Try switching the filter to "This Month" or selecting a custom date range.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer Name</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Order Date</th>
                    <th className="p-4 text-right">Discount</th>
                    <th className="p-4 text-right">Order Total</th>
                    <th className="p-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50/50 transition">
                      <td className="p-4 font-mono font-semibold text-gray-900">
                        #{order.orderId}
                      </td>
                      <td className="p-4 font-medium text-gray-900">
                        {order.userName}
                      </td>
                      <td className="p-4 text-xs text-gray-600 space-y-0.5">
                        <div className="font-medium text-gray-800">{order.phone}</div>
                        <div className="text-gray-400">{order.email || "N/A"}</div>
                      </td>
                      <td className="p-4 text-xs text-gray-600 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </td>
                      <td className="p-4 text-right font-bold text-amber-700">
                        ₹{(order.couponDiscount || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="p-4 text-right font-bold text-green-700">
                        ₹{(order.total || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full ${order.status?.toLowerCase() === "success"
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                            }`}
                        >
                          {order.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="block md:hidden divide-y divide-gray-200">
              {orders.map((order) => (
                <div key={order._id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-xs font-bold text-gray-500">
                        #{order.orderId}
                      </span>
                      <h4 className="font-bold text-gray-900 text-base">{order.userName}</h4>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${order.status?.toLowerCase() === "success"
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                        }`}
                    >
                      {order.status || "Pending"}
                    </span>
                  </div>

                  <div className="text-xs text-gray-600 space-y-1">
                    <div>
                      <span className="text-gray-400">Phone:</span> {order.phone}
                    </div>
                    {order.email && (
                      <div>
                        <span className="text-gray-400">Email:</span> {order.email}
                      </div>
                    )}
                    <div>
                      <span className="text-gray-400">Date:</span>{" "}
                      {new Date(order.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t text-xs">
                    <div>
                      <span className="text-gray-400 block">Discount Saved</span>
                      <span className="font-bold text-amber-700">
                        ₹{(order.couponDiscount || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-400 block">Order Total</span>
                      <span className="font-bold text-green-700">
                        ₹{(order.total || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CouponUsagePage;
