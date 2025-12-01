import React, { useEffect, useState } from "react";
import Sidebar from "../shared/sidebar";
import Table from "../shared/table";
import axiosInstance from "../../api/axiosConfig";
import "./colleges.css";

const Colleges = () => {
  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/all_colleges_api/")
      .then((res) => setColleges(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this college?")) return;
    // Add API call here if needed
    setColleges((prev) => prev.filter((c) => c.id !== id));
  };

  const columns = [
    { header: "College", accessor: "college" },
    { header: "Partner Companies", accessor: "partners" },
    {
      header: "Actions",
      accessor: "actions",
      render: (row) => (
        <div className="actions">
          <a href={`/view-college/${row.id}`} className="view-btn">
            View
          </a>
          <a href={`/edit-college/${row.id}`} className="edit-btn">
            Edit
          </a>
          <button
            onClick={() => handleDelete(row.id)}
            className="delete-btn"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-container">
      <Sidebar />
      <div className="content">
        <h1>Colleges</h1>
        <Table data={colleges} columns={columns} />
      </div>
    </div>
  );
};

export default Colleges;
