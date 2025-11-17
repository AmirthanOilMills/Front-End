import React, { useEffect } from "react";

const Modal = ({ isOpen, onClose, title, children, width = "max-w-lg" }) => {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn h-[100%] min-h-screen"
      onClick={onClose} // Close when clicking background
    >
      <div
        className={`bg-white rounded-xl shadow-lg p-6 relative w-full ${width} animate-fadeIn max-h-[80vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 sticky">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✖
          </button>
        </div>

        {/* Body */}
        <div className="">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
