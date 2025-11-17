import React, { useState, useEffect, useCallback } from "react";
import Modal from "../common/Modal";
import { deleteSingleProducts } from "../../api/admin/products";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const AddProductModal = ({ isOpen, onClose, onSubmit, categories, initialData }) => {
    const [form, setForm] = useState({
        product_name: "",
        product_desc: "",
        category_id: "",
        price: "",
        stock: true,
        is_active: true,
        images: [],
        health_benefits: [],
    });
    const [benefitInput, setBenefitInput] = useState("");
    // Load initial data when editing
    useEffect(() => {
        if (initialData) {
            setForm({
                product_name: initialData.product_name || "",
                product_desc: initialData.product_desc || "",
                category_id: initialData.category_id._id || "",
                stock: initialData.stock || true,
                is_active: initialData.is_active || true,
                price: initialData.price || "",
                images: initialData.images?.map(img => `${BASE_URL}${img}`) || [],
                health_benefits: initialData.health_benefits || [],
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

    // Delete preview image

    const removeImage = async (index) => {
        const imageToDelete = form.images[index];

        // If editing + image is from backend → delete from server
        if (initialData && !imageToDelete.file) {
            const imageUrl = imageToDelete.replace(BASE_URL, "");

            try {
                const response = await deleteSingleProducts({product_id:initialData._id, image_url:imageUrl});

                if (!response.status) {
                    showToast(response.message, "error");
                    return;
                }
                showToast(response.message, "success");

                // Remove from UI after successful delete
                setForm((prev) => ({
                    ...prev,
                    images: prev.images.filter((_, i) => i !== index),
                }));

            } catch (error) {
                console.error("Delete error:", error);
                alert("Failed to delete image. Please try again.");
            }

        } else {
            // If new uploaded image → just remove from preview
            setForm((prev) => ({
                ...prev,
                images: prev.images.filter((_, i) => i !== index),
            }));
        }
    };

    // Handle image uploading
    const handleFileUpload = useCallback((files) => {
        const newImages = Array.from(files).map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        setForm((prev) => ({ ...prev, images: [...prev.images, ...newImages] }));
    }, []);

    const handleDrop = (e) => {
        e.preventDefault();
        handleFileUpload(e.dataTransfer.files);
    };

    const handleFileSelect = (e) => {
        handleFileUpload(e.target.files);
    };

    // Add health benefit
    const addBenefit = () => {
        if (!benefitInput.trim()) return;
        setForm({
            ...form,
            health_benefits: [...form.health_benefits, benefitInput.trim()],
        });
        setBenefitInput("");
    };

    // Submit form
    const handleSubmit = () => {
        const processedImages = form.images.map((img) => (img.file ? img.file : img));
        onSubmit({ ...form, images: processedImages });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add / Edit Product" width="max-w-2xl">
            <div className="space-y-4">

                {/* Name */}
                <div>
                    <label className="font-medium">Product Name</label>
                    <input
                        type="text"
                        name="product_name"
                        value={form.product_name}
                        onChange={handleChange}
                        className="w-full mt-1 border rounded p-2"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="font-medium">Description</label>
                    <textarea
                        name="product_desc"
                        value={form.product_desc}
                        onChange={handleChange}
                        className="w-full mt-1 border rounded p-2"
                    />
                </div>

                {/* Categories */}
                <div>
                    <label className="font-medium">Category</label>
                    <select
                        name="category_id"
                        value={form.category_id}
                        onChange={handleChange}
                        className="w-full mt-1 border rounded p-2"
                    >
                        <option value="">Select Category</option>
                        {categories?.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.category_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Price */}
                <div>
                    <label className="font-medium">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        className="w-full mt-1 border rounded p-2"
                    />
                </div>

                <div className="flex flex-row gap-20">
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
                    {/* Stock */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="stock"
                            checked={form.stock}
                            onChange={handleChange}
                        />
                        <label className="text-sm font-medium">In Stock</label>
                    </div>
                </div>

                {/* Dropzone */}
                <div>
                    <label className="font-medium">Images</label>

                    <div
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        className="mt-2 border-2 border-dashed p-6 rounded-lg text-center bg-gray-50 cursor-pointer"
                        onClick={() => document.getElementById("imageUploadInput").click()}
                    >
                        <p className="text-gray-600">Drag & drop OR click to upload</p>
                        <input
                            id="imageUploadInput"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </div>

                    {/* Image Preview */}
                    {form.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-3 mt-4">
                            {form.images.map((img, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={img.preview || img}
                                        className="h-28 w-full rounded object-cover border"
                                    />
                                    <button
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Health Benefits */}
                <div>
                    <label className="font-medium">Health Benefits</label>
                    <div className="flex gap-2 mt-1">
                        <input
                            type="text"
                            className="flex-1 border rounded p-2"
                            value={benefitInput}
                            onChange={(e) => setBenefitInput(e.target.value)}
                        />
                        <button
                            onClick={addBenefit}
                            className="px-3 bg-green-700 text-white rounded"
                        >
                            Add
                        </button>
                    </div>

                    <ul className="mt-3 space-y-1">
                        {form.health_benefits.map((b, i) => (
                            <li key={i} className="text-sm text-gray-700">
                                • {b}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    className="w-full bg-green-800 text-white rounded py-2 mt-4"
                >
                    Save Product
                </button>
            </div>
        </Modal>
    );
};

export default AddProductModal;
