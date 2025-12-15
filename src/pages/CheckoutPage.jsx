import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle } from 'lucide-react';
import useStore from '../helpers/useStore';
import { useNavigate } from 'react-router-dom';
import { createCODOrder, createOnlineOrder, verifyPayment } from '../api/public/Order';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const CheckoutPage = () => {
  const navigate = useNavigate();
  // Zustand store
  const cart = useStore((state) => state.cart);
  const clearCart = useStore((state) => state.clearCart);
  const addOrder = useStore((state) => state.addOrder);
  const [invoiceUrl, setInvoiceUrl] = useState(null);
  // State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Price calculation
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shippingCost = subtotal >= 500 ? 0 : 50;
  // const finalTotal = subtotal + shippingCost;

  const RAZORPAY_FEE_PERCENT = 2;

  // Razorpay fee only for online payment
  const Tax =
    formData.paymentMethod === "online"
      ? (subtotal + shippingCost) * (RAZORPAY_FEE_PERCENT / 100)
      : 0;

  const finalTotalWithTax = subtotal + shippingCost + Tax;
  const finalTotal = Math.round(finalTotalWithTax);

  // Input change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // -----------------------------
  // Submit Checkout
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    if (!formData.address.trim()) {
      alert("Please enter delivery address.");
      return;
    }

    setIsSubmitting(true);

    // -----------------------------
    // (A) Cash on Delivery
    // -----------------------------
    if (formData.paymentMethod === "cod") {
      const orderData = {
        userName: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        items: cart,
        subtotal,
        shipping: shippingCost,
        tax: Tax || 0,
        total: finalTotal,
        paymentMethod: "COD",
      };

      try {
        const res = await createCODOrder(orderData);
        addOrder(res.order.orderId); // Add COD order to store
        setInvoiceUrl(res.order.invoiceUrl);
        clearCart();
        setOrderPlaced(true);
      } catch (err) {
        console.error("COD Order Error:", err);
        alert("Failed to place COD order.");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // -----------------------------
    // (B) Online Payment via Razorpay
    // -----------------------------
    try {

      if (!window.Razorpay) {
        alert("Payment gateway is loading. Please try again in a moment.");
        setIsSubmitting(false);
        return;
      }

      const orderPayload = {
        userName: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        items: cart,
        subtotal,
        shipping: shippingCost,
        tax: Tax || 0,
        total: finalTotal,
        paymentMethod: "Online",
      };

      const data = await createOnlineOrder(orderPayload);
      const { razorpayOrder, order } = data;

      if (!razorpayOrder) throw new Error("Razorpay order not created");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount.toString(),
        currency: razorpayOrder.currency,
        name: "Amirthan Oil",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            // Verify payment on backend
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            //  Add verified order to store
            addOrder(verifyRes.order.orderId);
            setInvoiceUrl(verifyRes.order.invoiceUrl);
            clearCart();
            setOrderPlaced(true);
          } catch (err) {
            console.error("Payment verification failed:", err);
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email || "customer@example.com",
          contact: formData.phone,
        },
        theme: { color: "#0E9F6E" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", (resp) => {
        console.error("Payment failed:", resp.error);
        alert("Payment failed. Please try again.");
      });

    } catch (err) {
      console.error("Razorpay Checkout Error:", err);
      alert("Something went wrong during online payment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -----------------------------
  // Order Success Screen
  // -----------------------------
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your order! We will contact you soon.
          </p>

          <div className="space-y-3">
            {/* <button
              onClick={() => navigate('/')}
              className="w-full bg-green-800 hover:bg-green-900 text-white font-semibold py-3 rounded-lg"
            >
              Continue Shopping
            </button> */}
            {/* Invoice */}
            {invoiceUrl && (
              <a
                href={`${BASE_URL}/${invoiceUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-green-600 text-white font-semibold rounded-md mt-4 hover:bg-green-700 transition"
              >
                Download Invoice
              </a>
            )}
            <button
              onClick={() => navigate('/products')}
              className="w-full border border-green-800 text-green-800 hover:bg-green-50 font-semibold py-3 rounded-lg"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------
  // Checkout Form UI
  // -----------------------------
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center text-green-800 hover:text-green-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Cart
        </button>

        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-gray-600 mb-8">Complete your order</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT FORM */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit}>
              {/* Personal Info */}
              <div className="mb-6">
                <label className="block mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2">Address *</label>
                <textarea
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <input
                  type="text"
                  name="city"
                  placeholder="City *"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="px-3 py-2 border rounded-md"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State *"
                  required
                  value={formData.state}
                  onChange={handleInputChange}
                  className="px-3 py-2 border rounded-md"
                />
                <input
                  type="text"
                  name="pincode"
                  placeholder="PIN *"
                  pattern="[0-9]{6}"
                  required
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="px-3 py-2 border rounded-md"
                />
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                  />
                  <Truck className="w-5 h-5 text-green-600" />
                  <span>Cash on Delivery</span>
                </label>
                <label className="flex items-center space-x-2 mt-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={formData.paymentMethod === 'online'}
                    onChange={handleInputChange}
                  />
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <span>Online Payment</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-800 hover:bg-green-900 disabled:bg-gray-400 text-white py-3 rounded-md flex justify-center items-center space-x-2"
              >
                {isSubmitting ? "Processing..." : <>
                  <Shield className="w-5 h-5" /> <span>Place Order</span>
                </>}
              </button>
            </form>
          </div>

          {/* RIGHT SUMMARY */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-8">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {cart.map(item => (
                <div key={item.id || item._id} className="flex items-center space-x-3">
                  <img src={`${import.meta.env.VITE_BASE_URL}${item.images[0]}`} className="w-12 h-12 object-cover rounded" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.product_name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                  </div>
                  <p className="text-sm font-medium">₹{(item.price * item.qty).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shippingCost === 0 ? "Free" : `₹${shippingCost}`}</span></div>
              {formData.paymentMethod == "online" && (
                <div className="flex justify-between">
                  <span>Online Payment Fee (2%)</span>
                  <span>₹{Tax.toFixed(2)}</span>
                </div>
              )}


              <div className="flex justify-between text-lg font-bold border-t pt-3">
                <span>Total</span>
                <span className="text-green-800">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;