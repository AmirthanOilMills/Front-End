import { getRequest, postRequest } from "./api";

export function login(data){
    return postRequest('/auth/login',data)
}

export function register(data){
    return postRequest('/auth/register',data)
}

export function getCurrentUser(){
    return getRequest('/auth/get-user')
}

export function logOut(){
    return getRequest('/auth/logout')
}