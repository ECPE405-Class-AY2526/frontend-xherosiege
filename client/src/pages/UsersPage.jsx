import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuthStore from "../utils/authStore";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    role: "",
  });
  const { token } = useAuthStore();

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  // Start editing user
  const startEdit = (user) => {
    setEditingUser(user._id);
    setEditForm({
      username: user.username,
      email: user.email,
      role: user.role || "user",
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingUser(null);
    setEditForm({ username: "", email: "", role: "" });
  };

  // Save user changes
  const saveUser = async (userId) => {
    try {
      await axios.put(`/api/users/${userId}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchUsers(); // Refresh the list
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    }
  };

  // Delete user
  const deleteUser = async (userId, username) => {
    if (window.confirm(`Are you sure you want to delete user "${username}"?`)) {
      try {
        await axios.delete(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await fetchUsers(); // Refresh the list
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user");
      }
    }
  };

  // Reset user password
  const resetPassword = async (userId, username) => {
    if (
      window.confirm(`Reset password for user "${username}" to default (123)?`)
    ) {
      try {
        await axios.put(
          `/api/users/${userId}/reset-password`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Password reset successfully to '123'");
      } catch (error) {
        console.error("Error resetting password:", error);
        alert("Failed to reset password");
      }
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Users Management</h1>
        <button className="btn btn-primary" onClick={fetchUsers}>
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  {editingUser === user._id ? (
                    <input
                      type="text"
                      className="input input-bordered input-sm w-full max-w-xs"
                      value={editForm.username}
                      onChange={(e) =>
                        setEditForm({ ...editForm, username: e.target.value })
                      }
                    />
                  ) : (
                    user.username
                  )}
                </td>
                <td>
                  {editingUser === user._id ? (
                    <input
                      type="email"
                      className="input input-bordered input-sm w-full max-w-xs"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td>
                  {editingUser === user._id ? (
                    <select
                      className="select select-bordered select-sm w-full max-w-xs"
                      value={editForm.role}
                      onChange={(e) =>
                        setEditForm({ ...editForm, role: e.target.value })
                      }
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span
                      className={`badge ${
                        user.role === "admin"
                          ? "badge-warning"
                          : "badge-primary"
                      }`}
                    >
                      {user.role || "user"}
                    </span>
                  )}
                </td>
                <td>
                  <div className="flex gap-2">
                    {editingUser === user._id ? (
                      <>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => saveUser(user._id)}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => startEdit(user)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-info btn-sm"
                          onClick={() => resetPassword(user._id, user.username)}
                        >
                          Reset Password
                        </button>
                        <button
                          className="btn btn-error btn-sm"
                          onClick={() => deleteUser(user._id, user.username)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No users found</p>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
