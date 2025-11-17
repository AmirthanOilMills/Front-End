import { deleteRequest, getRequest, postRequest, putRequest} from "../api"

export function addProducts(data){
    return postRequest('/admin/products',data);
}

export function getAllProducts(page,limit){
    return getRequest(`/admin/products?page=${page}&limit=${limit}`);
}

export function deleteProducts(data){
    return deleteRequest(`/admin/products/${data}`);
}

export function updateProducts(id,data){
    return putRequest(`/admin/products/${id}`,data)
}