import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import {
  BookOpenIcon,
  PlusIcon,
  TrashIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/solid";

const ManageClasses = () => {
  const [batches, setBatches] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const [modalMode, setModalMode] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [newClassName, setNewClassName] = useState("");

  const navigate = useNavigate();

  const getBatch = () => {
    axios
      .get(`${import.meta.env.VITE_SERVER}/admin/getActiveBatch`)
      .then((response) => {
        setBatches(response.data);
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getBatch();
  }, []);

  const getClasses = () => {
    axios
      .get(`${import.meta.env.VITE_SERVER}/admin/getClass/${selectedBatch.id}`)
      .then((response) => {
        setClasses(response.data);
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    if (selectedBatch) {
      getClasses();
    }
  }, [selectedBatch]);

  const handleAddClass = () => {
    if (!newClassName || !selectedBatch) {
      alert("Please fill in all fields and select a batch.");
      return;
    }

    const newClass = {
      className: newClassName,
      batchId: selectedBatch.id,
    };

    axios
      .post(`${import.meta.env.VITE_SERVER}/admin/addClass`, newClass)
      .then((response) => {
        setClasses(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setModalMode(null);
    setNewClassName("");
  };

  const handleDeleteClass = () => {
    axios
      .post(
        `${import.meta.env.VITE_SERVER}/admin/deleteClass/${selectedClass.id}`,
      )
      .then((response) => {
        setClasses(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setModalMode(null);
    setSelectedClass(null);
  };

  const renderModal = () => {
    if (!modalMode) return null;

    const modalConfig = {
      add: {
        title: "Add New Class",
        submitText: "Create Class",
        onSubmit: handleAddClass,
      },
      delete: {
        title: "Confirm Deletion",
        submitText: "Delete",
        onSubmit: handleDeleteClass,
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
              onClick={() => setModalMode(null)}
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
            <div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Class Name
                </label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder="Enter class name"
                />
              </div>
            </div>
          )}

          {modalMode === "delete" && (
            <p className="text-gray-600">
              Are you sure you want to delete "{selectedClass.name}" from{" "}
              {selectedBatch.name}?
              <br />
              This action cannot be undone.
            </p>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setModalMode(null)}
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
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="hover:bg-indigo-700 p-2 rounded-lg transition"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold">Manage Classes</h1>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6 flex space-x-4 items-center">
            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Batch
              </label>
              <select
                value={selectedBatch ? selectedBatch.id : ""}
                onChange={(e) => {
                  const batch = batches.find((b) => b.id == e.target.value);
                  setSelectedBatch(batch);
                  setVisibleCount(10);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select a Batch</option>
                {batches.length === 0 ? (
                  <option value="" disabled>
                    No batches found
                  </option>
                ) : (
                  batches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            {selectedBatch && (
              <button
                onClick={() => setModalMode("add")}
                className="flex items-center space-x-2 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition mt-6"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Add Class</span>
              </button>
            )}
          </div>

          {selectedBatch ? (
            classes.length > 0 ? (
              <div className="bg-white rounded-lg border">
                {classes.slice(0, visibleCount).map((cls) => (
                  <div
                    key={cls.id}
                    className="flex items-center justify-between px-6 py-4 border-b hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center space-x-4">
                      <BookOpenIcon className="h-10 w-10 text-indigo-500" />

                      <div className="font-semibold text-gray-800">
                        {cls.name}
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setSelectedClass(cls);
                          setModalMode("delete");
                        }}
                        className="text-red-500 hover:text-red-600 transition"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-10">
                No classes found for the selected batch
              </div>
            )
          ) : (
            <div className="text-center text-gray-500 py-10">
              Please select a batch to view classes
            </div>
          )}

          {selectedBatch && visibleCount < classes.length && (
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

export default ManageClasses;
