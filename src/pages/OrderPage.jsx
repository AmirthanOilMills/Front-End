import React from "react";
import useStore from "../helpers/useStore";

const OrderPage = () => {
  const orders = useStore((state) => state.orders);

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {(!orders || orders.length === 0) ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id || order.orderId} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">
                Order ID: {order.orderId || order._id}
              </h2>
              <p className="text-gray-600">
                Date: {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
              </p>
              <p className="text-green-700 font-bold mt-2">
                Total: ₹{order.totalAmount || order.total}
              </p>

              <h3 className="text-lg font-semibold mt-4">Items:</h3>
              <div className="mt-2 space-y-2">
                {order.items?.map((item) => (
                  <div key={item._id} className="flex items-center">
                    <div>
                      <p className="font-medium">{item.product_name || "Unnamed Product"}</p>
                      <p className="text-sm text-gray-500">Qty: {item.qty || 1}</p>
                      <p className="text-sm">₹{(item.price || 0) * (item.qty || 1)}</p>
                    </div>
                  </div>
                )) || <p className="text-gray-500">No items in this order.</p>}
              </div>

              <p className="mt-4 text-sm text-blue-600">
                Status: {order.status || "Pending"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderPage;
