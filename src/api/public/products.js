import { getRequest } from "../api"

export function getAllProducts(page, limit, search = "", category_id = "") {
    return getRequest(`/products?page=${page}&limit=${limit}&search=${search}&category_id=${category_id}`);
};