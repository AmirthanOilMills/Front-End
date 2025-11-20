import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import AddProductModal from "../../../components/admin/AddProductModal";
import { addProducts, getAllProducts, updateProducts, deleteProducts } from "../../../api/admin/products";
import { getAllCategory } from "../../../api/admin/category";
import { showToast } from "../../../components/common/Toast";
import Pagination from "../../../components/common/Pagination";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const ProductsTab = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [currentPage]);
  

  const loadCategories = async () => {
    try {
      const res = await getAllCategory();
      if (res.success) setCategories(res.categories);
      else showToast(res.message || "Failed to load categories", "error");
    } catch (err) {
      showToast("Error loading categories", "error");
    }
  };

  const loadProducts = async () => {
    try {
      const res = await getAllProducts(currentPage, limit);
      if (res.success) {
        setProducts(res.products);
        setTotalPages(res.totalPages);
      } else showToast(res.message || "Failed to load products", "error");
    } catch (err) {
      showToast("Error loading products", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      const res = await deleteProducts(id);
      if (res.status) {
        showToast(res.message, "success");
        loadProducts();
      } else showToast(res.message, "error");
    } catch (err) {
      showToast("Error deleting product", "error");
    }
  };

  const handleAddProduct = async (data) => {
    if (!data.images || data.images.length === 0) {
      showToast("Please upload at least one image", "error");
      return;
    }
    const formData = new FormData();

    formData.append("product_name", data.product_name);
    formData.append("product_desc", data.product_desc);
    formData.append("category_id", data.category_id);
    formData.append("price", data.price);
    formData.append("stock", data.stock);
    formData.append("is_active", data.is_active);

    data.health_benefits.forEach((b) =>
      formData.append("health_benefits[]", b)
    );

    // FIX: correct image separation
    data.images.forEach((img) => {
      if (img.file) {
        formData.append("images", img.file);
      } else {
        formData.append("old_images[]", img.url.replace(BASE_URL, ""));
      }
    });

    let res;

    if (editData) {
      res = await updateProducts(editData._id, formData);
    } else {
      res = await addProducts(formData);
    }

    if (res.success || res.status) {
      showToast(res.message, "success");
      setOpen(false);
      setEditData(null);
      loadProducts();
    } else {
      showToast(res.message, "error");
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Products Management</h2>

        <button
          onClick={() => { setEditData(null); setOpen(true); }}
          className="bg-green-800 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Image</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {products.map((p) => (
              <tr key={p._id}>
                <td className="px-6 py-3">
                  <img
                    src={`${BASE_URL}${p.images?.[0]}`}
                    className="h-12 w-12 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-3">{p.product_name}</td>
                <td className="px-6 py-3">
                  {p.category_id.category_name}
                </td>
                <td className="px-6 py-3">₹{p.price}</td>

                <td className="px-6 py-3 space-x-3">
                  <button
                    onClick={() => { setEditData(p); setOpen(true); }}
                    className="text-green-700"
                  >
                    <Edit size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(p._id)}
                    className="text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
        onClose={() => { setOpen(false); setEditData(null); }}
        onSubmit={handleAddProduct}
        categories={categories}
        initialData={editData}
      />
    </div>
  );
};

export default ProductsTab;
