import React, { useEffect, useState } from "react";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { getAllPayments } from "../../../api/public/Order";

const PaymentTab = () => {
    const [payments, setPayments] = useState([]);
    const [status, setStatus] = useState("");
    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);
    const [limit] = useState(3);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchPayments();
    }, [page, status, search]);

    const fetchPayments = async () => {
        try {
            const res = await getAllPayments(page, limit, status, search);
            setPayments(res.payments);
            setTotalPages(res.totalPages);
        } catch (error) {
            console.error("Error fetching payments:", error);
        }
    };

    // -------- STATUS STYLE -------- //
    const statusBadge = (status) => {
        const base = "px-3 py-1 text-xs font-semibold rounded-full";
        switch (status?.toLowerCase()) {
            case "success":
                return `${base} bg-green-100 text-green-700`;
            case "pending":
                return `${base} bg-yellow-100 text-yellow-700`;
            case "rejected":
                return `${base} bg-red-100 text-red-700`;
            default:
                return `${base} bg-gray-100 text-gray-700`;
        }
    };

    return (
        <div className="space-y-4 md:space-y-6 p-4 md:p-0">
            {/* HEADER */}
            <div className="flex flex-col gap-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    Payments Management
                </h2>

                <div className="flex flex-col sm:flex-row gap-3">
                    {/* SEARCH */}
                    <input
                        type="text"
                        placeholder="Search Name / Email / Phone"
                        className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
                        value={search}
                        onChange={(e) => {
                            setPage(1);
                            setSearch(e.target.value);
                        }}
                    />

                    {/* STATUS FILTER */}
                    <select
                        className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none w-full sm:w-auto"
                        value={status}
                        onChange={(e) => {
                            setPage(1);
                            setStatus(e.target.value);
                        }}
                    >
                        <option value="">All Status</option>
                        <option value="Success">Success</option>
                        <option value="Pending">Pending</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Mobile View - Card Layout */}
            <div className="block lg:hidden space-y-4">
                {payments?.length > 0 ? (
                    payments.map((payment) => (
                        <div key={payment._id} className="bg-white rounded-lg shadow-md p-4 space-y-3">
                            {/* Payment ID & Status */}
                            <div className="flex items-start justify-between border-b pb-3">
                                <div>
                                    <span className="text-xs text-gray-500">Payment ID</span>
                                    <p className="font-semibold text-gray-900 text-sm">
                                        #{payment.razorpay_payment_id || "N/A"}
                                    </p>
                                </div>
                                <span className={statusBadge(payment.status)}>
                                    {payment.status}
                                </span>
                            </div>

                            {/* Order ID */}
                            <div>
                                <span className="text-xs text-gray-500">Order ID</span>
                                <p className="text-sm font-medium text-gray-900">
                                    {payment?.orderId?.orderId || "N/A"}
                                </p>
                            </div>

                            {/* Customer Info */}
                            <div className="space-y-1">
                                <span className="text-xs text-gray-500">Customer</span>
                                <div className="text-sm">
                                    <div className="font-medium text-gray-900">
                                        {payment.orderId?.userName || "N/A"}
                                    </div>
                                    <div className="text-gray-600 text-xs">
                                        {payment.orderId?.phone}
                                    </div>
                                </div>
                            </div>

                            {/* Amount & Date */}
                            <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                <div>
                                    <span className="text-xs text-gray-500">Amount</span>
                                    <p className="text-base font-bold text-green-700">
                                        ₹{payment.amount}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500">Date</span>
                                    <p className="text-xs text-gray-900">
                                        {new Date(payment.createdAt).toLocaleString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                        No payments found.
                    </div>
                )}
            </div>

            {/* Tablet & Desktop View - Table Layout */}
            <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Payment ID
                                </th>
                                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            {payments?.length > 0 ? (
                                payments.map((payment) => (
                                    <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 xl:px-6 py-4 text-sm text-gray-900 font-semibold whitespace-nowrap">
                                            #{payment.razorpay_payment_id || "N/A"}
                                        </td>

                                        <td className="px-4 xl:px-6 py-4 text-sm text-gray-900">
                                            {payment?.orderId?.orderId || "N/A"}
                                        </td>

                                        <td className="px-4 xl:px-6 py-4 text-sm">
                                            <div className="font-medium text-gray-900">
                                                {payment.orderId?.userName || "N/A"}
                                            </div>
                                            <div className="text-gray-500 text-xs">
                                                {payment.orderId?.phone}
                                            </div>
                                        </td>

                                        <td className="px-4 xl:px-6 py-4 text-sm font-semibold text-green-700">
                                            ₹{payment.amount}
                                        </td>

                                        <td className="px-4 xl:px-6 py-4">
                                            <span className={statusBadge(payment.status)}>
                                                {payment.status}
                                            </span>
                                        </td>

                                        <td className="px-4 xl:px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                            {new Date(payment.createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-4 xl:px-6 py-8 text-center text-gray-500"
                                    >
                                        No payments found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* PAGINATION */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 py-4 bg-white rounded-lg shadow-md px-4">
                <span className="text-sm text-gray-500 font-medium">
                    Page {page} of {totalPages}
                </span>

                <div className="flex items-center gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        aria-label="Previous page"
                    >
                        <ChevronLeft size={16} />
                    </button>

                    {/* Desktop: Show page numbers */}
                    <div className="hidden sm:flex items-center gap-2">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i + 1)}
                                className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                                    page === i + 1
                                        ? "bg-green-600 text-white border-green-600"
                                        : "hover:bg-gray-50"
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    {/* Mobile: Show only current page */}
                    <div className="flex sm:hidden">
                        <span className="px-3 py-1 text-sm font-medium">{page}</span>
                    </div>

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        aria-label="Next page"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentTab;