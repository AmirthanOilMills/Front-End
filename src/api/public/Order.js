import { getRequest, putRequest, postRequest } from "../api"

export function getAllOrders(
  page = 1,
  limit = 10,
  search = "",
  paymentMethod = "",
  status = ""
) {
  let query = `/order/allorders?page=${page}&limit=${limit}`;

  if (search) query += `&search=${search}`;
  if (paymentMethod) query += `&paymentMethod=${paymentMethod}`;
  if (status) query += `&status=${status}`;
  return getRequest(query);
}


export function getAllPayments(
  page = 1,
  limit = 10,
  status = "",
  search = ""
) {
  let query = `/order/allpayments?page=${page}&limit=${limit}`;

  if (status) query += `&status=${status}`;
  if (search) query += `&search=${search}`;


  return getRequest(query);
}

export async function updateStatus(id, newStatus) {
  try {
    const res = await putRequest(`/order/update-order/${id}`, { status: newStatus });
    return res;
  } catch (err) {
    console.error("Failed to update order status:", err);
    throw err; // propagate error to caller
  }
}

export async function updateOrderStatus(id, newOrderStatus) {
  try {
    const res = await putRequest(`/order/update-orderstatus/${id}`, { orderStatus: newOrderStatus });
    return res;
  } catch (err) {
    console.error("Failed to update order status:", err);
    throw err; // propagate error to caller
  }
}

export function getOrderbyOrderId(orderIds) {
  const res = postRequest("/order/order", { orderIds });
  return res;
}


// Create COD Order
export function createCODOrder(orderData) {
  return postRequest(`/order/create-order`, orderData);
}

// Create Online Order (Razorpay)
export function createOnlineOrder(orderPayload) {
  return postRequest(`/order/create-order`, orderPayload);
}

// Verify Payment
export function verifyPayment(payload) {
  return postRequest(`/order/verify-payment`, payload);
}

