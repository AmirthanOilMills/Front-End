import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="flex items-center justify-center space-x-2 mt-4">

            {/* Prev Button */}
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className={`p-2 border rounded-lg text-sm flex items-center 
                    ${currentPage === 1 
                        ? "opacity-30 cursor-not-allowed" 
                        : "hover:bg-gray-100"
                    }
                `}
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Numbers */}
            {pageNumbers.map((num) => (
                <button
                    key={num}
                    onClick={() => onPageChange(num)}
                    className={`px-3 py-1 border rounded-lg text-sm 
                        ${currentPage === num
                            ? "bg-green-700 text-white border-green-700"
                            : "hover:bg-gray-100"
                        }
                    `}
                >
                    {num}
                </button>
            ))}

            {/* Next Button */}
            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className={`p-2 border rounded-lg text-sm flex items-center
                    ${currentPage === totalPages
                        ? "opacity-30 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }
                `}
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Pagination;
