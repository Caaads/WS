import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../shared/sidebar";
import Navbar from "../shared/navbar";
import axiosInstance from "../../api/axiosConfig";
import "./collegepage.css";

export default function CollegePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [college, setCollege] = useState(null);

  useEffect(() => {
    axiosInstance
      .get(`/college/${id}/`) // backend endpoint — update to your actual endpoint
      .then((res) => setCollege(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  if (!college) return <p>Loading college data...</p>;

  return (
    <div className="page-container">
      <Navbar />
      <Sidebar />

      <div className="content">
        <button className="btn-back" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h1>{college.name}</h1>
        <p><strong>Acronym:</strong> {college.acronym}</p>
        <p><strong>Dean:</strong> {college.dean || "Not specified"}</p>
        <p><strong>Departments:</strong></p>

        {college.departments?.length ? (
          <ul>
            {college.departments.map((dept) => (
              <li key={dept.id}>{dept.name}</li>
            ))}
          </ul>
        ) : (
          <p>No departments available.</p>
        )}
      </div>
    </div>
  );
}
