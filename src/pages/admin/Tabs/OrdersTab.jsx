import React, { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import { getAllOrders, updateOrderStatus, updateStatus } from "../../../api/public/Order";

const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMethod, setFilterMethod] = useState("");
  const [search, setSearch] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(3);
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
      console.log(res);
      setOrders(res.orders || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await updateStatus(id, newStatus)
      console.log(res);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search by name, email, phone, order ID..."
          className="px-4 py-2 border border-gray-300 rounded-md w-72 focus:ring-2 focus:ring-green-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="success">Success</option>
        </select>

        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          value={filterMethod}
          onChange={(e) => setFilterMethod(e.target.value)}
        >
          <option value="">All Methods</option>
          <option value="cod">COD</option>
          <option value="online">Online</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Order Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4">#{order.orderId}</td>
                    <td className="px-6 py-4">{order.userName}</td>
                    <td className="px-6 py-4">{order.email}</td>
                    <td className="px-6 py-4">{order.phone}</td>
                    <td className="px-6 py-4">₹{order.total}</td>
                    <td className="px-6 py-4 uppercase">{order.paymentMethod}</td>

                    {/* Payment Status */}
                    <td className="px-6 py-4">
                      <select
                        value={order.status.toLowerCase()}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className="text-xs font-semibold rounded-full px-2 py-1 border"
                      >
                        <option value="pending">Pending</option>
                        <option value="success">Success</option>
                      </select>
                    </td>

                    {/* Order Status */}
                    <td className="px-6 py-4">
                      <select
                        value={order.orderStatus.toLowerCase()}
                        onChange={(e) =>
                          handleOrderStatusChange(order._id, e.target.value)
                        }
                        className="text-xs font-semibold rounded-full px-2 py-1 border"
                      >
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="out for delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>

                    <td className="px-6 py-4">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openModal(order)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="px-6 py-4 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="p-4 flex justify-center items-center gap-2 border-t">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded-md"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded-md ${
                page === i + 1 ? "bg-green-600 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded-md"
          >
            Next
          </button>
        </div>
      </div>

      {/* ------------------ POPUP MODAL ------------------ */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[450px] shadow-lg">
            <h2 className="text-lg font-bold mb-4">
              Order Items - {selectedOrder.orderId}
            </h2>

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
                    <td className="p-2">₹{item.price * item.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md"
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
