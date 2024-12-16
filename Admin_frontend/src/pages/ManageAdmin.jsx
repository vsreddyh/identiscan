import React, { useState } from "react";

const Dashboard = () => {
  const [rows, setRows] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Student ${i + 1}`,
      roll: `Roll ${i + 1}`,
      percentage: `${Math.floor(Math.random() * 101)}%`,
    })),
  );
  const [nextRowStart, setNextRowStart] = useState(11);

  const handleShowMore = () => {
    const newRows = Array.from({ length: 10 }, (_, i) => ({
      id: nextRowStart + i,
      name: `Student ${nextRowStart + i}`,
      roll: `Roll ${nextRowStart + i}`,
      percentage: `${Math.floor(Math.random() * 101)}%`,
    }));
    setRows((prev) => [...prev, ...newRows]);
    setNextRowStart(nextRowStart + 10);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Top Row Containers */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div
          style={{
            flex: 1,
            backgroundColor: "#d3d3d3",
            padding: "20px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Manage Batches
        </div>
        <div
          style={{
            flex: 1,
            backgroundColor: "#d3d3d3",
            padding: "20px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Manage Classes
        </div>
      </div>

      {/* Dropdowns and Add Day Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <select style={{ padding: "8px" }}>
            <option>Select Option 1</option>
          </select>
          <select style={{ padding: "8px" }}>
            <option>Select Option 2</option>
          </select>
        </div>
        <button
          style={{
            backgroundColor: "#007BFF",
            color: "white",
            padding: "10px 20px",
          }}
        >
          Add Day
        </button>
      </div>

      {/* Filters Row */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        <select style={{ padding: "8px" }}>
          <option>Filter 1</option>
        </select>
        <select style={{ padding: "8px" }}>
          <option>Filter 2</option>
        </select>
        <input
          type="text"
          placeholder="Search..."
          style={{ padding: "8px", flex: 1 }}
        />
        <button
          style={{
            backgroundColor: "#28A745",
            color: "white",
            padding: "10px 20px",
          }}
        >
          Add Student
        </button>
      </div>

      {/* Rows of Data */}
      <div style={{ border: "1px solid #ccc", borderRadius: "5px" }}>
        {rows.map((row) => (
          <div
            key={row.id}
            style={{
              padding: "10px",
              borderBottom: "1px solid #ddd",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{row.name}</span>
            <span>{row.roll}</span>
            <span>{row.percentage}</span>
            <button
              style={{
                backgroundColor: "#007BFF",
                color: "white",
                padding: "5px 10px",
              }}
            >
              Show More
            </button>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={handleShowMore}
          style={{
            backgroundColor: "#6C757D",
            color: "white",
            padding: "10px 20px",
          }}
        >
          Show More
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
