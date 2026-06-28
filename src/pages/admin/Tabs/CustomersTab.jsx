import React, { useState, useEffect } from "react";
import { Users, Copy, Eye, EyeOff } from "lucide-react";
import { getAllCustomers } from "../../../api/admin/users";
import { showToast } from "../../../components/common/Toast";

const CustomersTab = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visiblePasswords, setVisiblePasswords] = useState({});

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const res = await getAllCustomers();
      if (res.status) {
        setCustomers(res.customers || []);
      } else {
        showToast(res.message || "Failed to load customers", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error loading customers", "error");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Password hash copied to clipboard", "success");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-800"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-green-800" />
            Customer Directory
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage and view all registered shoppers. Total: {customers.length}
          </p>
        </div>
      </div>

      {/* Mobile View - Card Layout */}
      <div className="block md:hidden space-y-4">
        {customers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-6 text-center text-gray-500">
            No customers found.
          </div>
        ) : (
          customers.map((cust) => (
            <div key={cust._id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div className="p-4 space-y-3">
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</span>
                  <p className="text-base font-semibold text-gray-900 mt-0.5">{cust.name}</p>
                </div>

                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</span>
                  <p className="text-sm text-gray-700 mt-0.5 break-all">{cust.email}</p>
                </div>

                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Password Hash</span>
                  <div className="flex items-center gap-2 mt-1 bg-gray-50 p-2 rounded-lg border border-gray-200">
                    <code className="text-xs text-gray-600 font-mono flex-1 break-all select-all">
                      {visiblePasswords[cust._id] ? cust.password : "••••••••••••••••••••••••••••••••••••••••••••"}
                    </code>
                    <button
                      onClick={() => togglePasswordVisibility(cust._id)}
                      className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                    >
                      {visiblePasswords[cust._id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => copyToClipboard(cust.password)}
                      className="p-1 text-gray-500 hover:text-green-700 hover:bg-green-50 rounded"
                      title="Copy Hash"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tablet & Desktop View - Table Layout */}
      <div className="hidden md:block bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto font-sans">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Email Address
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Password Hash
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-150">
              {customers.map((cust) => (
                <tr key={cust._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {cust.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                    {cust.email}
                  </td>
                  <td className="px-6 py-4 text-sm max-w-xs xl:max-w-md">
                    <div className="flex items-center gap-3 bg-gray-50/50 hover:bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200/60 transition-colors">
                      <code className="text-xs text-gray-600 font-mono flex-1 truncate select-all">
                        {visiblePasswords[cust._id] ? cust.password : "••••••••••••••••••••••••••••••••••••••••••••"}
                      </code>
                      <button
                        onClick={() => togglePasswordVisibility(cust._id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        title={visiblePasswords[cust._id] ? "Hide Hash" : "Reveal Hash"}
                      >
                        {visiblePasswords[cust._id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => copyToClipboard(cust.password)}
                        className="text-gray-400 hover:text-green-600 transition-colors"
                        title="Copy Hash"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {customers.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-10 text-center text-gray-500 text-sm">
                    No registered customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomersTab;
