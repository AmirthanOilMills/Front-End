import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import { showToast } from "../common/Toast";
import { deleteSingleProducts } from "../../api/admin/products";
import { X, Plus, Trash2, Upload } from "lucide-react";

const AddProductModal = ({ isOpen, onClose, onSubmit, categories, initialData }) => {
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [categorySearch, setCategorySearch] = useState("");

    const initialFormState = {
        product_name: "",
        tagline: "",
        product_desc: "",
        category_id: "",
        
        main_image: null,   // { file, url, public_id }
        gallery_images: [], // array of { file, url, public_id }
        
        variants: [], // array of { volume_size, mrp, selling_price, stock_qty }

        mrp: "",
        price: "", // maps to selling_price
        stock_qty: "",
        stock_status: "In Stock",

        oil_type: "",
        extraction_type: "Cold Pressed",
        ingredients: "",
        shelf_life: "",
        fssai_number: "",

        health_benefits: [],
        is_active: true
    };

    const [form, setForm] = useState(initialFormState);
    const [benefitInput, setBenefitInput] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Reset when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setForm(initialFormState);
            setBenefitInput("");
            setIsSaving(false);
        }
    }, [isOpen]);

    // Load initial data when editing
    useEffect(() => {
        if (initialData && isOpen) {
            setForm({
                product_name: initialData.product_name || "",
                tagline: initialData.tagline || "",
                product_desc: initialData.product_desc || "",
                category_id: initialData.category_id?._id || initialData.category_id || "",
                
                main_image: initialData.main_image ? { url: initialData.main_image.url, public_id: initialData.main_image.public_id, file: null } : null,
                gallery_images: initialData.gallery_images?.map(img => ({
                    url: img.url,
                    public_id: img.public_id,
                    file: null
                })) || [],
                
                variants: initialData.variants || [],
                
                mrp: initialData.mrp || "",
                price: initialData.price || "",
                stock_qty: initialData.stock_qty || "",
                stock_status: initialData.stock_status || "In Stock",

                oil_type: initialData.oil_type || "",
                extraction_type: initialData.extraction_type || "Cold Pressed",
                ingredients: initialData.ingredients || "",
                shelf_life: initialData.shelf_life || "",
                fssai_number: initialData.fssai_number || "",

                health_benefits: initialData.health_benefits || [],
                is_active: initialData.is_active ?? true
            });
        }
    }, [initialData, isOpen]);

    // Handle inputs for flat fields
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    // Image Upload helper
    const handleImageSelect = (field, e, isMultiple = false) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        if (isMultiple) {
            const newImages = files.map(file => ({
                file,
                url: URL.createObjectURL(file),
                public_id: null
            }));
            setForm(prev => ({
                ...prev,
                gallery_images: [...prev.gallery_images, ...newImages]
            }));
        } else {
            const file = files[0];
            const imgData = {
                file,
                url: URL.createObjectURL(file),
                public_id: null
            };
            setForm(prev => ({ ...prev, [field]: imgData }));
        }
    };

    // Image Remove helper
    const handleImageRemove = async (field, index = null) => {
        if (index !== null) {
            const img = form.gallery_images[index];
            if (initialData && img.public_id) {
                try {
                    const res = await deleteSingleProducts({
                        product_id: initialData._id,
                        public_id: img.public_id
                    });
                    if (res.status) {
                        showToast(res.message, "success");
                    } else {
                        showToast(res.message, "error");
                        return;
                    }
                } catch {
                    showToast("Failed to delete gallery image", "error");
                    return;
                }
            }
            setForm(prev => ({
                ...prev,
                gallery_images: prev.gallery_images.filter((_, i) => i !== index)
            }));
        } else {
            let img = form[field];
            if (initialData && img?.public_id) {
                try {
                    const res = await deleteSingleProducts({
                        product_id: initialData._id,
                        public_id: img.public_id
                    });
                    if (res.status) {
                        showToast(res.message, "success");
                    } else {
                        showToast(res.message, "error");
                        return;
                    }
                } catch {
                    showToast("Failed to delete image", "error");
                    return;
                }
            }
            setForm(prev => ({ ...prev, [field]: null }));
        }
    };

    // Health Benefits helpers
    const addBenefit = () => {
        if (!benefitInput.trim()) return;
        setForm(prev => ({
            ...prev,
            health_benefits: [...prev.health_benefits, benefitInput.trim()]
        }));
        setBenefitInput("");
    };

    const removeBenefit = (index) => {
        setForm(prev => ({
            ...prev,
            health_benefits: prev.health_benefits.filter((_, i) => i !== index)
        }));
    };

    // Variants helpers
    const addVariant = () => {
        setForm(prev => ({
            ...prev,
            variants: [
                ...prev.variants,
                {
                    volume_size: "",
                    mrp: "",
                    selling_price: "",
                    stock_qty: ""
                }
            ]
        }));
    };

    const handleVariantChange = (index, field, value) => {
        setForm(prev => {
            const updated = [...prev.variants];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, variants: updated };
        });
    };

    const removeVariant = (index) => {
        setForm(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async () => {
        if (!form.product_name) {
            showToast("Product name is required", "error");
            return;
        }
        if (!form.category_id) {
            showToast("Category is required", "error");
            return;
        }
        if (!form.price) {
            showToast("Price is required", "error");
            return;
        }
        if (!form.main_image) {
            showToast("Main product image is required", "error");
            return;
        }

        try {
            setIsSaving(true);
            await onSubmit(form);
        } catch (error) {
            console.error("Save product error", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={isSaving ? () => {} : onClose} title={initialData ? "Edit Product" : "Add Product"} width="max-w-4xl">
            <div className="flex flex-col h-[80vh]">
                
                {/* Scrollable Form Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    
                    {/* SECTION 1: Product & Oil Details */}
                    <div className="border border-gray-200 rounded-lg p-5 bg-white space-y-4 shadow-sm">
                        <h3 className="font-bold text-base text-gray-900 border-b pb-2 text-green-800">1. Product & Oil Details</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="font-semibold text-sm text-gray-700 block">Product Name *</label>
                                <input
                                    type="text"
                                    name="product_name"
                                    value={form.product_name}
                                    onChange={handleChange}
                                    className="w-full mt-1 border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-800 outline-none text-sm"
                                    placeholder="e.g. Wood Pressed Groundnut Oil"
                                />
                            </div>
                            <div>
                                <label className="font-semibold text-sm text-gray-700 block">Short Tagline</label>
                                <input
                                    type="text"
                                    name="tagline"
                                    value={form.tagline}
                                    onChange={handleChange}
                                    className="w-full mt-1 border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-800 outline-none text-sm"
                                    placeholder="e.g. 100% Pure & Healthy"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Category Dropdown */}
                            <div className="relative">
                                <label className="font-semibold text-sm text-gray-700 block">Category *</label>
                                <button
                                    type="button"
                                    className="w-full mt-1 border border-gray-300 rounded px-3 py-2 text-left bg-white flex justify-between items-center outline-none focus:ring-2 focus:ring-green-800 text-sm"
                                    onClick={() => setShowCategoryDropdown((prev) => !prev)}
                                >
                                    <span className="truncate">
                                        {categories?.find((c) => c._id === form.category_id)?.category_name || "Select Category"}
                                    </span>
                                    <span className="text-gray-400 text-xs">▼</span>
                                </button>
                                {showCategoryDropdown && (
                                    <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg">
                                        <input
                                            type="text"
                                            placeholder="Search category..."
                                            value={categorySearch}
                                            onChange={(e) => setCategorySearch(e.target.value)}
                                            className="w-full px-3 py-2 border-b border-gray-100 outline-none text-sm"
                                        />
                                        <ul className="max-h-40 overflow-y-auto">
                                            {categories?.filter((cat) => cat.category_name.toLowerCase().includes(categorySearch.toLowerCase())).map((cat) => (
                                                <li
                                                    key={cat._id}
                                                    onClick={() => {
                                                        setForm(prev => ({ ...prev, category_id: cat._id }));
                                                        setShowCategoryDropdown(false);
                                                        setCategorySearch("");
                                                    }}
                                                    className="px-3 py-2 cursor-pointer text-sm hover:bg-green-100"
                                                >
                                                    {cat.category_name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="font-semibold text-sm text-gray-700 block">Oil Type</label>
                                <select
                                    name="oil_type"
                                    value={form.oil_type}
                                    onChange={handleChange}
                                    className="w-full mt-1 border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-800 outline-none text-sm bg-white"
                                >
                                    <option value="">Select Oil Type</option>
                                    <option value="Groundnut Oil">Groundnut Oil</option>
                                    <option value="Coconut Oil">Coconut Oil</option>
                                    <option value="Sesame Oil">Sesame Oil</option>
                                    <option value="Sunflower Oil">Sunflower Oil</option>
                                    <option value="Castor Oil">Castor Oil</option>
                                </select>
                            </div>

                            <div>
                                <label className="font-semibold text-sm text-gray-700 block">Extraction Type</label>
                                <select
                                    name="extraction_type"
                                    value={form.extraction_type}
                                    onChange={handleChange}
                                    className="w-full mt-1 border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-800 outline-none text-sm bg-white"
                                >
                                    <option value="Cold Pressed">Cold Pressed</option>
                                    <option value="Wood Pressed">Wood Pressed</option>
                                    <option value="Refined">Refined</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="font-semibold text-sm text-gray-700 block">Ingredients</label>
                                <input
                                    type="text"
                                    name="ingredients"
                                    value={form.ingredients}
                                    onChange={handleChange}
                                    className="w-full mt-1 border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-800 outline-none text-sm"
                                    placeholder="e.g. Raw Sesame Seeds, Palm Jaggery"
                                />
                            </div>
                            <div>
                                <label className="font-semibold text-sm text-gray-700 block">Shelf Life</label>
                                <input
                                    type="text"
                                    name="shelf_life"
                                    value={form.shelf_life}
                                    onChange={handleChange}
                                    className="w-full mt-1 border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-800 outline-none text-sm"
                                    placeholder="e.g. 6 Months"
                                />
                            </div>
                            <div>
                                <label className="font-semibold text-sm text-gray-700 block">FSSAI Number</label>
                                <input
                                    type="text"
                                    name="fssai_number"
                                    value={form.fssai_number}
                                    onChange={handleChange}
                                    className="w-full mt-1 border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-800 outline-none text-sm"
                                    placeholder="14-digit FSSAI number"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="font-semibold text-sm text-gray-700 block">Product Description</label>
                            <textarea
                                name="product_desc"
                                rows="3"
                                value={form.product_desc}
                                onChange={handleChange}
                                className="w-full mt-1 border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-800 outline-none text-sm"
                                placeholder="Explain how the oil is crushed, filtered, and its organic nature."
                            />
                        </div>

                        {/* Health Benefits bullet points */}
                        <div>
                            <label className="font-semibold text-sm text-gray-700 block">Key Health Benefits</label>
                            <div className="flex gap-2 mt-1">
                                <input
                                    type="text"
                                    className="flex-1 border border-gray-300 rounded p-2 outline-none text-sm"
                                    value={benefitInput}
                                    onChange={(e) => setBenefitInput(e.target.value)}
                                    placeholder="e.g. Rich in antioxidants"
                                />
                                <button type="button" onClick={addBenefit} className="px-4 py-2 bg-green-800 hover:bg-green-900 text-white rounded text-sm font-semibold">
                                    Add
                                </button>
                            </div>
                            <div className="mt-2.5 flex flex-wrap gap-2">
                                {form.health_benefits.map((b, idx) => (
                                    <span key={idx} className="bg-green-50 text-green-850 text-xs px-3 py-1 rounded-full flex items-center gap-1 border border-green-200">
                                        {b} <button type="button" onClick={() => removeBenefit(idx)} className="text-red-500 hover:text-red-700 font-bold ml-1 text-sm">×</button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Active checkbox */}
                        <div className="flex items-center space-x-2 pt-2">
                            <input
                                type="checkbox"
                                name="is_active"
                                id="is_active"
                                checked={form.is_active}
                                onChange={handleChange}
                                className="rounded text-green-800 focus:ring-green-850"
                            />
                            <label htmlFor="is_active" className="text-sm font-semibold text-gray-700 cursor-pointer">Active / Visible on Store</label>
                        </div>
                    </div>

                    {/* SECTION 2: Pricing, Inventory & Sizes */}
                    <div className="border border-gray-200 rounded-lg p-5 bg-white space-y-4 shadow-sm">
                        <h3 className="font-bold text-base text-gray-900 border-b pb-2 text-green-800">2. Pricing, Inventory & Sizes</h3>
                        
                        <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-200">
                            <h4 className="font-semibold text-sm text-gray-800 mb-3">Base Product Pricing & Inventory</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-600 block">Original MRP *</label>
                                    <input type="number" name="mrp" value={form.mrp} onChange={handleChange} className="w-full mt-1 border rounded p-2 outline-none text-sm bg-white" placeholder="₹ MRP" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-600 block">Selling Price *</label>
                                    <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full mt-1 border rounded p-2 outline-none text-sm bg-white" placeholder="₹ Selling Price" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-600 block">Stock Qty</label>
                                    <input type="number" name="stock_qty" value={form.stock_qty} onChange={handleChange} className="w-full mt-1 border rounded p-2 outline-none text-sm bg-white" placeholder="Stock Qty" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-600 block">Stock Status</label>
                                    <select name="stock_status" value={form.stock_status} onChange={handleChange} className="w-full mt-1 border rounded p-2 outline-none text-sm bg-white">
                                        <option value="In Stock">In Stock</option>
                                        <option value="Out of Stock">Out of Stock</option>
                                        <option value="Pre-order">Pre-order</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Variants table */}
                        <div className="border border-gray-200 rounded-lg p-4 bg-white">
                            <div className="flex justify-between items-center mb-3">
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-800">Product Size/Volume Variants</h4>
                                    <p className="text-xs text-gray-500">Add separate prices for different volumes (e.g. 500ml, 1L, 5L)</p>
                                </div>
                                <button type="button" onClick={addVariant} className="px-3 py-1.5 bg-green-800 hover:bg-green-900 text-white rounded text-xs font-semibold flex items-center gap-1">
                                    <Plus size={14} /> Add Variant
                                </button>
                            </div>

                            {form.variants.length > 0 ? (
                                <div className="space-y-3">
                                    {form.variants.map((v, i) => (
                                        <div key={i} className="p-3 border rounded bg-gray-50/50 flex flex-col md:flex-row items-center gap-4 relative">
                                            <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3 pr-8">
                                                <div>
                                                    <label className="text-[10px] uppercase font-bold text-gray-500 block">Volume / Size *</label>
                                                    <input type="text" value={v.volume_size} onChange={(e) => handleVariantChange(i, "volume_size", e.target.value)} className="w-full mt-1 border rounded px-2 py-1 outline-none text-xs bg-white" placeholder="e.g. 500ml, 1L" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] uppercase font-bold text-gray-500 block">MRP *</label>
                                                    <input type="number" value={v.mrp} onChange={(e) => handleVariantChange(i, "mrp", e.target.value)} className="w-full mt-1 border rounded px-2 py-1 outline-none text-xs bg-white" placeholder="₹ Original MRP" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] uppercase font-bold text-gray-500 block">Selling Price *</label>
                                                    <input type="number" value={v.selling_price} onChange={(e) => handleVariantChange(i, "selling_price", e.target.value)} className="w-full mt-1 border rounded px-2 py-1 outline-none text-xs bg-white" placeholder="₹ Selling Price" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] uppercase font-bold text-gray-500 block">Stock Qty</label>
                                                    <input type="number" value={v.stock_qty} onChange={(e) => handleVariantChange(i, "stock_qty", e.target.value)} className="w-full mt-1 border rounded px-2 py-1 outline-none text-xs bg-white" placeholder="Quantity" />
                                                </div>
                                            </div>
                                            <button type="button" onClick={() => removeVariant(i)} className="absolute top-2 right-2 md:relative md:top-auto md:right-auto text-red-500 hover:text-red-700 self-center">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="border border-dashed p-4 rounded-lg text-center text-gray-500 text-xs">
                                    No variants defined. Standard pricing will apply.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SECTION 3: Product Images */}
                    <div className="border border-gray-200 rounded-lg p-5 bg-white space-y-4 shadow-sm">
                        <h3 className="font-bold text-base text-gray-900 border-b pb-2 text-green-800">3. Product Images</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            
                            {/* Main Image */}
                            <div className="border border-gray-200 rounded-lg p-4 bg-white flex flex-col items-center">
                                <h4 className="font-semibold text-sm text-gray-800 mb-3 self-start">Main Bottle/Jar Image *</h4>
                                {form.main_image ? (
                                    <div className="relative w-40 h-40 border rounded overflow-hidden">
                                        <img src={form.main_image.url} className="w-full h-full object-cover" />
                                        <button onClick={() => handleImageRemove("main_image")} className="absolute top-1 right-1 bg-red-600 text-white rounded p-1 hover:bg-red-700 shadow">
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-40 h-40 border-2 border-dashed rounded flex flex-col items-center justify-center bg-gray-50 text-gray-500 cursor-pointer hover:bg-gray-100" onClick={() => document.getElementById("mainImgSelect").click()}>
                                        <Upload size={24} />
                                        <span className="text-xs mt-2">Upload Main Image</span>
                                        <input id="mainImgSelect" type="file" accept="image/*" className="hidden" onChange={(e) => handleImageSelect("main_image", e)} />
                                    </div>
                                )}
                            </div>

                            {/* Gallery Images */}
                            <div className="col-span-2 border border-gray-200 rounded-lg p-4 bg-white">
                                <h4 className="font-semibold text-sm text-gray-800 mb-1">Gallery Images (1–3 support images)</h4>
                                <p className="text-xs text-gray-400 mb-3">Add packaging back labels or close-ups</p>
                                <div className="flex flex-wrap gap-4">
                                    {form.gallery_images.map((img, index) => (
                                        <div key={index} className="relative w-28 h-28 border rounded overflow-hidden">
                                            <img src={img.url} className="w-full h-full object-cover" />
                                            <button onClick={() => handleImageRemove("gallery_images", index)} className="absolute top-1 right-1 bg-red-600 text-white rounded p-1 hover:bg-red-700 shadow">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {form.gallery_images.length < 5 && (
                                        <div className="w-28 h-28 border-2 border-dashed rounded flex flex-col items-center justify-center bg-gray-50 text-gray-500 cursor-pointer hover:bg-gray-100" onClick={() => document.getElementById("galleryImgSelect").click()}>
                                            <Plus size={20} />
                                            <span className="text-xs mt-2">Add Image</span>
                                            <input id="galleryImgSelect" type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleImageSelect(null, e, true)} />
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

                {/* Footer Save Button */}
                <div className="border-t p-4 flex justify-end gap-3 bg-gray-50">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        disabled={isSaving}
                        className="px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button 
                        type="button" 
                        onClick={handleSubmit} 
                        disabled={isSaving}
                        className={`px-6 py-2 rounded font-semibold text-sm shadow text-white flex items-center gap-2 ${
                            isSaving ? "bg-green-700/60 cursor-not-allowed" : "bg-green-800 hover:bg-green-900"
                        }`}
                    >
                        {isSaving && (
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        )}
                        <span>{isSaving ? "Saving..." : "Save Product"}</span>
                    </button>
                </div>

            </div>
        </Modal>
    );
};

export default AddProductModal;
