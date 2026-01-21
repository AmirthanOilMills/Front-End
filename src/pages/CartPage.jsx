import React from "react";
import { Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import useStore from "../helpers/useStore";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const navigate = useNavigate();

  // Zustand store hooks
  const cart = useStore((state) => state.cart);
  const updateQty = useStore((state) => state.updateCartQty);
  const removeFromCart = useStore((state) => state.removeFromCart);

  // Calculate subtotal
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Empty cart view
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-green-800 hover:bg-green-900 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* PAGE TITLE */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            {cart.length} item{cart.length !== 1 ? "s" : ""} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* CART ITEMS */}
          {/* CART ITEMS */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-sm border p-4 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-4">

                  {/* PRODUCT IMAGE */}
                  <div className="flex-shrink-0 mx-auto sm:mx-0">
                    <img
                      src={item.images?.[0]?.url || "../assets/no-image.png"}
                      alt={item.product_name}
                      className="w-28 h-28 object-cover rounded-lg border"
                    />
                  </div>

                  {/* PRODUCT DETAILS */}
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.product_name}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Category:{" "}
                      <span className="font-medium text-gray-700">
                        {item?.category_id?.category_name || "Unknown Category"}
                      </span>
                    </p>

                    <p className="mt-3 text-sm text-gray-500">Price</p>
                    <p className="text-lg font-bold text-green-800">
                      ₹{item.price}
                    </p>
                  </div>

                  {/* QUANTITY + ACTIONS */}
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-sm text-gray-500">Quantity</p>

                    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                      <button
                        onClick={() => updateQty(item._id, Math.max(1, item.qty - 1))}
                        className="p-2 hover:bg-gray-100 transition"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="px-4 py-2 min-w-[44px] text-center text-sm font-medium">
                        {item.qty}
                      </span>

                      <button
                        onClick={() => updateQty(item._id, item.qty + 1)}
                        className="p-2 hover:bg-gray-100 transition"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="
                      inline-flex items-center gap-2 px-3 py-1.5 bg-red-600 text-sm font-medium text-white rounded-lg cursor-pointer hover:bg-red-500 hover:text-white
                      transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                    >
                      Remove
                    </button>

                  </div>

                  {/* ITEM TOTAL */}
                  <div className="text-center sm:text-right mt-2 sm:mt-0">
                    <p className="text-sm text-gray-500">Item Total</p>
                    <p className="text-lg font-bold text-gray-900">
                      ₹{(item.price * item.qty).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* CONTINUE SHOPPING */}
            <button
              onClick={() => navigate("/products")}
              className="
    mt-8 inline-flex items-center gap-2
    px-6 py-3
    rounded-xl
    border border-green-700
    text-green-800 font-semibold
    hover:bg-green-50
    transition-all duration-200
    active:scale-95
  "
            >
              Continue Shopping
              <ArrowRight className="w-5 h-5" />
            </button>

          </div>


          {/* ORDER SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8 space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>

              {/* SUBTOTAL */}
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>
              </div>

              {/* SHIPPING */}
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">{subtotal >= 500 ? "Free" : "₹50.00"}</span>
              </div>

              {/* FREE SHIPPING MESSAGE */}
              {subtotal < 500 && (
                <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
                  Add ₹{(500 - subtotal).toFixed(2)} more to get free shipping!
                </div>
              )}

              <hr />

              {/* TOTAL */}
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-green-800">
                  ₹{(subtotal + (subtotal >= 500 ? 0 : 50)).toFixed(2)}
                </span>
              </div>

              {/* CHECKOUT BUTTON */}
              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-green-800 hover:bg-green-900 text-white font-semibold py-3 px-4 rounded-lg transition-colors mt-6 flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
