import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import {
  AcademicCapIcon,
  PlusIcon,
  TrashIcon,
  ChevronDoubleUpIcon,
  StopIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/solid";

const ManageBatches = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [error, setError] = useState("");

  const getBatch = (batch) => {
    batch = batch || "";
    axios
      .get(`${import.meta.env.VITE_SERVER}/admin/getBatch/${batch}`)
      .then((response) => {
        setBatches(response.data);
      })
      .catch((err) => {
        setError("Failed to fetch batches. Please try again.");
        console.log(err);
      });
  };

  useEffect(() => {
    getBatch();
  }, []);

  const [visibleCount, setVisibleCount] = useState(10);
  const [modalMode, setModalMode] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [formData, setFormData] = useState({
    batchName: "",
    year: "",
  });
  const [formError, setFormError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError(""); // Clear error when user starts typing
  };

  const handleAddBatch = () => {
    setFormError("");

    if (!formData.batchName || !formData.year) {
      setFormError("Please fill in all fields");
    }

    const newBatch = {
      batch: formData.batchName,
      year: formData.year,
    };
    axios
      .post(`${import.meta.env.VITE_SERVER}/admin/addBatch`, newBatch)
      .then((response) => {
        setBatches(response.data);
      })
      .catch((err) => {
        setError("Failed to fetch batches. Please try again.");
        console.log(err);
      });

    setModalMode(null);
    setFormData({
      batchName: "",
      year: "",
    });
  };

  const handleDeleteBatch = () => {
    axios
      .post(
        `${import.meta.env.VITE_SERVER}/admin/deleteBatch/${selectedBatch.id}`,
      )
      .then((response) => {
        setBatches(response.data);
      })
      .catch((err) => {
        setError("Failed to fetch batches. Please try again.");
        console.log(err);
      });

    setModalMode(null);
    setSelectedBatch(null);
  };

  const handlePromoteBatch = () => {
    axios
      .post(
        `${import.meta.env.VITE_SERVER}/admin/promoteBatch/${selectedBatch.id}`,
      )
      .then((response) => {
        setBatches(response.data);
      })
      .catch((err) => {
        setError(err.response.data);
        console.log(err);
      });

    setModalMode(null);
    setSelectedBatch(null);
  };

  const handleDeactivateBatch = () => {
    axios
      .post(
        `${import.meta.env.VITE_SERVER}/admin/deactivateBatch/${selectedBatch.id}`,
      )
      .then((response) => {
        setBatches(response.data);
      })
      .catch((err) => {
        setError(err.response.data);
        console.log(err);
      });
    setModalMode(null);
    setSelectedBatch(null);
  };

  const filteredBatches = batches.filter((batch) =>
    batch.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const renderModal = () => {
    if (!modalMode) return null;

    const modalConfig = {
      add: {
        title: "Add New Batch",
        submitText: "Create Batch",
        onSubmit: handleAddBatch,
      },
      delete: {
        title: "Confirm Deletion",
        submitText: "Delete",
        onSubmit: handleDeleteBatch,
      },
      promote: {
        title: "Promote Batch",
        submitText: "Promote",
        onSubmit: handlePromoteBatch,
      },
      deactivate: {
        title: "Deactivate Batch",
        submitText: "Deactivate",
        onSubmit: handleDeactivateBatch,
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
                setFormError("");
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

          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{formError}</p>
            </div>
          )}

          {modalMode === "add" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Batch Name
                </label>
                <input
                  type="text"
                  name="batchName"
                  value={formData.batchName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder="Enter batch name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Year
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder="Enter year"
                />
              </div>
            </>
          )}

          {(modalMode === "delete" ||
            modalMode === "promote" ||
            modalMode === "deactivate") && (
            <p className="text-gray-600">
              {modalMode === "delete" &&
                `Are you sure you want to delete "${selectedBatch.name}"?`}
              {modalMode === "promote" &&
                `Are you sure you want to promote "${selectedBatch.name}"?`}
              {modalMode === "deactivate" &&
                `Are you sure you want to deactivate "${selectedBatch.name}"?`}
              <br />
              This action cannot be undone.
            </p>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setModalMode(null);
                setFormError("");
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
                  : modalMode === "promote"
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : modalMode === "deactivate"
                      ? "bg-yellow-500 text-white hover:bg-yellow-600"
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
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="hover:bg-indigo-700 p-2 rounded-lg transition"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold">Batch Management</h1>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-b border-red-200">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="p-6">
          <div className="mb-6 flex space-x-4">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Search batches..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  getBatch(e.target.value);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={() => setModalMode("add")}
              className="flex items-center space-x-2 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Batch</span>
            </button>
          </div>

          <div className="bg-white rounded-lg border">
            {filteredBatches.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <AcademicCapIcon className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Batches Found
                </h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? "No batches match your search criteria"
                    : "Start by adding a new batch"}
                </p>
              </div>
            ) : (
              filteredBatches.slice(0, visibleCount).map((batch) => (
                <div
                  key={batch.id}
                  className={`flex items-center justify-between px-6 py-4 border-b hover:bg-gray-50 transition ${
                    batch.status === "Active"
                      ? "bg-green-50 border-green-100"
                      : "bg-red-50 border-red-100"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <AcademicCapIcon
                      className={`h-10 w-10 ${
                        batch.status === "Active"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    />
                    <div>
                      <div className="font-semibold text-gray-800">
                        {batch.name}
                      </div>
                      <div
                        className={`text-sm ${
                          batch.status === "Active"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        Year: {batch.year} | Status: {batch.status}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setSelectedBatch(batch);
                        setModalMode("promote");
                      }}
                      className="text-green-500 hover:text-green-600 transition"
                      title="Promote"
                    >
                      <ChevronDoubleUpIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedBatch(batch);
                        setModalMode("deactivate");
                      }}
                      className="text-yellow-500 hover:text-yellow-600 transition"
                      title="Deactivate"
                    >
                      <StopIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedBatch(batch);
                        setModalMode("delete");
                      }}
                      className="text-red-500 hover:text-red-600 transition"
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {visibleCount < filteredBatches.length && (
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

export default ManageBatches;
