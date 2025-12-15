import { getRequest, postRequest } from "./api";


export const login = async (data) => {
  const response = await postRequest("/auth/login", data);

  // ✅ Save token & user to localStorage
  if (response?.token) {
    localStorage.setItem("token", response.token);
  }

  return response;
};

export const register = async (data) => {
  const response = await postRequest("/auth/register", data);

  // ✅ Save token & user to localStorage
  if (response?.token) {
    localStorage.setItem("token", response.token);
  }

  return response;
};


export function getCurrentUser(){
    return getRequest('/auth/get-user')
}

export const logOut = () => {
  localStorage.removeItem("token");
};