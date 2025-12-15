import React, { useState, useEffect } from "react";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
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
    } catch (err) {
      console.error("Failed to update order status:", err);
      alert("Failed to update status.");
    }
  };

  const handleOrderStatusChange = async (id, newOrderStatus) => {
    try {
      await updateOrderStatus(id, newOrderStatus);
      fetchOrders();
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
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="w-full text-sm font-semibold rounded-md px-3 py-2 border focus:ring-2 focus:ring-green-500 focus:outline-none"
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
                    <td className="px-4 xl:px-6 py-4 text-sm text-gray-900">{order.userName}{order.phone}</td>
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
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="text-xs font-semibold rounded-full px-2 py-1 border focus:ring-2 focus:ring-green-500 focus:outline-none"
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
          <div className="bg-white p-4 md:p-6 rounded-lg w-full max-w-2xl shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-base md:text-lg font-bold mb-4">
              Order Items - #{selectedOrder.orderId}
            </h2>

            {/* Mobile View - Card Layout */}
            <div className="block md:hidden space-y-3">
              {selectedOrder.items.map((item, i) => (
                <div key={i} className="border rounded-lg p-3 space-y-2">
                  <div className="font-semibold text-gray-900">{item.product_name}</div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Price:</span>
                      <div className="font-medium">₹{item.price}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Qty:</span>
                      <div className="font-medium">{item.qty}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Total:</span>
                      <div className="font-bold text-green-700">₹{item.price * item.qty}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View - Table Layout */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm border">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="p-2">Product</th>
                    <th className="p-2">Price</th>
                    <th className="p-2">Qty</th>
                    <th className="p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">{item.product_name}</td>
                      <td className="p-2">₹{item.price}</td>
                      <td className="p-2">{item.qty}</td>
                      <td className="p-2 font-semibold">₹{item.price * item.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={closeModal}
              className="mt-4 w-full md:w-auto px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTab;