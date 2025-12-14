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
        <div className="space-y-4 md:space-y-6 p-4 md:p-0">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    Contact Form Messages
                </h2>
            </div>

            {/* Mobile View - Card Layout */}
            <div className="block lg:hidden space-y-4">
                {messages.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                        No messages found.
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            {/* Header with Status & Action */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${msg.read
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                    }`}>
                                    {msg.read ? "Read" : "Unread"}
                                </span>

                                {!msg.read && (
                                    <button
                                        className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                                        onClick={() => handleMarkAsRead(msg._id)}
                                        title="Mark as Read"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                    </button>
                                )}
                            </div>

                            {/* Message Details */}
                            <div className="p-4 space-y-3">
                                {/* Name */}
                                <div>
                                    <span className="text-xs text-gray-500 font-medium">Full Name</span>
                                    <p className="text-sm font-semibold text-gray-900 mt-1">
                                        {msg.fullName}
                                    </p>
                                </div>

                                {/* Contact Info */}
                                <div className="grid grid-cols-1 gap-2">
                                    <div>
                                        <span className="text-xs text-gray-500">Email</span>
                                        <p className="text-sm text-gray-900 break-all">{msg.email}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500">Phone</span>
                                        <p className="text-sm text-gray-900">{msg.phone}</p>
                                    </div>
                                </div>

                                {/* Subject */}
                                <div>
                                    <span className="text-xs text-gray-500">Subject</span>
                                    <p className="text-sm font-medium text-gray-900 mt-1">
                                        {msg.subject}
                                    </p>
                                </div>

                                {/* Message */}
                                <div>
                                    <span className="text-xs text-gray-500">Message</span>
                                    <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                                        {msg.message}
                                    </p>
                                </div>

                                {/* Date */}
                                <div className="pt-2 border-t">
                                    <span className="text-xs text-gray-500">Received on</span>
                                    <p className="text-xs text-gray-600 mt-1">
                                        {new Date(msg.createdAt).toLocaleString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Tablet & Desktop View - Table Layout */}
            <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer Details
                                </th>
                                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Subject
                                </th>
                                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Message
                                </th>
                                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created At
                                </th>
                                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            {messages.map((msg) => (
                                <tr key={msg._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 xl:px-6 py-4">
                                        <div className="text-sm font-semibold text-gray-900">
                                            {msg.fullName}
                                        </div>

                                        <div className="text-xs text-gray-500 mt-1">
                                            {msg.email}
                                        </div>

                                        <div className="text-xs text-gray-500">
                                            {msg.phone}
                                        </div>
                                    </td>
                                    <td className="px-4 xl:px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                                        {msg.subject}
                                    </td>
                                    <td className="px-4 xl:px-6 py-4 text-sm text-gray-700 max-w-md">
                                        <div className="line-clamp-2" title={msg.message}>
                                            {msg.message}
                                        </div>
                                    </td>
                                    <td className="px-4 xl:px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                                        <div>
                                            {new Date(msg.createdAt).toLocaleDateString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </div>
                                        <div className="text-gray-400">
                                            {new Date(msg.createdAt).toLocaleTimeString("en-IN", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                            })}
                                        </div>
                                    </td>
                                    <td className="px-4 xl:px-6 py-4">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${msg.read
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                            }`}>
                                            {msg.read ? "Read" : "Unread"}
                                        </span>
                                    </td>

                                    <td className="px-4 xl:px-6 py-4 text-sm font-medium">
                                        <div className="flex items-center gap-2">
                                            {!msg.read && (
                                                <button
                                                    className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors"
                                                    onClick={() => handleMarkAsRead(msg._id)}
                                                    title="Mark as Read"
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {messages.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="px-4 xl:px-6 py-8 text-center text-gray-500 text-sm">
                                        No messages found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </div>
    );
};

export default ContactFormTab;