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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>

        <button
          onClick={() => { setEditData(null); setOpen(true); }}
          className="bg-green-800 hover:bg-green-900 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-6 py-4 flex gap-3">
                    <button
                      className="text-green-600 hover:text-green-900"
                      onClick={() => { setEditData(user); setOpen(true); }}
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    {user.role !== "admin" && (
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDelete(user._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500 text-sm">
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
