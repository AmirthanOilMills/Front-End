import { deleteRequest, getRequest, postRequest, putRequest } from "../api"

export function addCategory(data){
    return postRequest('/admin/category',data);
}

export function getAllCategory(page,limit){
    return getRequest(`/admin/category?page=${page}&limit=${limit}`);
}

export function deleteCategory(data){
    return deleteRequest(`/admin/category/${data}`);
}

export function updateCategory(id,data){
    return putRequest(`/admin/category/${id}`,data)
}