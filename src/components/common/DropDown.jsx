import React, { useState } from "react";

const CategoryDropdown = ({ categories, selectedCategory, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (name) => {
        onSelect(name);
        setIsOpen(false);
    };

    const closeModalOutside = (e) => {
        if (e.target.id === "category-modal-overlay") {
            setIsOpen(false);
        }
    };

    return (
        <div className="relative w-full">
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="w-full px-4 py-2 bg-green-800 text-white rounded-md flex items-center justify-between"
            >
                <span>{selectedCategory || "Select Category"}</span>

                {/* Chevron Down Icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Modal */}
            {isOpen && (
                <div
                    id="category-modal-overlay"
                    onClick={closeModalOutside}
                    className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
                >
                    <div
                        className="bg-white w-80 p-4 rounded-lg shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold mb-3">Choose Category</h3>

                        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">

                            {/* ---- All Categories option ---- */}
                            <button
                                onClick={() => handleSelect("All Categories")}
                                className={`px-4 py-2 rounded-md text-sm text-left transition-colors ${selectedCategory === "All Categories"
                                        ? "bg-green-800 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                All Categories
                            </button>

                            {/* ---- Category list ---- */}
                            {categories.map((category) => (
                                <button
                                    key={category._id}
                                    onClick={() => handleSelect(category.category_name)}
                                    className={`px-4 py-2 rounded-md text-sm text-left transition-colors ${selectedCategory === category.category_name
                                            ? "bg-green-800 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    {category.category_name}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded-md"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryDropdown;
