import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import AddUserModal from "../../../components/admin/AddUserModal";
import { getAllUsers, addUser, updateUser, deleteUser } from "../../../api/admin/users";
import { showToast } from "../../../components/common/Toast";
import Pagination from "../../../components/common/Pagination";

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadUsers();
  }, [currentPage]);

  const loadUsers = async () => {
    try {
      const res = await getAllUsers(currentPage, limit);

      if (res.status) {
        setUsers(res.users);
        setTotalPages(res.totalPages);
      } else {
        showToast(res.message || "Failed to load users", "error");
      }
    } catch (err) {
      showToast("Error loading users", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      const res = await deleteUser(id);
      if (res.status) {
        showToast(res.message, "success");
        loadUsers();
      } else showToast(res.message, "error");
    } catch (err) {
      showToast("Error deleting user", "error");
    }
  };

  const handleSubmitUser = async (data) => {
    let res;

    if (editData) {
      res = await updateUser(editData._id, data);
    } else {
      res = await addUser(data);
    }

    if (res.status || res.status) {
      showToast(res.message, "success");
      setOpen(false);
      setEditData(null);
      loadUsers();
    } else {
      showToast(res.message, "error");
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">User Management</h2>

        <button
          onClick={() => { setEditData(null); setOpen(true); }}
          className="bg-green-800 hover:bg-green-900 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 w-full sm:w-auto transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Mobile View - Card Layout */}
      <div className="block md:hidden space-y-4">
        {users.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
            No users found.
          </div>
        ) : (
          users.map((user) => (
            <div key={user._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Header with Badges */}
              <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {user.role}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* User Details */}
              <div className="p-4 space-y-3">
                {/* Name */}
                <div>
                  <span className="text-xs text-gray-500 font-medium">Name</span>
                  <p className="text-base font-semibold text-gray-900 mt-1">
                    {user.name}
                  </p>
                </div>

                {/* Email */}
                <div>
                  <span className="text-xs text-gray-500 font-medium">Email</span>
                  <p className="text-sm text-gray-900 mt-1 break-all">
                    {user.email}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t">
                  <button
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                    onClick={() => { setEditData(user); setOpen(true); }}
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>

                  {user.role !== "admin" && (
                    <button
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                      onClick={() => handleDelete(user._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tablet & Desktop View - Table Layout */}
      <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 lg:px-6 py-4 text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-4 lg:px-6 py-4 text-sm text-gray-900">
                    {user.email}
                  </td>

                  <td className="px-4 lg:px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="px-4 lg:px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                        user.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-4 lg:px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors"
                        onClick={() => { setEditData(user); setOpen(true); }}
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {user.role !== "admin" && (
                        <button
                          className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                          onClick={() => handleDelete(user._id)}
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 lg:px-6 py-8 text-center text-gray-500 text-sm">
                    No users found.
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
      <AddUserModal
        isOpen={open}
        onClose={() => { setOpen(false); setEditData(null); }}
        onSubmit={handleSubmitUser}
        initialData={editData}
      />
    </div>
  );
};

export default UsersTab;