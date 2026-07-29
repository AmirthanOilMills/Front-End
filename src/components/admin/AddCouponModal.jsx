import React, { useState, useEffect, useRef } from "react";
import Modal from "../common/Modal";
import { checkCouponNameExists } from "../../api/admin/coupon";

const AddCouponModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [form, setForm] = useState({
        coupon_name: "",
        percentage: "",
        description: "",
        influencer_name: "",
        is_active: true,
    });

    const [errors, setErrors] = useState({});
    const [checking, setChecking] = useState(false);
    const debounceRef = useRef(null);

    useEffect(() => {
        if (initialData) {
            setForm({
                coupon_name: initialData.coupon_name,
                percentage: String(initialData.percentage),
                description: initialData.description || "",
                influencer_name: initialData.influencer_name || "",
                is_active: initialData.is_active,
            });
        } else {
            setForm({
                coupon_name: "",
                percentage: "",
                description: "",
                influencer_name: "",
                is_active: true,
            });
        }
        setErrors({});
    }, [initialData, isOpen]);

    // Inline validation for coupon name (uniqueness check with debounce)
    const validateCouponName = (name) => {
        if (!name.trim()) {
            setErrors((prev) => ({ ...prev, coupon_name: "Coupon name is required" }));
            return;
        }

        // Clear previous debounce
        if (debounceRef.current) clearTimeout(debounceRef.current);

        setChecking(true);
        debounceRef.current = setTimeout(async () => {
            try {
                const excludeId = initialData?._id || "";
                const res = await checkCouponNameExists(name, excludeId);
                if (res.exists) {
                    setErrors((prev) => ({ ...prev, coupon_name: "Coupon name already exists" }));
                } else {
                    setErrors((prev) => {
                        const { coupon_name, ...rest } = prev;
                        return rest;
                    });
                }
            } catch {
                // Silently fail on network errors during validation
            } finally {
                setChecking(false);
            }
        }, 500);
    };

    // Inline validation for percentage
    const validatePercentage = (value) => {
        if (value === "" || value === undefined) {
            setErrors((prev) => ({ ...prev, percentage: "Percentage is required" }));
        } else {
            const num = Number(value);
            if (isNaN(num) || num < 1 || num > 100) {
                setErrors((prev) => ({ ...prev, percentage: "Must be between 1 and 100" }));
            } else if (!Number.isInteger(num)) {
                setErrors((prev) => ({ ...prev, percentage: "Must be a whole number" }));
            } else {
                setErrors((prev) => {
                    const { percentage, ...rest } = prev;
                    return rest;
                });
            }
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newValue = type === "checkbox" ? checked : value;

        // Auto-capitalize coupon name
        if (name === "coupon_name") {
            newValue = value.toUpperCase();
        }

        // For percentage: only allow digits (block text input)
        if (name === "percentage") {
            // Strip any non-digit characters
            newValue = value.replace(/[^0-9]/g, "");
        }

        setForm({
            ...form,
            [name]: newValue,
        });

        // Trigger inline validation on change
        if (name === "coupon_name") {
            validateCouponName(newValue);
        }
        if (name === "percentage") {
            validatePercentage(newValue);
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        if (name === "coupon_name") {
            validateCouponName(value);
        }
        if (name === "percentage") {
            validatePercentage(value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Final validation before submit
        const newErrors = {};

        if (!form.coupon_name.trim()) {
            newErrors.coupon_name = "Coupon name is required";
        }

        const num = Number(form.percentage);
        if (form.percentage === "" || form.percentage === undefined) {
            newErrors.percentage = "Percentage is required";
        } else if (isNaN(num) || num < 1 || num > 100) {
            newErrors.percentage = "Must be between 1 and 100";
        } else if (!Number.isInteger(num)) {
            newErrors.percentage = "Must be a whole number";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors((prev) => ({ ...prev, ...newErrors }));
            return;
        }

        // If there are existing errors (like duplicate name), don't submit
        if (Object.keys(errors).length > 0) return;

        onSubmit({
            ...form,
            percentage: Number(form.percentage),
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Coupon" : "Add Coupon"}>
            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Coupon Name */}
                <div>
                    <label className="block text-sm font-medium">
                        Coupon Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="coupon_name"
                        value={form.coupon_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full border rounded px-3 py-2 uppercase ${
                            errors.coupon_name
                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                        }`}
                        placeholder="Enter coupon name"
                    />
                    {errors.coupon_name && (
                        <p className="text-red-500 text-xs mt-1">{errors.coupon_name}</p>
                    )}
                    {checking && (
                        <p className="text-gray-400 text-xs mt-1">Checking availability...</p>
                    )}
                </div>

                {/* Percentage */}
                <div>
                    <label className="block text-sm font-medium">
                        Percentage (%) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="percentage"
                        value={form.percentage}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full border rounded px-3 py-2 ${
                            errors.percentage
                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                        }`}
                        placeholder="Enter discount percentage (1-100)"
                    />
                    {errors.percentage && (
                        <p className="text-red-500 text-xs mt-1">{errors.percentage}</p>
                    )}
                </div>

                {/* Influencer Name */}
                <div>
                    <label className="block text-sm font-medium">Influencer Name</label>
                    <input
                        type="text"
                        name="influencer_name"
                        value={form.influencer_name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter influencer name (optional)"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium">Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows="3"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter coupon description (optional)"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={Object.keys(errors).length > 0 || checking}
                    className={`w-full py-2 rounded font-semibold text-white ${
                        Object.keys(errors).length > 0 || checking
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-700 hover:bg-green-800"
                    }`}
                >
                    {initialData ? "Update Coupon" : "Create Coupon"}
                </button>
            </form>
        </Modal>
    );
};

export default AddCouponModal;
