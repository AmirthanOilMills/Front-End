import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useNavigate } from 'react-router-dom';

import { getAllProducts } from "../api/public/products";
import { getAllCategory } from "../api/public/category";
import { showToast } from "../components/common/Toast";
import CategoryDropdown from '../components/common/DropDown';

const ProductsPage = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 4; // products per page
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

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.product_desc.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ||
      product.category_id.category_name === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleViewProduct = (product) => {
    navigate('/product', { state: { product } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Products</h1>
          <p className="text-lg text-gray-600">
            Discover our complete range of pure, cold-pressed oils
          </p>
        </div>

        {/* Search + Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Category Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

              <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
                <div className="flex flex-wrap gap-2">
                  {/* <button
                    onClick={() => setSelectedCategory("All")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedCategory === "All"
                      ? 'bg-green-800 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    All
                  </button> */}

                  {/* {categories.map((category) => (
                    <button
                      key={category._id}
                      onClick={() => setSelectedCategory(category.category_name)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedCategory === category.category_name
                        ? 'bg-green-800 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {category.category_name}
                    </button>
                  ))} */}
                  <CategoryDropdown
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelect={setSelectedCategory}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} product
            {filteredProducts.length !== 1 ? 's' : ''}

            {selectedCategory !== 'All' && ` in ${selectedCategory}`}

            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>

        {/* Product Cards */}
        {filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onViewDetails={handleViewProduct}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className={`px-4 py-2 rounded-md border ${currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white hover:bg-gray-100'
                  }`}
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`px-4 py-2 rounded-md border ${currentPage === idx + 1
                    ? 'bg-green-800 text-white'
                    : 'bg-white hover:bg-gray-100'
                    }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className={`px-4 py-2 rounded-md border ${currentPage === totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white hover:bg-gray-100'
                  }`}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No products found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="mt-4 text-green-800 hover:text-green-900 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
