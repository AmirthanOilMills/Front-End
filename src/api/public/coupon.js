import { postRequest } from "../api";

export function validateCoupon(coupon_name) {
  return postRequest("/coupon/validate", { coupon_name });
}
