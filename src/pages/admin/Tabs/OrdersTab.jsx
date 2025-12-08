import React, { useState, useEffect } from "react";
import { Eye, Edit } from "lucide-react";
import { getAllOrders, updateStatus } from "../../../api/public/Order";


const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMethod, setFilterMethod] = useState("");
  const [search, setSearch] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(3);
  const [totalPages, setTotalPages] = useState(1);

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
          <option value="rejected">Rejected</option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order._id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{order.userName || "N/A"}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{order.email || "N/A"}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{order.phone || "N/A"}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">₹{order.total}</td>

                      <td className="px-6 py-4 text-sm text-gray-900 uppercase">
                        {order.paymentMethod || "N/A"}
                      </td>

                      <td className="px-6 py-4">
                        <select
                          value={order.status.toLowerCase()}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="text-xs font-semibold rounded-full px-2 py-1 border border-gray-300 focus:ring-2 focus:ring-green-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="success">Success</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Order Items */}
                    <tr>
                      <td colSpan="9" className="px-6 py-2 bg-gray-50">
                        <table className="min-w-full divide-y divide-gray-200 border rounded-md">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                            </tr>
                          </thead>

                          <tbody className="bg-white divide-y divide-gray-200">
                            {order.items.map((item, i) => (
                              <tr key={i}>
                                <td className="px-4 py-2 text-sm text-gray-900">{item.product_name}</td>
                                <td className="px-4 py-2 text-sm text-gray-900">₹{item.price}</td>
                                <td className="px-4 py-2 text-sm text-gray-900">{item.qty}</td>
                                <td className="px-4 py-2 text-sm text-gray-900">₹{item.price * item.qty}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-4 text-center text-gray-500 text-sm"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* -------- PAGINATION UI -------- */}
        <div className="p-4 flex justify-center items-center gap-2 border-t">

          {/* Prev */}
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className={`px-3 py-1 rounded-md border 
              ${page === 1 ? "bg-gray-200 cursor-not-allowed" : "hover:bg-gray-100"}
            `}
          >
            Prev
          </button>

          {/* Page numbers */}
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded-md border 
                ${page === i + 1 ? "bg-green-600 text-white" : "hover:bg-gray-100"}
              `}
            >
              {i + 1}
            </button>
          ))}

          {/* Next */}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            className={`px-3 py-1 rounded-md border 
              ${page === totalPages ? "bg-gray-200 cursor-not-allowed" : "hover:bg-gray-100"}
            `}
          >
            Next
          </button>

        </div>
      </div>
    </div>
  );
};

export default OrdersTab;
