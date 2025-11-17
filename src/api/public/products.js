import { deleteRequest, getRequest, postRequest, putRequest} from "../api"

export function getAllProducts(page,limit){
    return getRequest(`/products?page=${page}&limit=${limit}`);
}
