import React, { useState, useEffect, useCallback } from "react";
import Modal from "../common/Modal";
import { showToast } from "../common/Toast";
import { deleteSingleProducts } from "../../api/admin/products";

const AddProductModal = ({ isOpen, onClose, onSubmit, categories, initialData }) => {
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [categorySearch, setCategorySearch] = useState("");

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
    useEffect(() => {
        if (!isOpen) {
            // reset form when modal closes
            setForm({
                product_name: "",
                product_desc: "",
                category_id: "",
                price: "",
                stock: true,
                is_active: true,
                images: [],
                health_benefits: [],
            });
            setBenefitInput("");
        }
    }, [isOpen]);
    // Load initial data when editing
    useEffect(() => {
        if (initialData) {
            // Load edit data
            setForm({
                product_name: initialData.product_name || "",
                product_desc: initialData.product_desc || "",
                category_id: initialData.category_id._id || "",
                price: initialData.price || "",
                stock: initialData.stock ?? true,
                is_active: initialData.is_active ?? true,
                images:
                    initialData.images?.map((img) => ({
                        url: img.url,              // Cloudinary URL
                        public_id: img.public_id,  // Needed for delete/update
                        file: null,                // existing image
                    })) || [],
                health_benefits: initialData.health_benefits || [],
            });
        } else {
            // CLEAR when switching to add mode
            setForm({
                product_name: "",
                product_desc: "",
                category_id: "",
                price: "",
                stock: true,
                is_active: true,
                images: [],
                health_benefits: [],
            });
            setBenefitInput("");
        }
    }, [initialData]);



    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };

    // Delete Image
    const removeImage = async (index) => {
        const image = form.images[index];

        // Existing image (already saved in DB)
        if (initialData && image.file === null) {
            try {
                const response = await deleteSingleProducts({
                    product_id: initialData._id,
                    public_id: image.public_id,
                });

                if (!response.status) {
                    showToast(response.message, "error");
                    return;
                }

                showToast(response.message, "success");

                setForm((prev) => ({
                    ...prev,
                    images: prev.images.filter((_, i) => i !== index),
                }));
            } catch (err) {
                showToast("Failed to delete image", "error");
            }
        }
        // New image (not uploaded yet)
        else {
            setForm((prev) => ({
                ...prev,
                images: prev.images.filter((_, i) => i !== index),
            }));
        }
    };

    // Upload new files
    const handleFileUpload = useCallback((files) => {
        const newImages = Array.from(files).map((file) => ({
            file,
            url: URL.createObjectURL(file),
            public_id: null, // important
        }));

        setForm(prev => ({
            ...prev,
            images: [...prev.images, ...newImages],
        }));
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

        setForm(prev => ({
            ...prev,
            health_benefits: [...prev.health_benefits, benefitInput.trim()],
        }));

        setBenefitInput("");
    };


    // Submit form
    const handleSubmit = () => {

        onSubmit({
            ...form,
            images: form.images.map(img => ({
                url: img.url || null,
                public_id: img.public_id || null,
                file: img.file || null,
            })),
        });
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

                {/* Category */}
                {/* Category Dropdown */}
                <div className="relative">
                    <label className="font-medium">Category</label>

                    {/* Selected Value */}
                    <button
                        type="button"
                        className="w-full mt-1 border rounded px-3 py-2 text-left bg-white flex justify-between items-center"
                        onClick={() => setShowCategoryDropdown((prev) => !prev)}
                    >
                        <span>
                            {categories?.find((c) => c._id === form.category_id)?.category_name ||
                                "Select Category"}
                        </span>
                        <span className="text-gray-400">▾</span>
                    </button>

                    {/* Dropdown */}
                    {showCategoryDropdown && (
                        <div className="absolute z-50 mt-1 w-full bg-white border rounded-lg shadow-lg">
                            {/* Search */}
                            <input
                                type="text"
                                placeholder="Search category..."
                                value={categorySearch}
                                onChange={(e) => setCategorySearch(e.target.value)}
                                className="w-full px-3 py-2 border-b outline-none text-sm"
                            />

                            {/* List */}
                            <ul className="max-h-48 overflow-y-auto">
                                {categories
                                    ?.filter((cat) =>
                                        cat.category_name
                                            .toLowerCase()
                                            .includes(categorySearch.toLowerCase())
                                    )
                                    .map((cat) => (
                                        <li
                                            key={cat._id}
                                            onClick={() => {
                                                setForm((prev) => ({
                                                    ...prev,
                                                    category_id: cat._id,
                                                }));
                                                setShowCategoryDropdown(false);
                                                setCategorySearch("");
                                            }}
                                            className={`px-4 py-2 cursor-pointer text-sm hover:bg-green-100
                ${form.category_id === cat._id
                                                    ? "bg-green-50 font-medium"
                                                    : ""
                                                }`}
                                        >
                                            {cat.category_name}
                                        </li>
                                    ))}

                                {categories?.length === 0 && (
                                    <li className="px-4 py-2 text-sm text-gray-500">
                                        No categories found
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
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

                {/* Active + Stock */}
                <div className="flex flex-row gap-20">
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="is_active"
                            checked={form.is_active}
                            onChange={handleChange}
                        />
                        <label>Active</label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="stock"
                            checked={form.stock}
                            onChange={handleChange}
                        />
                        <label>In Stock</label>
                    </div>
                </div>

                {/* Image Upload */}
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
                                        src={img.url}
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
                            <li key={i} className="text-sm text-gray-700">• {b}</li>
                        ))}
                    </ul>
                </div>

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
