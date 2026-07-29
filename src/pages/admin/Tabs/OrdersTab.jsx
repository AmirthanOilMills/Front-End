import React, { useState, useEffect } from "react";
import { Eye, ChevronLeft, ChevronRight, X, Package, User, Phone, Mail, MapPin, CreditCard, FileText } from "lucide-react";
import { getAllOrders, updateOrderStatus, updateStatus } from "../../../api/public/Order";

const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMethod, setFilterMethod] = useState("");
  const [search, setSearch] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  // Popup modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Payment confirmation modal state
  const [confirmPaymentModal, setConfirmPaymentModal] = useState({
    open: false,
    orderId: null,
    orderCode: "",
    newStatus: "",
  });

  useEffect(() => {
    fetchOrders();
  }, [page, search, filterMethod, filterStatus]);

  const fetchOrders = async () => {
    try {
      const res = await getAllOrders(page, limit, search, filterMethod, filterStatus);
      setOrders(res.orders || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await updateStatus(id, newStatus);
      fetchOrders();
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder((prev) => ({
          ...prev,
          status: res.status || (newStatus.charAt(0).toUpperCase() + newStatus.slice(1)),
        }));
      }
    } catch (err) {
      console.error("Failed to update order status:", err);
      alert("Failed to update status.");
    }
  };

  const handlePaymentStatusSelect = (orderId, orderCode, currentStatus, newStatus) => {
    if (currentStatus.toLowerCase() === "success") {
      return; // Already success, disabled
    }
    if (newStatus.toLowerCase() === "success") {
      setConfirmPaymentModal({
        open: true,
        orderId,
        orderCode,
        newStatus,
      });
    } else {
      handleStatusChange(orderId, newStatus);
    }
  };

  const confirmPaymentStatusChange = async () => {
    if (confirmPaymentModal.orderId && confirmPaymentModal.newStatus) {
      await handleStatusChange(confirmPaymentModal.orderId, confirmPaymentModal.newStatus);
    }
    setConfirmPaymentModal({ open: false, orderId: null, orderCode: "", newStatus: "" });
  };

  const handleOrderStatusChange = async (id, newOrderStatus) => {
    try {
      const res = await updateOrderStatus(id, newOrderStatus);
      fetchOrders();
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder((prev) => ({
          ...prev,
          orderStatus: res.orderStatus || (newOrderStatus.charAt(0).toUpperCase() + newOrderStatus.slice(1)),
        }));
      }
    } catch (err) {
      alert("Failed to update order status.");
    }
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setShowModal(false);
  };

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Orders Management</h2>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search by name, email, phone, order ID..."
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none w-full"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Payment Status</option>
          <option value="pending">Pending</option>
          <option value="success">Success</option>
        </select>

        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none w-full sm:col-span-2 lg:col-span-1"
          value={filterMethod}
          onChange={(e) => setFilterMethod(e.target.value)}
        >
          <option value="">All Methods</option>
          <option value="cod">COD</option>
          <option value="online">Online</option>
        </select>
      </div>

      {/* Mobile View - Card Layout */}
      <div className="block lg:hidden space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md p-4 space-y-3">
              {/* Order ID & View Button */}
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <span className="text-xs text-gray-500">Order ID</span>
                  <p className="font-semibold text-gray-900">#{order.orderId}</p>
                </div>
                <button
                  onClick={() => openModal(order)}
                  className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>

              {/* Customer Info */}
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Customer:</span>
                  <span className="ml-2 font-medium text-gray-900">{order.userName}</span>
                </div>
                <div>
                  <span className="text-gray-500">Phone:</span>
                  <span className="ml-2 text-gray-900">{order.phone}</span>
                </div>
                <div>
                  <span className="text-gray-500">Total:</span>
                  <span className="ml-2 font-bold text-green-700">₹{order.total}</span>
                </div>
                <div>
                  <span className="text-gray-500">Method:</span>
                  <span className="ml-2 uppercase text-gray-900">{order.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-gray-500">Date:</span>
                  <span className="ml-2 text-gray-900 text-xs">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Status Selects */}
              <div className="space-y-2 pt-3 border-t">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Payment Status</label>
                  <select
                    value={order.status.toLowerCase()}
                    disabled={order.status.toLowerCase() === "success"}
                    onChange={(e) => handlePaymentStatusSelect(order._id, order.orderId, order.status, e.target.value)}
                    className="w-full text-sm font-semibold rounded-md px-3 py-2 border focus:ring-2 focus:ring-green-500 focus:outline-none disabled:bg-green-50 disabled:text-green-800 disabled:cursor-not-allowed disabled:border-green-300"
                  >
                    <option value="pending">Pending</option>
                    <option value="success">Success</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-500 block mb-1">Order Status</label>
                  <select
                    value={order.orderStatus.toLowerCase()}
                    onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                    className="w-full text-sm font-semibold rounded-md px-3 py-2 border focus:ring-2 focus:ring-green-500 focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="out for delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
            No orders found.
          </div>
        )}
      </div>

      {/* Tablet & Desktop View - Table Layout */}
      <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Details
                </th>
                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Status
                </th>
                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Status
                </th>
                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.orderId}
                    </td>
                    <td className="px-4 xl:px-6 py-4 text-sm text-gray-900">
                      <div className="font-semibold text-gray-900">{order.userName}</div>
                      <div className="text-gray-500 text-xs">{order.phone}</div>
                    </td>
                    <td className="px-4 xl:px-6 py-4 text-sm font-semibold text-green-700">
                      ₹{order.total}
                    </td>
                    <td className="px-4 xl:px-6 py-4 text-sm uppercase text-gray-900">
                      {order.paymentMethod}
                    </td>

                    {/* Payment Status */}
                    <td className="xl:px-4 xl:py-4 p-0">
                      <select
                        value={order.status.toLowerCase()}
                        disabled={order.status.toLowerCase() === "success"}
                        onChange={(e) => handlePaymentStatusSelect(order._id, order.orderId, order.status, e.target.value)}
                        className="text-xs font-semibold rounded-full px-2 py-1 border focus:ring-2 focus:ring-green-500 focus:outline-none disabled:bg-green-100 disabled:text-green-800 disabled:cursor-not-allowed disabled:border-green-300"
                      >
                        <option value="pending">Pending</option>
                        <option value="success">Success</option>
                      </select>
                    </td>

                    {/* Order Status */}
                    <td className="xl:px-4 xl:py-4 p-0">
                      <select
                        value={order.orderStatus.toLowerCase()}
                        onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                        className="text-xs font-semibold rounded-full px-2 py-1 border focus:ring-2 focus:ring-green-500 focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="out for delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                    <td className="px-4 xl:px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                      <div>
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-gray-400">
                        {new Date(order.createdAt).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </div>
                    </td>


                    {/* Actions */}
                    <td className="px-4 xl:px-6 py-4">
                      <button
                        onClick={() => openModal(order)}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="px-4 xl:px-6 py-8 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="p-4 flex flex-col sm:flex-row justify-center items-center gap-4 border-t bg-gray-50">
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Show all pages on desktop, limited on mobile */}
            <div className="hidden sm:flex items-center gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 border rounded-md transition-colors ${page === i + 1 ? "bg-green-600 text-white border-green-600" : "hover:bg-white"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Mobile: Show only current page number */}
            <div className="flex sm:hidden items-center gap-2">
              <span className="px-3 py-1 text-sm font-medium">{page}</span>
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Pagination */}
      <div className="block lg:hidden">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 bg-white p-4 rounded-lg shadow-md">
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="px-3 py-1 text-sm font-medium">{page}</span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ------------------ POPUP MODAL ------------------ */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-4 md:p-6 rounded-lg w-full max-w-3xl shadow-lg max-h-[95vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b pb-4 mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Package className="w-6 h-6 text-green-600" />
                  Order Details
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  ID: <span className="font-mono font-semibold text-gray-800">#{selectedOrder.orderId}</span>
                </p>
                <p className="text-xs text-gray-400">
                  Placed on: {new Date(selectedOrder.createdAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true
                  })}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Quick Status / Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div>
                <span className="text-xs font-semibold text-gray-500 block mb-1">Payment Status</span>
                <select
                  value={selectedOrder.status.toLowerCase()}
                  disabled={selectedOrder.status.toLowerCase() === "success"}
                  onChange={(e) => handlePaymentStatusSelect(selectedOrder._id, selectedOrder.orderId, selectedOrder.status, e.target.value)}
                  className="w-full text-sm font-semibold rounded-md px-3 py-1.5 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none bg-white disabled:bg-green-50 disabled:text-green-800 disabled:cursor-not-allowed disabled:border-green-300"
                >
                  <option value="pending">Pending</option>
                  <option value="success">Success</option>
                </select>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 block mb-1">Order Status</span>
                <select
                  value={selectedOrder.orderStatus.toLowerCase()}
                  onChange={(e) => handleOrderStatusChange(selectedOrder._id, e.target.value)}
                  className="w-full text-sm font-semibold rounded-md px-3 py-1.5 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none bg-white"
                >
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="out for delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Customer Info */}
              <div className="border border-gray-100 rounded-lg p-4 bg-gray-50/50">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 border-b pb-2">
                  <User className="w-4 h-4 text-green-600" /> Customer Information
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Name:</span>
                    <span className="font-semibold text-gray-900">{selectedOrder.userName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phone:</span>
                    <span className="font-medium text-gray-900">{selectedOrder.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email:</span>
                    <span className="text-gray-900 font-medium break-all">{selectedOrder.email || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="border border-gray-100 rounded-lg p-4 bg-gray-50/50">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 border-b pb-2">
                  <MapPin className="w-4 h-4 text-green-600" /> Shipping Address
                </h3>
                <div className="space-y-1 text-sm text-gray-700 font-normal">
                  <p className="font-semibold text-gray-900">{selectedOrder.userName}</p>
                  <p className="text-gray-600">{selectedOrder.address}</p>
                  <p className="text-gray-600">
                    {selectedOrder.city}, {selectedOrder.state} - <span className="font-mono">{selectedOrder.pincode}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Items Ordered */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 border-b pb-2">
                <FileText className="w-4 h-4 text-green-600" /> Items Ordered
              </h3>
              
              {/* Desktop Table View */}
              <div className="hidden md:block border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left text-gray-600 font-medium border-b border-gray-200">
                    <tr>
                      <th className="p-3">Product Name</th>
                      <th className="p-3 text-right">Price</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700 bg-white">
                    {selectedOrder.items.map((item, i) => (
                      <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-3 font-medium text-gray-900">{item.product_name}</td>
                        <td className="p-3 text-right">₹{item.price.toLocaleString("en-IN")}</td>
                        <td className="p-3 text-center">{item.qty}</td>
                        <td className="p-3 text-right font-semibold text-gray-900">₹{(item.price * item.qty).toLocaleString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="block md:hidden space-y-3">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2 bg-white">
                    <div className="font-semibold text-gray-900">{item.product_name}</div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                      <div>
                        <span className="text-gray-400 block">Price</span>
                        <span className="font-medium text-gray-800">₹{item.price.toLocaleString("en-IN")}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Qty</span>
                        <span className="font-medium text-gray-800">{item.qty}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-400 block">Total</span>
                        <span className="font-bold text-green-700">₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Info & Cost Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pt-4 border-t border-gray-100">
              {/* Payment details */}
              <div className="border border-gray-100 rounded-lg p-4 bg-gray-50/50">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 border-b pb-2">
                  <CreditCard className="w-4 h-4 text-green-600" /> Payment & Transaction Info
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Method:</span>
                    <span className="font-semibold uppercase text-gray-900">{selectedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment Status:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      selectedOrder.status.toLowerCase() === "success" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  {selectedOrder.paymentMethod === "Online" && selectedOrder.paymentInfo && (
                    <div className="pt-2 border-t border-gray-100 space-y-1.5 font-mono text-[11px] text-gray-500">
                      <div>
                        <span className="text-gray-400 block font-sans text-xs font-normal">Razorpay Order ID:</span>
                        <span className="break-all select-all font-semibold text-gray-700">{selectedOrder.paymentInfo.razorpay_order_id || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block font-sans text-xs font-normal">Razorpay Payment ID:</span>
                        <span className="break-all select-all font-semibold text-gray-700">{selectedOrder.paymentInfo.razorpay_payment_id || "N/A"}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Cost summary */}
              <div className="border border-gray-100 rounded-lg p-4 bg-gray-50/50">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 border-b pb-2">
                  Summary
                </h3>
                <div className="space-y-2 text-sm text-gray-700 font-normal">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal:</span>
                    <span className="font-medium text-gray-900">₹{(selectedOrder.subtotal || 0).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping Charges:</span>
                    <span className="font-medium text-gray-900">₹{(selectedOrder.shipping || 0).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tax:</span>
                    <span className="font-medium text-gray-900">₹{(selectedOrder.tax || 0).toLocaleString("en-IN")}</span>
                  </div>
                  {selectedOrder.couponCode && (
                    <div className="flex justify-between text-green-700">
                      <span>Coupon Discount ({selectedOrder.couponCode}):</span>
                      <span className="font-medium">-₹{(selectedOrder.couponDiscount || 0).toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2 mt-2">
                    <span className="text-base font-bold text-gray-800">Grand Total:</span>
                    <span className="text-lg font-bold text-green-700">₹{(selectedOrder.total || 0).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer with Actions */}
            <div className="flex justify-end items-center pt-4 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="w-full sm:w-auto px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md text-sm transition-colors border border-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Marking Payment as Success */}
      {confirmPaymentModal.open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[60] p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl space-y-4 animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-900">Confirm Payment Received</h3>
            <p className="text-gray-600 text-sm">
              Are you sure the payment has been completed for Order{" "}
              <span className="font-mono font-semibold text-gray-900">#{confirmPaymentModal.orderCode}</span>?
            </p>
            <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-md border border-amber-200">
              ⚠️ Once marked as <strong>Success</strong>, payment status will be locked and a payment record will be automatically created in the payments table.
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmPaymentModal({ open: false, orderId: null, orderCode: "", newStatus: "" })}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmPaymentStatusChange}
                className="px-4 py-2 text-sm text-white bg-green-700 hover:bg-green-800 rounded-md font-semibold transition-colors"
              >
                Yes, Payment Received
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTab;