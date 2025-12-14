import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import AddCategoryModal from "../../../components/admin/AddCategoryModal";
import { addCategory, getAllCategory, updateCategory, deleteCategory } from "../../../api/admin/category";
import { showToast } from "../../../components/common/Toast";
import Pagination from "../../../components/common/Pagination";

const CategoriesTab = () => {
    const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        loadCategories();
    }, [currentPage]);

    const loadCategories = async () => {
        try {
            const res = await getAllCategory(currentPage, 5);
            if (res.success) {
                setCategories(res.categories);
                setTotalPages(res.totalPages);  // backend must return total pages
                setCurrentPage(currentPage);
                return;
            }
            showToast(res.message || "Failed to fetch category", "error");
        } catch (error) {
            console.error("Add Category Error:", error);
            // API failed entirely (network/server error)
            showToast("Something went wrong!", "error");
        }
    };

    const handleAddCategory = async (data) => {
        try {
            let res;
            if (editData) {
                res = await updateCategory(editData._id, data);
            } else {
                res = await addCategory(data);
            }

            if (res.success) {
                setOpen(false);
                setEditData(null);
                loadCategories();
                showToast(res.message, "success");
                return;
            }
            showToast(res.message || "Failed to save category", "error");
        } catch (error) {
            console.error("Submit Category Error:", error);
            showToast("Something went wrong!", "error");
        }
    };

    const handleEdit = (cat) => {
        setEditData(cat);  // set initial form data
        setOpen(true);     // open modal
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this category?")) return;
        try {
            const res = await deleteCategory(id);
            if (res.success) {
                loadCategories();
                showToast(res.message, "success");
                return; // prevent running error toast
            }
            // API responded but not successful
            showToast(res.message || "Failed to delete category", "error");

        } catch (error) {
            console.error("Delete Category Error:", error);

            // API failed entirely (network/server error)
            showToast("Something went wrong!", "error");
        }
    };

    return (
        <div className="space-y-4 md:space-y-6 p-4 md:p-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Categories Management</h2>

                <button
                    className="bg-green-800 hover:bg-green-900 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 w-full sm:w-auto justify-center transition-colors"
                    onClick={() => {
                        setOpen(true)
                        setEditData(null);
                    }}
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Category</span>
                </button>
            </div>

            {/* Mobile View - Card Layout */}
            <div className="block md:hidden space-y-4">
                {categories.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                        No categories found.
                    </div>
                ) : (
                    categories.map((cat) => (
                        <div key={cat._id} className="bg-white rounded-lg shadow-md p-4 space-y-3">
                            {/* Category Name & Status */}
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="text-base font-semibold text-gray-900">
                                        {cat.category_name}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {new Date(cat.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <span
                                    className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                                        cat.is_active
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {cat.is_active ? "Active" : "Inactive"}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-2 border-t">
                                <button
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                                    onClick={() => handleEdit(cat)}
                                >
                                    <Edit className="w-4 h-4" />
                                    <span>Edit</span>
                                </button>

                                <button
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                    onClick={() => handleDelete(cat._id)}
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
                                    Category
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
                            {categories.map((cat) => (
                                <tr key={cat._id} className="hover:bg-gray-50 transition-colors">
                                    {/* Category Name */}
                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {cat.category_name}
                                    </td>

                                    {/* Active Status */}
                                    <td className="px-4 lg:px-6 py-4">
                                        <span
                                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                cat.is_active
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {cat.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </td>

                                    {/* Created At */}
                                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                                        {new Date(cat.createdAt).toLocaleDateString()}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 lg:px-6 py-4 text-sm font-medium">
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors"
                                                onClick={() => handleEdit(cat)}
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>

                                            <button
                                                className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                                                onClick={() => handleDelete(cat._id)}
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-4 lg:px-6 py-8 text-center text-gray-500 text-sm">
                                        No categories found.
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

            {/* Add Category Modal */}
            <AddCategoryModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onSubmit={handleAddCategory}
                initialData={editData}
            />
        </div>
    );
};

export default CategoriesTab;