import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
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
            console.log(res);
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
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                    Payments Management
                </h2>

                <div className="flex space-x-3">
                    {/* SEARCH */}
                    <input
                        type="text"
                        placeholder="Search Name / Email / Phone"
                        className="px-4 py-2 border rounded-md w-64 focus:ring-2 focus:ring-green-400"
                        value={search}
                        onChange={(e) => {
                            setPage(1);
                            setSearch(e.target.value);
                        }}
                    />

                    {/* STATUS FILTER */}
                    <select
                        className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400"
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

            {/* TABLE */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Payment ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Order ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            {payments?.length > 0 ? (
                                payments.map((payment) => (
                                    <tr key={payment._id}>
                                        <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                                            #{payment.razorpay_payment_id || "N/A"}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {payment.orderId?._id || "N/A"}
                                        </td>

                                        <td className="px-6 py-4 text-sm">
                                            <div className="font-medium">
                                                {payment.orderId?.userName || "N/A"}
                                            </div>
                                            <div className="text-gray-500 text-xs">
                                                {payment.orderId?.email}
                                            </div>
                                            <div className="text-gray-500 text-xs">
                                                {payment.orderId?.phone}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            ₹{payment.amount}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className={statusBadge(payment.status)}>
                                                {payment.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(payment.createdAt).toLocaleString()}
                                        </td>

                                        <td className="px-6 py-4 text-sm">
                                            <button className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
                                                <Eye className="w-4 h-4" /> View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="px-6 py-4 text-center text-gray-500"
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
            <div className="flex justify-center items-center space-x-3 py-4">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-4 py-2 border rounded-md disabled:opacity-40"
                >
                    Prev
                </button>

                <span className="font-semibold">
                    Page {page} / {totalPages}
                </span>

                <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 border rounded-md disabled:opacity-40"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default PaymentTab;
