import React, { useState, useEffect } from "react";
import { Eye, Trash2, CheckCircle } from "lucide-react";
import {
    getAllContactMessages,
    markMessageAsRead,
} from "../../../api/admin/contact";
import { showToast } from "../../../components/common/Toast";
import Pagination from "../../../components/common/Pagination";

const ContactFormTab = () => {
    const [messages, setMessages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        loadMessages();
    }, [currentPage]);

    const loadMessages = async () => {
        try {
            const res = await getAllContactMessages(currentPage, 5);

            if (res.success) {
                setMessages(res.data);
                setTotalPages(res.pagination.totalPages);
                return;
            }

            showToast(res.message || "Failed to fetch messages", "error");

        } catch (err) {
            console.error(err);
            showToast("Something went wrong!", "error");
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            const res = await markMessageAsRead(id);

            if (res.success) {
                showToast("Marked as Read", "success");
                loadMessages();
                return;
            }

            showToast(res.message || "Failed to update", "error");

        } catch (err) {
            console.error(err);
            showToast("Something went wrong!", "error");
        }
    };

    

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Contact Form Messages</h2>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Full Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Read</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            {messages.map((msg) => (
                                <tr key={msg._id}>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {msg.fullName}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{msg.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{msg.phone}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{msg.subject}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{msg.message}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {new Date(msg.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full 
                                            ${msg.read ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                                        >
                                            {msg.read ? "Read" : "Unread"}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-sm font-medium space-x-3 flex">
                                        {!msg.read && (
                                            <button
                                                className="text-green-600 hover:text-green-900"
                                                onClick={() => handleMarkAsRead(msg._id)}
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                            </button>
                                        )}

                                        {/* <button
                                            className="text-red-600 hover:text-red-900"
                                            onClick={() => handleDelete(msg._id)}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button> */}
                                    </td>
                                </tr>
                            ))}

                            {messages.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500 text-sm">
                                        No messages found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </div>
    );
};

export default ContactFormTab;
