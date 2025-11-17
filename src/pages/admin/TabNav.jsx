import React from "react";
import { NavLink } from "react-router-dom";

const TabNav = ({ role }) => {
  const baseTabs = [
    { path: "/admin", label: "Overview" },
    { path: "/admin/categories", label: "Categories" },
    { path: "/admin/products", label: "Products" },
    { path: "/admin/orders", label: "Orders" },
  ];

  const tabs =
    role === "admin"
      ? [...baseTabs, { path: "/admin/admins", label: "Admins" }]
      : baseTabs;

  return (
    <div className="flex space-x-2 mb-8 px-4 overflow-x-auto border-b border-gray-200 bg-white">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          end
          className={({ isActive }) =>
            `px-4 py-2 rounded-md font-medium transition-colors ${
              isActive
                ? "bg-green-800 text-white"
                : "text-gray-600 hover:text-green-800 hover:bg-green-50"
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
};

export default TabNav;
