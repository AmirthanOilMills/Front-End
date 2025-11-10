import { postRequest } from "./api";

export function login(data){
    return postRequest('/auth/login',data)
}

export function register(data){
    return postRequest('/auth/register',data)
}