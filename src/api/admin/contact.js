import { deleteRequest, getRequest, postRequest, putRequest } from "../api";

// Create a new contact message
export function addContactMessage(data) {
    return postRequest('/new-contact', data);
}

// Get all contact messages with pagination
export function getAllContactMessages(page = "", limit = "") {
    return getRequest(`/admin/contact?page=${page}&limit=${limit}`);
}

// Mark a message as read
export function markMessageAsRead(id) {
    return putRequest(`/admin/contact/read/${id}`, { read: true });
}


