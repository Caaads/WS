import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../shared/sidebar";
import Navbar from "../shared/navbar";
import axiosInstance from "../../api/axiosConfig";
import "./collegepage.css";

import ccjeImg from "../../assets/CCJE.jpg";
import cetImg from "../../assets/CET.jpg";
import chatmeImg from "../../assets/CHATME.jpg";
import husocomImg from "../../assets/HUSOCOM.jpg";
import sbmeImg from "../../assets/SBME.jpg";
import defaultImg from "../../assets/hcdc_logo.png";

export default function CollegePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [partnerships, setPartnerships] = useState([]);
  const [allPartnerships, setAllPartnerships] = useState([]);



  const collegeImages = {
    "College of Criminal Justice Education": ccjeImg,
    "CCJE": ccjeImg,
    "College of Engineering and Technology": cetImg,
    "CET": cetImg,
    "College of Hospitality, Tourism & Management Education": chatmeImg,
    "CHATME": chatmeImg,
    "Humanities & Social Sciences": husocomImg,
    "HUSOCOM": husocomImg,
    "School of Business & Management Education": sbmeImg,
    "SBME": sbmeImg,
  };

useEffect(() => {
  setLoading(true);

  // Fetch college info
  axiosInstance.get(`/college/${id}/`)
    .then(res => {
      setCollege(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.log(err);
      setError("Failed to load college data.");
      setLoading(false);
    });

  // Fetch all partnerships
  axiosInstance.get(`/partners/`)
    .then(res => {
      setAllPartnerships(res.data);
      // Filter by current college
      const filtered = res.data.filter(p => p.college.id === Number(id));
      setPartnerships(filtered);
    })
    .catch(err => console.log(err));
}, [id]);


  if (loading) return <p className="loading-text">Loading college data...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!college) return <p className="error-text">College not found.</p>;

  const imgSrc = collegeImages[college.name] || defaultImg;

  return (
    <div className="page-container">
      <Navbar />
      <Sidebar />

      <div className="content">

        {/* HERO HEADER */}
        <div className="college-header" style={{ backgroundImage: `url(${imgSrc})` }}>
          <div className="overlay">
            <h1 className="header-title">{college.name}</h1>
            <div className="college-stats">
              <span>Departments: {college.departments?.length || 0}</span>
            </div>
          </div>
        </div>

        <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>

        {/* DEPARTMENTS */}
        <div className="details-section">
          <h2>Courses Offered</h2>
          {college.departments?.length ? (
            <div className="departments-grid">
              {college.departments.map((dept) => (
                <div key={dept.id} className="department-card">
                  <h3>{dept.name}</h3>
                  <p>{dept.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No departments available.</p>
          )}
        </div>
        {/* COMPANIES TABLE */}
<div className="details-section">
  <h2>Partnerships</h2>
  {partnerships.length ? (
    <table className="companies-table">
      <thead>
        <tr>
          <th>Company</th>
          <th>Department</th>
          <th>Effectivity</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {partnerships.map((p) => (
          <tr key={p.id}>
            <td>{p.company}</td>
            <td>{p.department?.name || "N/A"}</td>
            <td>
              {p.effectivity_start} → {p.effectivity_end}
            </td>
            <td>{p.status}</td>
            <td>
              <button onClick={() => navigate(`/partnership/${p.id}`)}>
                View
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No partnerships available.</p>
  )}
</div>



        {/* OPTIONAL: College Description / Programs */}
        {college.description && (
          <div className="details-section">
            <h2>About the College</h2>
            <p>{college.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
