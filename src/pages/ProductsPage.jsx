import React, { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import CategoryDropdown from "../components/common/DropDown";
import { getAllProducts } from "../api/public/products";
import { getAllCategory } from "../api/public/category";
import { showToast } from "../components/common/Toast";

const ProductsPage = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [showFilters, setShowFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 16;
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
        selectedCategory === "All Categories"
          ? ""
          : categories.find((c) => c.category_name === selectedCategory)?._id;

      const res = await getAllProducts(currentPage, limit, searchTerm, categoryId);

      if (res.success) {
        setProducts(res.products);
        setTotalPages(res.totalPages);
      } else {
        showToast("Failed to load products", "error");
      }
    } catch (error) {
      showToast("Error loading products", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleViewProduct = (product) => {
    navigate("/product", { state: { product } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Our Products</h1>

        {/* Search + Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="flex flex-col lg:flex-row gap-4">

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => {
                  setCurrentPage(1);
                  setSearchTerm(e.target.value);
                }}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Category */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-md"
              >
                <Filter className="w-4 h-4" /> Filters
              </button>

              <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
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

        {/* Products */}
        {loading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : products.length ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onViewDetails={handleViewProduct}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-10">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 border rounded ${
                    currentPage === i + 1 ? "bg-green-700 text-white" : ""
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
