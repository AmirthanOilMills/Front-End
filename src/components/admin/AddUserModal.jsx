import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import { showToast } from "../common/Toast";

const AddUserModal = ({ isOpen, onClose, onSubmit, initialData }) => {

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
        isActive: true,
    });

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setForm({
                name: "",
                email: "",
                password: "",
                role: "user",
                isActive: true,
            });
        }
    }, [isOpen]);

    // Load initial data (Edit Mode)
    useEffect(() => {
        if (initialData) {
            setForm({
                name: initialData.name || "",
                email: initialData.email || "",
                password: "",
                role: initialData.role || "user",
                isActive: initialData.isActive ?? true,
            });
        } else {
            setForm({
                name: "",
                email: "",
                password: "",
                role: "user",
                isActive: true,
            });
        }
    }, [initialData]);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };


    const handleSubmit = () => {
        if (!form.name || !form.email || (!initialData && !form.password)) {
            showToast("Please fill all required fields", "error");
            return;
        }

        onSubmit(form);
    };


    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add / Edit User" width="max-w-lg">
            <div className="space-y-4">

                {/* Name */}
                <div>
                    <label className="font-medium">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full mt-1 border rounded p-2"
                        placeholder="Enter name"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full mt-1 border rounded p-2"
                        placeholder="Enter email"
                    />
                </div>

                {/* Password */}
                {!initialData && (
                    <div>
                        <label className="font-medium">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full mt-1 border rounded p-2"
                            placeholder="Enter password"
                        />
                    </div>
                )}

                {/* Password (Optional in Edit Mode) */}
                {initialData && (
                    <div>
                        <label className="font-medium">Password (Leave empty to keep unchanged)</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full mt-1 border rounded p-2"
                            placeholder="Enter new password"
                        />
                    </div>
                )}

                {/* Role */}
                <div>
                    <label className="font-medium">Role</label>
                    <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="w-full mt-1 border rounded p-2"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                {/* Active */}
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={form.isActive}
                        onChange={handleChange}
                    />
                    <label>Active</label>
                </div>

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    className="w-full bg-green-700 text-white rounded py-2 mt-4"
                >
                    {initialData ? "Update User" : "Create User"}
                </button>
            </div>
        </Modal>
    );
};

export default AddUserModal;
