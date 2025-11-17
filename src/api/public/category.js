import { deleteRequest, getRequest, postRequest, putRequest } from "../api"

export function getAllCategory(page,limit){
    return getRequest(`/category?page=${page}&limit=${limit}`);
}
