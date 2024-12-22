import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import {
  UserCircleIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/solid";

const ManageAdmins = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const logout = () => {
    axios
      .post(`${import.meta.env.VITE_SERVER}/admin/logout`)
      .then(() => navigate("/"))
      .catch((err) => {
        console.log(err);
      });
  };
  const getAdmins = (username) => {
    username = username || "";
    axios
      .get(`${import.meta.env.VITE_SERVER}/admin/getAdmins/${username}`)
      .then((response) => {
        setAdmins(response.data);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getAdmins();
  }, []);
  const [visibleCount, setVisibleCount] = useState(10);
  const [modalMode, setModalMode] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

  const validatePassword = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    return checks;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (name.includes("Password")) {
      const newErrors = {};
      if (name === "password" || name === "newPassword") {
        const checks = validatePassword(value);
        if (!checks.length)
          newErrors[name] = "Password must be at least 8 characters";
        else if (!checks.uppercase)
          newErrors[name] = "Password must include an uppercase letter";
        else if (!checks.lowercase)
          newErrors[name] = "Password must include a lowercase letter";
        else if (!checks.number)
          newErrors[name] = "Password must include a number";
        else if (!checks.special)
          newErrors[name] = "Password must include a special character";
      }

      const confirmField =
        name === "password" ? "confirmPassword" : "confirmNewPassword";
      const confirmValue = formData[confirmField];
      if (confirmValue && value !== confirmValue) {
        newErrors[confirmField] = "Passwords do not match";
      }

      setErrors((prev) => ({ ...prev, ...newErrors }));
    }
  };

  const validateForm = (mode) => {
    const newErrors = {};

    if (mode === "add") {
      if (formData.username.length < 4) {
        newErrors.username = "Username must be at least 4 characters";
      }
      if (!passwordRegex.test(formData.password)) {
        newErrors.password = "Password does not meet requirements";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    } else if (mode === "changePassword") {
      if (!passwordRegex.test(formData.newPassword)) {
        newErrors.newPassword = "Password does not meet requirements";
      }
      if (formData.newPassword !== formData.confirmNewPassword) {
        newErrors.confirmNewPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAdmin = () => {
    if (!validateForm("add")) return;

    const newAdmin = {
      username: formData.username,
      password: formData.password,
    };

    axios
      .post(`${import.meta.env.VITE_SERVER}/admin/createAdmin`, newAdmin)
      .then((response) => {
        setAdmins(response.data);
        setModalMode(null);
        setFormData({
          username: "",
          password: "",
          confirmPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
        setErrors({});
      })
      .catch((err) => {
        console.log(err);
      });

    setAdmins([...admins, newAdmin]);
    setModalMode(null);
    setFormData({
      username: "",
      password: "",
      confirmPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setErrors({});
  };

  const handleDeleteAdmin = () => {
    axios
      .post(
        `${import.meta.env.VITE_SERVER}/admin/deleteAdmin/${selectedAdmin._id}`,
      )
      .then((response) => {
        setAdmins(response.data.admins);
      })
      .catch((error) => {
        console.log(error);
      });
    setModalMode(null);
    setFormData({
      username: "",
      password: "",
      confirmPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setErrors({});
  };

  const Search = (e) => {
    setSearchTerm(e.target.value);
    getAdmins(e.target.value);
  };

  const handlePasswordChange = () => {
    if (!validateForm("changePassword")) return;
    axios
      .post(
        `${import.meta.env.VITE_SERVER}/admin/updateAdmin/${selectedAdmin._id}`,
        { password: formData.newPassword },
      )
      .then((response) => {
        console.log("success");
      })
      .catch((error) => {
        console.log(error);
      });

    setModalMode(null);
    setSelectedAdmin(null);
    setFormData({
      username: "",
      password: "",
      confirmPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setErrors({});
  };

  const renderFormField = (label, name, type = "text") => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        required
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        className={`mt-1 block w-full rounded-md border shadow-sm focus:ring focus:ring-opacity-50 ${
          errors[name]
            ? "border-red-300 focus:border-red-300 focus:ring-red-200"
            : "border-gray-300 focus:border-indigo-300 focus:ring-indigo-200"
        } p-2`}
      />
      {errors[name] && (
        <div className="mt-1 text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-200">
          {errors[name]}
        </div>
      )}
    </div>
  );

  const renderPasswordRequirements = (password, fieldName) => {
    const checks = validatePassword(password);
    return (
      <div className="mt-2 space-y-1">
        <p className="text-sm font-medium text-gray-700">
          Password requirements:
        </p>
        <ul className="text-sm space-y-1">
          {[
            { check: "length", text: "At least 8 characters" },
            { check: "uppercase", text: "One uppercase letter" },
            { check: "lowercase", text: "One lowercase letter" },
            { check: "number", text: "One number" },
            { check: "special", text: "One special character" },
          ].map(({ check, text }) => (
            <li
              key={check}
              className={`flex items-center space-x-2 ${checks[check] ? "text-green-600" : "text-gray-500"}`}
            >
              {checks[check] ? (
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderModal = () => {
    if (!modalMode) return null;

    const modalConfig = {
      add: {
        title: "Add New Admin",
        submitText: "Create Admin",
        onSubmit: handleAddAdmin,
      },
      delete: {
        title: "Confirm Deletion",
        submitText: "Delete",
        onSubmit: handleDeleteAdmin,
      },
      changePassword: {
        title: "Change Password",
        submitText: "Update Password",
        onSubmit: handlePasswordChange,
      },
    };

    const currentConfig = modalConfig[modalMode];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {currentConfig.title}
            </h2>
            <button
              onClick={() => {
                setModalMode(null);
                setErrors({});
              }}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {modalMode === "add" && (
            <div className="space-y-4">
              {renderFormField("Username", "username")}
              {renderFormField("Password", "password", "password")}
              {renderPasswordRequirements(formData.password, "password")}
              {renderFormField(
                "Confirm Password",
                "confirmPassword",
                "password",
              )}
            </div>
          )}

          {modalMode === "changePassword" && (
            <div className="space-y-4">
              {renderFormField("New Password", "newPassword", "password")}
              {renderPasswordRequirements(formData.newPassword, "newPassword")}
              {renderFormField(
                "Confirm New Password",
                "confirmNewPassword",
                "password",
              )}
            </div>
          )}

          {modalMode === "delete" && (
            <p className="text-gray-600">
              Are you sure you want to delete "{selectedAdmin?.username}"? This
              action cannot be undone.
            </p>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setModalMode(null);
                setErrors({});
              }}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={currentConfig.onSubmit}
              className={`px-4 py-2 rounded-lg transition ${
                modalMode === "delete"
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-indigo-500 text-white hover:bg-indigo-600"
              }`}
            >
              {currentConfig.submitText}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 bg-indigo-600 text-white flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Management</h1>
          <button
            onClick={logout}
            className="flex items-center space-x-2 hover:bg-indigo-700 px-3 py-2 rounded-lg transition"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 flex space-x-4">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Search admins..."
                value={searchTerm}
                onChange={Search}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={() => setModalMode("add")}
              className="flex items-center space-x-2 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Admin</span>
            </button>
          </div>

          <div className="bg-white rounded-lg border">
            {admins.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <UserCircleIcon className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Admins Found
                </h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? "No administrators match your search criteria"
                    : "Start by adding a new administrator"}
                </p>
              </div>
            ) : (
              admins.slice(0, visibleCount).map((admin) => (
                <div
                  key={admin.id}
                  className="flex items-center justify-between px-6 py-4 border-b hover:bg-gray-50 transition"
                >
                  <div className="flex items-center space-x-4">
                    <UserCircleIcon className="h-10 w-10 text-indigo-500" />
                    <div>
                      <div className="font-semibold text-gray-800">
                        {admin.username}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setSelectedAdmin(admin);
                        setModalMode("changePassword");
                      }}
                      className="text-yellow-500 hover:text-yellow-600 transition"
                      title="Change Password"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAdmin(admin);
                        setModalMode("delete");
                      }}
                      className="text-red-500 hover:text-red-600 transition"
                      title="Delete Admin"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {visibleCount < admins.length && (
            <div className="text-center mt-6">
              <button
                onClick={() => setVisibleCount((prev) => prev + 10)}
                className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>

      {renderModal()}
    </div>
  );
};

export default ManageAdmins;
