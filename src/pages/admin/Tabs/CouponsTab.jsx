import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Percent, Eye } from "lucide-react";
import AddCouponModal from "../../../components/admin/AddCouponModal";
import { addCoupon, getAllCoupons, updateCoupon, deleteCoupon } from "../../../api/admin/coupon";
import { showToast } from "../../../components/common/Toast";
import Pagination from "../../../components/common/Pagination";

const CouponsTab = () => {
    const navigate = useNavigate();
    const [coupons, setCoupons] = useState([]);
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        loadCoupons();
    }, [currentPage]);

    const loadCoupons = async () => {
        try {
            const res = await getAllCoupons(currentPage, 5);
            if (res.success) {
                setCoupons(res.coupons);
                setTotalPages(res.totalPages);
                setCurrentPage(currentPage);
                return;
            }
            showToast(res.message || "Failed to fetch coupons", "error");
        } catch (error) {
            console.error("Fetch Coupons Error:", error);
            showToast("Something went wrong!", "error");
        }
    };

    const handleAddCoupon = async (data) => {
        try {
            let res;
            if (editData) {
                res = await updateCoupon(editData._id, data);
            } else {
                res = await addCoupon(data);
            }

            if (res.success) {
                setOpen(false);
                setEditData(null);
                loadCoupons();
                showToast(res.message, "success");
                return;
            }
            showToast(res.message || "Failed to save coupon", "error");
        } catch (error) {
            console.error("Submit Coupon Error:", error);
            showToast("Something went wrong!", "error");
        }
    };

    const handleEdit = (coupon) => {
        setEditData(coupon);
        setOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this coupon?")) return;
        try {
            const res = await deleteCoupon(id);
            if (res.success) {
                loadCoupons();
                showToast(res.message, "success");
                return;
            }
            showToast(res.message || "Failed to delete coupon", "error");
        } catch (error) {
            console.error("Delete Coupon Error:", error);
            showToast("Something went wrong!", "error");
        }
    };

    const handleToggleActive = async (coupon) => {
        try {
            const res = await updateCoupon(coupon._id, { ...coupon, is_active: !coupon.is_active });
            if (res.success) {
                loadCoupons();
                showToast(res.message, "success");
                return;
            }
            showToast(res.message || "Failed to update status", "error");
        } catch (error) {
            console.error("Toggle Active Error:", error);
            showToast("Something went wrong!", "error");
        }
    };

    return (
        <div className="space-y-4 md:space-y-6 p-4 md:p-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Coupons Management</h2>

                <button
                    className="bg-green-800 hover:bg-green-900 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 w-full sm:w-auto justify-center transition-colors"
                    onClick={() => {
                        setOpen(true);
                        setEditData(null);
                    }}
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Coupon</span>
                </button>
            </div>

            {/* Mobile View - Card Layout */}
            <div className="block md:hidden space-y-4">
                {coupons.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                        No coupons found.
                    </div>
                ) : (
                    coupons.map((coupon) => (
                        <div key={coupon._id} className="bg-white rounded-lg shadow-md p-4 space-y-3">
                            {/* Coupon Name & Status */}
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="text-base font-semibold text-gray-900">
                                        {coupon.coupon_name}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="inline-flex items-center gap-1 text-sm font-bold text-green-700">
                                            <Percent className="w-3 h-3" />
                                            {coupon.percentage}%
                                        </span>
                                    </div>
                                    {coupon.influencer_name && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            <span className="font-medium text-gray-600">Influencer:</span> {coupon.influencer_name}
                                        </p>
                                    )}
                                    {coupon.description && (
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                            {coupon.description}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(coupon.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                {/* Toggle */}
                                <button
                                    type="button"
                                    onClick={() => handleToggleActive(coupon)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                                        coupon.is_active ? "bg-green-600" : "bg-gray-300"
                                    }`}
                                    title={coupon.is_active ? "Active — click to deactivate" : "Inactive — click to activate"}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out shadow ${
                                            coupon.is_active ? "translate-x-6" : "translate-x-1"
                                        }`}
                                    />
                                </button>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-2 border-t">
                                <button
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                    onClick={() => navigate(`/admin/coupons/${coupon.coupon_name}`)}
                                >
                                    <Eye className="w-4 h-4" />
                                    <span>View</span>
                                </button>

                                <button
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                                    onClick={() => handleEdit(coupon)}
                                >
                                    <Edit className="w-4 h-4" />
                                    <span>Edit</span>
                                </button>

                                <button
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                    onClick={() => handleDelete(coupon._id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Tablet & Desktop View - Table Layout */}
            <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Coupon Name
                                </th>
                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Percentage
                                </th>
                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Influencer Name
                                </th>
                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Active
                                </th>
                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created At
                                </th>
                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            {coupons.map((coupon) => (
                                <tr key={coupon._id} className="hover:bg-gray-50 transition-colors">
                                    {/* Coupon Name */}
                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {coupon.coupon_name}
                                    </td>

                                    {/* Percentage */}
                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-full bg-green-100 text-green-700">
                                            {coupon.percentage}%
                                        </span>
                                    </td>

                                    {/* Influencer Name */}
                                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                                        {coupon.influencer_name || "—"}
                                    </td>

                                    {/* Description */}
                                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                                        {coupon.description || "—"}
                                    </td>

                                    {/* Active Status - Toggle */}
                                    <td className="px-4 lg:px-6 py-4">
                                        <button
                                            type="button"
                                            onClick={() => handleToggleActive(coupon)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                                                coupon.is_active ? "bg-green-600" : "bg-gray-300"
                                            }`}
                                            title={coupon.is_active ? "Active — click to deactivate" : "Inactive — click to activate"}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out shadow ${
                                                    coupon.is_active ? "translate-x-6" : "translate-x-1"
                                                }`}
                                            />
                                        </button>
                                    </td>

                                    {/* Created At */}
                                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                                        {new Date(coupon.createdAt).toLocaleDateString()}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 lg:px-6 py-4 text-sm font-medium">
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                                                onClick={() => navigate(`/admin/coupons/${coupon.coupon_name}`)}
                                                title="View Usage & Customer Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>

                                            <button
                                                className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors"
                                                onClick={() => handleEdit(coupon)}
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>

                                            <button
                                                className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                                                onClick={() => handleDelete(coupon._id)}
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {coupons.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-4 lg:px-6 py-8 text-center text-gray-500 text-sm">
                                        No coupons found.
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

            {/* Add/Edit Coupon Modal */}
            <AddCouponModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onSubmit={handleAddCoupon}
                initialData={editData}
            />
        </div>
    );
};

export default CouponsTab;
