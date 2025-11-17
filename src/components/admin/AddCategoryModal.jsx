import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";

const AddCategoryModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [form, setForm] = useState({
        category_name: "",
        is_active: true,
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                category_name: initialData.category_name,
                is_active: initialData.is_active,
            });
        } else {
            setForm({
                category_name: "",
                is_active: true,
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Category" : "Add Category"}>
            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Category Name */}
                <div>
                    <label className="block text-sm font-medium">Category Name</label>
                    <input
                        type="text"
                        name="category_name"
                        value={form.category_name}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>
                {/* Status */}
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="is_active"
                        checked={form.is_active}
                        onChange={handleChange}
                    />
                    <label className="text-sm font-medium">Active</label>
                </div>
                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded font-semibold"
                >
                    {initialData ? "Update Category" : "Create Category"}
                </button>
            </form>
        </Modal>
    );
};

export default AddCategoryModal;
