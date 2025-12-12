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
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between"
              >
                {/* PRODUCT IMAGE */}
                <img
                  src={`${import.meta.env.VITE_BASE_URL}${item.images?.[0] || "/no-image.png"}`}
                  alt={item.product_name}
                  className="w-24 h-24 object-cover rounded-lg"
                />

                {/* PRODUCT DETAILS */}
                <div className="flex-1 ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{item.product_name}</h3>
                  <p className="text-sm text-gray-500">
                    {item?.category_id?.category_name || "Unknown Category"}
                  </p>
                  <p className="text-lg font-bold text-green-800 mt-2">₹{item.price}</p>
                </div>

                {/* QUANTITY CONTROLS */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => updateQty(item._id, Math.max(1, item.qty - 1))}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300 min-w-[40px] text-center">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item._id, item.qty + 1)}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>

                {/* ITEM TOTAL */}
                <div className="text-right font-bold text-gray-900">
                  ₹{(item.price * item.qty).toFixed(2)}
                </div>
              </div>
            ))}

            {/* CONTINUE SHOPPING BUTTON */}
            <button
              onClick={() => navigate("/products")}
              className="text-green-800 hover:text-green-900 font-medium flex items-center mt-4"
            >
              Continue Shopping
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
