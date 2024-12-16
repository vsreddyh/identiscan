import React, { useState } from "react";
import { FaTrash, FaTimes } from "react-icons/fa";

const ManageAdmin = () => {
  const [admins, setAdmins] = useState(
    Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `Admin ${i + 1}`,
    })),
  );
  const [visibleCount, setVisibleCount] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 10);
  };

  const handleLogout = () => {
    alert("You have been logged out.");
  };

  const openChangePasswordModal = (admin) => {
    setSelectedAdmin(admin);
    setShowModal(true);
    setPassword("");
    setConfirmPassword("");
  };

  const handleAddAdmin = () => {
    setShowAddModal(true);
  };

  const handleAddNewAdmin = () => {
    if (
      username.length < 4 ||
      newPassword !== newConfirmPassword ||
      !passwordRegex.test(newPassword)
    ) {
      alert("Please fill in the form correctly.");
      return;
    }
    const newAdmin = {
      id: admins.length + 1,
      name: username,
    };
    setAdmins([...admins, newAdmin]);
    setShowAddModal(false);
    setUsername("");
    setNewPassword("");
    setNewConfirmPassword("");
  };

  const openDeleteModal = (admin) => {
    setSelectedAdmin(admin);
    setShowDeleteModal(true);
  };

  const handleDeleteAdmin = () => {
    setAdmins((prevAdmins) =>
      prevAdmins.filter((admin) => admin.id !== selectedAdmin.id),
    );
    setShowDeleteModal(false);
    setSelectedAdmin(null);
  };

  const isPasswordValid = passwordRegex.test(password);
  const isConfirmPasswordValid =
    password === confirmPassword && isPasswordValid;

  const filteredAdmins = admins.filter((admin) =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4">
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        style={{ position: "absolute", top: "1rem", right: "1rem" }}
      >
        Logout
      </button>
      {/* Header */}
      <header className="text-2xl font-bold mb-6 text-gray-800">
        Manage Admins
      </header>

      {/* Search Admin */}
      <input
        type="text"
        placeholder="Search Admin..."
        className="p-2 border border-gray-300 rounded w-full max-w-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Admin List */}
      <ul className="w-full max-w-4xl">
        {filteredAdmins.slice(0, visibleCount).map((admin, index) => (
          <li
            key={admin.id}
            className="flex items-center justify-between border-b border-gray-300 py-4 px-2"
          >
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-700">{index + 1}.</span>
              <span className="text-gray-800">{admin.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => openChangePasswordModal(admin)}
                className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Change Password
              </button>
              <button
                onClick={() => openDeleteModal(admin)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Add Admin Button */}
      <button
        onClick={handleAddAdmin}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Add Admin
      </button>

      {/* Show More Button */}
      {visibleCount < filteredAdmins.length && (
        <button
          onClick={handleShowMore}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Show More
        </button>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Confirm Deletion
            </h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{selectedAdmin.name}"?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleDeleteAdmin}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Change Password
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <FaTimes />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">New Password</label>
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Confirm Password</label>
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                disabled={!isConfirmPasswordValid}
                onClick={() => alert("Password changed successfully")}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Submit
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Add Admin</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <FaTimes />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">New Password</label>
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Confirm Password</label>
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded"
                value={newConfirmPassword}
                onChange={(e) => setNewConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                disabled={
                  newPassword !== newConfirmPassword ||
                  !passwordRegex.test(newPassword)
                }
                onClick={handleAddNewAdmin}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Submit
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAdmin;
