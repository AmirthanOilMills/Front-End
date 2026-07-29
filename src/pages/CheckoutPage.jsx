import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle, Tag, X } from 'lucide-react';
import useStore from '../helpers/useStore';
import { useNavigate } from 'react-router-dom';
import { createCODOrder, createRazorpayOrder, verifyPayment } from '../api/public/Order';
import { validateCoupon } from '../api/public/coupon';
import { useAuth } from '../contexts/AuthContext';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  // Zustand store
  const cart = useStore((state) => state.cart);
  const clearCart = useStore((state) => state.clearCart);
  const addOrder = useStore((state) => state.addOrder);
  const [invoiceUrl, setInvoiceUrl] = useState(null);
  const [errors, setErrors] = useState({});

  // State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod',
  });

  // Auto-fill user details if user loads after initial render
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Coupon State
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, percentage }
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  // Price calculation
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shippingCost = subtotal >= 500 ? 0 : 50;

  // Coupon discount calculation
  const couponDiscount = appliedCoupon
    ? Math.round(subtotal * (appliedCoupon.percentage / 100))
    : 0;

  const RAZORPAY_FEE_PERCENT = 2;

  // Razorpay fee only for online payment (calculated on subtotal + shipping - discount)
  const Tax =
    formData.paymentMethod === "online"
      ? Math.max(0, subtotal + shippingCost - couponDiscount) * (RAZORPAY_FEE_PERCENT / 100)
      : 0;

  const finalTotalWithTax = subtotal + shippingCost + Tax - couponDiscount;
  const finalTotal = Math.max(0, Math.round(finalTotalWithTax));

  // Coupon Handlers
  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }
    setCouponLoading(true);
    setCouponError("");
    setCouponSuccess("");
    try {
      const res = await validateCoupon(couponInput.trim());
      if (res.success && res.coupon) {
        setAppliedCoupon({
          code: res.coupon.coupon_name,
          percentage: res.coupon.percentage,
        });
        setCouponSuccess(`Coupon "${res.coupon.coupon_name}" applied (${res.coupon.percentage}% OFF)`);
        setCouponInput("");
      } else {
        setCouponError(res.message || "Invalid coupon code");
      }
    } catch (err) {
      setCouponError(err.response?.data?.message || "Failed to validate coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess("");
    setCouponError("");
  };

  // Input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));

    // validate while typing
    setErrors(prev => {
      const newErr = { ...prev };

      switch (name) {
        case "name":
          value.trim() ? delete newErr.name : newErr.name = "Name is required";
          break;

        case "email":
          if (!value.trim()) delete newErr.email;
          else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            emailRegex.test(value)
              ? delete newErr.email
              : newErr.email = "Invalid email";
          }
          break;

        case "phone":
          /^[0-9]{10}$/.test(value)
            ? delete newErr.phone
            : newErr.phone = "Phone must be 10 digits";
          break;

        case "address":
          value.trim()
            ? delete newErr.address
            : newErr.address = "Address required";
          break;

        case "city":
          value.trim()
            ? delete newErr.city
            : newErr.city = "City required";
          break;

        case "state":
          value.trim()
            ? delete newErr.state
            : newErr.state = "State required";
          break;

        case "pincode":
          /^[0-9]{6}$/.test(value)
            ? delete newErr.pincode
            : newErr.pincode = "PIN must be 6 digits";
          break;

        default:
          break;
      }

      return newErr;
    });
  };


  const validateBeforeSubmit = () => {
    return Object.keys(errors).length === 0 &&
      formData.name.trim() &&
      formData.phone.trim() &&
      formData.address.trim() &&
      formData.city.trim() &&
      formData.state.trim() &&
      formData.pincode.trim();
  };


  // -----------------------------
  // Submit Checkout
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateBeforeSubmit()) {
      alert("Please fix form errors.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    if (!formData.address.trim()) {
      alert("Please enter delivery address.");
      return;
    }

    setIsSubmitting(true);

    const orderEmail = (formData.email || user?.email || "").trim().toLowerCase();

    // -----------------------------
    // (A) Cash on Delivery
    // -----------------------------
    if (formData.paymentMethod === "cod") {
      const orderData = {
        userName: formData.name || user?.name || "",
        phone: formData.phone || user?.phone || "",
        email: orderEmail,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        items: cart,
        subtotal,
        shipping: shippingCost,
        tax: Tax || 0,
        couponCode: appliedCoupon?.code || "",
        couponDiscount,
        total: finalTotal,
        paymentMethod: "COD",
      };

      try {
        const res = await createCODOrder(orderData);
        addOrder(res.order.orderId);
        setInvoiceUrl(res.order.invoiceUrl);
        clearCart();
        setOrderPlaced(true);
      } catch (err) {
        console.error("COD Order Error:", err);
        alert("Failed to place COD order. Please try again.");
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

      // Step 1: Create Razorpay Order
      const { razorpayOrder } = await createRazorpayOrder({
        total: finalTotal,
      });

      if (!razorpayOrder) {
        throw new Error("Razorpay order not created");
      }

      // Step 2: Configure Razorpay Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount.toString(),
        currency: razorpayOrder.currency,
        name: "Amirthan Oil",
        description: "Order Payment",
        order_id: razorpayOrder.id,

        // Step 3: Payment Success Handler
        handler: async (response) => {
          try {
            // Verify payment on backend
            const verifyRes = await verifyPayment({
              userName: formData.name || user?.name || "",
              phone: formData.phone || user?.phone || "",
              email: orderEmail,
              address: formData.address,
              city: formData.city,
              state: formData.state,
              pincode: formData.pincode,
              items: cart,
              subtotal,
              shipping: shippingCost,
              tax: Tax || 0,
              couponCode: appliedCoupon?.code || "",
              couponDiscount,
              total: finalTotal,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.success) {
              // Order created successfully after payment verification
              addOrder(verifyRes.order.orderId);
              setInvoiceUrl(verifyRes.order.invoiceUrl);
              clearCart();
              setOrderPlaced(true);
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error("Payment verification failed:", err);
            alert("Payment verification failed. Please contact support with your payment ID: " + response.razorpay_payment_id);
          } finally {
            setIsSubmitting(false);
          }
        },

        prefill: {
          name: formData.name,
          email: formData.email || "customer@example.com",
          contact: formData.phone,
        },

        theme: {
          color: "#65a30d"
        },

        // Step 4: Handle Modal Dismissal (user closes without paying)
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
            alert("Payment cancelled. Your order was not placed.");
          }
        }
      };

      // Step 5: Open Razorpay Modal
      const rzp = new window.Razorpay(options);

      // Handle payment failure
      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        alert(`Payment failed: ${response.error.description}`);
        setIsSubmitting(false);
      });

      rzp.open();

      // DON'T set setIsSubmitting(false) here!
      // It will be handled in handler, ondismiss, or payment.failed

    } catch (err) {
      console.error("Razorpay Checkout Error:", err);
      alert("Something went wrong. Please try again.");
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
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div className="mb-6">
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div className="mb-6">
                <label className="block mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.phone ? "border-red-500" : ""}`}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div className="mb-6">
                <label className="block mb-2">Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.address ? "border-red-500" : ""}`}
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <input
                  type="text"
                  name="city"
                  placeholder="City *"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`px-3 py-2 border rounded-md ${errors.city ? "border-red-500" : ""}`}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                <input
                  type="text"
                  name="state"
                  placeholder="State *"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={`px-3 py-2 border rounded-md ${errors.state ? "border-red-500" : ""}`}
                />
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                <input
                  type="text"
                  name="pincode"
                  placeholder="PIN *"
                  pattern="[0-9]{6}"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className={`px-3 py-2 border rounded-md ${errors.pincode ? "border-red-500" : ""}`}
                />
                {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
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
                <div key={item.cartId || item.id || item._id} className="flex items-center space-x-3">
                  <img
                    src={item.images?.[0]?.url || "../assets/no-image.png"}
                    className="w-12 h-12 object-cover rounded"
                    alt={item.product_name}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.product_name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                  </div>
                  <p className="text-sm font-medium">₹{(item.price * item.qty).toFixed(2)}</p>
                </div>
              ))}
            </div>

            {/* Coupon Section */}
            <div className="border-t pt-4 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-green-700" /> Have a Coupon?
              </label>

              {appliedCoupon ? (
                <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-sm font-bold text-green-800 uppercase">{appliedCoupon.code}</p>
                      <p className="text-xs text-green-600">{appliedCoupon.percentage}% Discount Applied</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition"
                    title="Remove coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter Coupon Code"
                    className="flex-1 px-3 py-2 border rounded-md uppercase text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                    className="px-4 py-2 bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white rounded-md text-sm font-semibold transition"
                  >
                    {couponLoading ? "Applying..." : "Apply"}
                  </button>
                </div>
              )}

              {couponError && <p className="text-red-500 text-xs mt-1.5">{couponError}</p>}
              {couponSuccess && <p className="text-green-600 text-xs mt-1.5">{couponSuccess}</p>}
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shippingCost === 0 ? "Free" : `₹${shippingCost}`}</span></div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-700">
                  <span>Coupon Discount ({appliedCoupon.percentage}%)</span>
                  <span>-₹{couponDiscount.toFixed(2)}</span>
                </div>
              )}
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