import React, { useEffect, useState } from "react";
import Sidebar from "../shared/sidebar";
import Navbar from "../shared/navbar";
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

  
  const columns = [
    { header: "College", accessor: "college" },
    { header: "Partner Companies", accessor: "partners" },
    {
      header: "Actions",
      accessor: "actions",
      render: (row) => (
        <div className="actions">
          <a href={`/view-college/${row.id}`} className="action-btn view-btn">View</a>
          <a href={`/edit-college/${row.id}`} className="action-btn edit-btn">Edit</a>
          <button onClick={() => handleDelete(row.id)} className="action-btn delete-btn">Delete</button>
        </div>
      ),
    },
  ];

  
  const handleDelete = (id) => {
    console.log("Deleting ID:", id);
    

  return (
    <div className="page-container">
      <Navbar />
      <Sidebar />

      <div className="content">
        <div className="page-header">
          <h1>Colleges</h1>
        </div>

        <div className="cards-container">
          {colleges.length ? (
            colleges.slice(0, 8).map((college) => (
              <div className="college-card" key={college.id}>
                <img
                  src="/hcdc_logo.png"
                  alt={college.name || "Logo"}
                  className="college-logo"
                />
                <h3 className="college-title">{college.name || "Title"}</h3>
              </div>
            ))
          ) : (
            <p>No colleges found</p>
          )}
        </div>
      </div>
    </div>
  )
};
}
export default Colleges;
