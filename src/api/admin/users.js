import { deleteRequest, getRequest, postRequest, putRequest} from "../api"

export function addUser(data){
    return postRequest('/admin/users',data);
}

export function getAllUsers(page="",limit=""){
    return getRequest(`/admin/users?page=${page}&limit=${limit}`);
}

export function deleteUser(data){
    return deleteRequest(`/admin/users/${data}`);
}

export function updateUser(id,data){
    return putRequest(`/admin/users/${id}`,data)
}

export function getAllCustomers() {
    return getRequest('/admin/users/customers');
}
