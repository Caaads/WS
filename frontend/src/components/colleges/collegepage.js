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
    axiosInstance
      .get(`/college/${id}/`)
      .then((res) => setCollege(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  if (!college) return <p>Loading college data...</p>;

  const imgSrc = collegeImages[college.name] || defaultImg;

  return (
    <div className="page-container">
      <Navbar />
      <Sidebar />

      <div className="content">

        {/* HEADER SECTION */}
        <div className="college-header" style={{ backgroundImage: `url(${imgSrc})` }}>
          <div className="overlay">
            <h1 className="header-title">{college.name}</h1>
            <p className="header-sub">{college.acronym}</p>
          </div>
        </div>

        <button className="btn-back" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="details-section">
          <h2>College Information</h2>
          <p><strong>Dean:</strong> {college.dean || "Not specified"}</p>

          <h2>Departments</h2>
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
    </div>
  );
}
