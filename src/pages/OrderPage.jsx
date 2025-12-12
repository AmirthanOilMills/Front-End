import React, { useEffect, useState } from "react";
import useStore from "../helpers/useStore";
import { getOrderbyOrderId } from "../api/public/Order";
const BASE_URL = import.meta.env.VITE_BASE_URL2;

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Success: "bg-green-100 text-green-800",
  Shipped: "bg-blue-100 text-blue-800",
  "Out for Delivery": "bg-indigo-100 text-indigo-800",
  Delivered: "bg-green-200 text-green-900",
};

const OrderPage = () => {
  const orderIds = useStore((state) => state.orders);
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (orderIds.length > 0) {
      fetchOrders();
    }
  }, [orderIds]);

  const fetchOrders = async () => {
    try {
      const res = await getOrderbyOrderId(orderIds); // POST { orderIds }
      setOrders(res.orders || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const filteredOrders = orders.filter((order) =>
    order.orderId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">My Orders</h1>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>

      {!filteredOrders.length ? (
        <p className="text-gray-500 text-center">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order._id || order.orderId}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition hover:shadow-xl"
            >
              {/* Header */}
              <div
                className="flex justify-between items-center px-6 py-4 cursor-pointer"
                onClick={() => toggleExpand(order.orderId)}
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Order ID: {order.orderId || order._id}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Date:{" "}
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status || "Pending"] || "bg-gray-100 text-gray-800"
                      }`}
                  >
                    Payment: {order.status || "Pending"}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.orderStatus || "Pending"] || "bg-gray-100 text-gray-800"
                      }`}
                  >
                    Order: {order.orderStatus || "Pending"}
                  </span>
                </div>
              </div>

              {/* Collapsible Content */}
              {expandedOrder === order.orderId && (
                <div className="px-6 py-4 border-t border-gray-200 space-y-4">
                  {/* Items */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Items</h3>
                    <div className="space-y-2">
                      {order.items?.length > 0 ? (
                        order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center bg-gray-50 p-3 rounded-md"
                          >
                            <div>
                              <p className="font-medium text-gray-800">{item.product_name}</p>
                              <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                            </div>
                            <p className="font-semibold text-gray-900">
                              ₹{(item.price || 0) * (item.qty || 1)}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No items in this order.</p>
                      )}
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="flex justify-between items-center bg-gray-100 p-3 rounded-md">
                    <p className="font-medium text-gray-800">Subtotal</p>
                    <p className="font-semibold text-gray-900">₹{order.subtotal}</p>
                  </div>
                  <div className="flex justify-between items-center bg-gray-100 p-3 rounded-md">
                    <p className="font-medium text-gray-800">Shipping</p>
                    <p className="font-semibold text-gray-900">₹{order.shipping}</p>
                  </div>
                  <div className="flex justify-between items-center bg-gray-100 p-3 rounded-md">
                    <p className="font-medium text-gray-800">Total</p>
                    <p className="font-bold text-green-700">₹{order.total}</p>
                  </div>

                  {/* Invoice */}
                  {order.invoiceUrl && (
                    <a
                      href={`${BASE_URL}${order.invoiceUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-green-600 text-white font-semibold rounded-md mt-4 hover:bg-green-700 transition"
                    >
                      Download Invoice
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderPage;
