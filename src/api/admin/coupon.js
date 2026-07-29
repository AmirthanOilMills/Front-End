import { deleteRequest, getRequest, postRequest, putRequest } from "../api"

export function addCoupon(data){
    return postRequest('/admin/coupon', data);
}

export function getAllCoupons(page="", limit=""){
    return getRequest(`/admin/coupon?page=${page}&limit=${limit}`);
}

export function deleteCoupon(id){
    return deleteRequest(`/admin/coupon/${id}`);
}

export function updateCoupon(id, data){
    return putRequest(`/admin/coupon/${id}`, data);
}

export function checkCouponNameExists(coupon_name, excludeId=""){
    return getRequest(`/admin/coupon/check-name?coupon_name=${encodeURIComponent(coupon_name)}&excludeId=${excludeId}`);
}

export function getCouponUsage(code, range = "today", startDate = "", endDate = ""){
    let query = `/admin/coupon/usage/${encodeURIComponent(code)}?range=${range}`;
    if (startDate) query += `&startDate=${startDate}`;
    if (endDate) query += `&endDate=${endDate}`;
    return getRequest(query);
}
