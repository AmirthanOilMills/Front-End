import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Filter } from "lucide-react";

import AddProductModal from "../../../components/admin/AddProductModal";
import CategoryDropdown from "../../../components/common/DropDown";
import Pagination from "../../../components/common/Pagination";

import {
  addProducts,
  getAllProducts,
  updateProducts,
  deleteProducts,
} from "../../../api/admin/products";
import { getAllCategory } from "../../../api/admin/category";
import { showToast } from "../../../components/common/Toast";


const ProductsTab = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD CATEGORIES ================= */
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await getAllCategory();
      if (res.success) setCategories(res.categories);
      else showToast("Failed to load categories", "error");
    } catch {
      showToast("Error loading categories", "error");
    }
  };

  /* ================= LOAD PRODUCTS (API FILTERED) ================= */
  useEffect(() => {
    loadProducts();
  }, [currentPage, searchTerm, selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const categoryId =
        selectedCategory === "All"
          ? ""
          : categories.find((c) => c.category_name === selectedCategory)?._id;

      const res = await getAllProducts(
        currentPage,
        limit,
        searchTerm,
        categoryId
      );

      if (res.success) {
        setProducts(res.products);
        setTotalPages(res.totalPages);
      } else {
        showToast("Failed to load products", "error");
      }
    } catch (err) {
      showToast("Error loading products", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      const res = await deleteProducts(id);
      if (res.status || res.success) {
        showToast(res.message, "success");
        loadProducts();
      } else showToast(res.message, "error");
    } catch {
      showToast("Error deleting product", "error");
    }
  };

  /* ================= ADD / UPDATE ================= */
  const handleAddProduct = async (data) => {
    // Validate main image exists
    const hasMainImage = data.main_image && (data.main_image.file || data.main_image.url);
    if (!hasMainImage) {
      showToast("Please upload a main product image", "error");
      return;
    }

    const formData = new FormData();
    
    // Add text fields
    formData.append("product_name", data.product_name);
    formData.append("tagline", data.tagline || "");
    formData.append("product_desc", data.product_desc || "");
    formData.append("category_id", data.category_id);
    
    formData.append("mrp", data.mrp || 0);
    formData.append("price", data.price || 0);
    formData.append("stock_qty", data.stock_qty || 0);
    formData.append("stock_status", data.stock_status || "In Stock");
    
    formData.append("oil_type", data.oil_type || "");
    formData.append("extraction_type", data.extraction_type || "Cold Pressed");
    formData.append("ingredients", data.ingredients || "");
    formData.append("shelf_life", data.shelf_life || "");
    formData.append("fssai_number", data.fssai_number || "");
    
    formData.append("is_active", data.is_active);

    // Add JSON stringified objects
    formData.append("variants", JSON.stringify(data.variants || []));
    formData.append("health_benefits", JSON.stringify(data.health_benefits || []));

    // Handle files and old public keys (for update checks)
    
    // Main Image
    if (data.main_image?.file) {
      formData.append("main_image", data.main_image.file);
    } else if (data.main_image?.public_id) {
      formData.append("old_main_image", JSON.stringify({
        url: data.main_image.url,
        public_id: data.main_image.public_id
      }));
    } else {
      formData.append("old_main_image", "null");
    }

    // Gallery Images
    const oldGallery = [];
    (data.gallery_images || []).forEach(img => {
      if (img.file) {
        formData.append("gallery_images", img.file);
      } else if (img.public_id) {
        oldGallery.push({ url: img.url, public_id: img.public_id });
      }
    });
    formData.append("old_gallery_images", JSON.stringify(oldGallery));

    const res = editData
      ? await updateProducts(editData._id, formData)
      : await addProducts(formData);

    if (res.success || res.status) {
      showToast(res.message, "success");
      setOpen(false);
      setEditData(null);
      loadProducts();
    } else showToast(res.message, "error");
  };

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Products Management</h2>

        <button
          onClick={() => {
            setEditData(null);
            setOpen(true);
          }}
          className="bg-green-800 hover:bg-green-900 text-white font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto transition-colors"
        >
          <Plus size={16} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Search + Filter */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => {
                setCurrentPage(1);
                setSearchTerm(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-green-600 focus:outline-none"
            />
          </div>

          {/* Filter Button (Mobile) + Category Dropdown */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
            >
              <Filter size={16} />
              <span>Filters</span>
            </button>

            <div className={`${showFilters ? "block" : "hidden"} lg:block w-full lg:w-auto`}>
              <CategoryDropdown
                categories={categories}
                selectedCategory={selectedCategory}
                onSelect={(val) => {
                  setCurrentPage(1);
                  setSelectedCategory(val);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View - Card Layout */}
      <div className="block md:hidden space-y-4">
        {loading ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            Loading...
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            No products found.
          </div>
        ) : (
          products.map((p) => (
            <div key={p._id} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Product Image */}
              <div className="relative h-48 bg-gray-100">
                <img
                  src={p.images?.[0]?.url}
                  alt={p.product_name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 text-base">
                    {p.product_name}
                  </h3>
                  {p.variants && p.variants.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1 mb-1.5">
                      {p.variants.map((v, idx) => (
                        <span key={idx} className="bg-green-50 text-green-800 border border-green-200/50 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          {v.volume_size}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    {p.category_id?.category_name}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-lg font-bold text-green-700">
                    ₹{p.price}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditData(p);
                        setOpen(true);
                      }}
                      className="p-2 text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="p-2 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tablet & Desktop View - Table Layout */}
      <div className="hidden md:block bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-4 lg:px-6 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : products.length ? (
                products.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 lg:px-6 py-4">
                      <img
                        src={p.images?.[0]?.url}
                        alt={p.product_name}
                        className="h-12 w-12 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-sm font-medium text-gray-900">
                      <div>{p.product_name}</div>
                      {p.variants && p.variants.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {p.variants.map((v, idx) => (
                            <span key={idx} className="bg-green-50 text-green-800 border border-green-200/50 text-[10px] font-bold px-1.5 py-0.5 rounded">
                              {v.volume_size}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-700">
                      {p.category_id?.category_name}
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-sm font-semibold text-green-700">
                      ₹{p.price}
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditData(p);
                            setOpen(true);
                          }}
                          className="text-green-700 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="text-red-700 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 lg:px-6 py-8 text-center text-gray-500">
                    No products found.
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
        onPageChange={(p) => setCurrentPage(p)}
      />

      {/* Modal */}
      <AddProductModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
          setEditData(null);
          loadProducts();
        }}
        onSubmit={handleAddProduct}
        categories={categories}
        initialData={editData}
      />
    </div>
  );
};

export default ProductsTab;