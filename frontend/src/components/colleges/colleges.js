import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../shared/sidebar";
import Navbar from "../shared/navbar";
import axiosInstance from "../../api/axiosConfig";
import "./colleges.css";

// Import images
import ccjeImg from "../../assets/CCJE.jpg";
import cetImg from "../../assets/CET.jpg";
import chatmeImg from "../../assets/CHATME.jpg";
import husocomImg from "../../assets/HUSOCOM.jpg";
import sbmeImg from "../../assets/SBME.jpg";
import defaultImg from "../../assets/hcdc_logo.png"; // optional fallback

const Colleges = () => {
  const [colleges, setColleges] = useState([]);
    const navigate = useNavigate();

  // Map college names → images
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
      .get("/all_colleges_api/")
      .then((res) => setColleges(res.data))
      .catch((err) => console.log(err));
  }, []);

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
            colleges.slice(0, 7).map((college) => {
              const imgSrc =
                collegeImages[college.name] || defaultImg;
              
              return (
              <div
  className="college-card"
  key={college.id}
  onClick={() => navigate(`/colleges/${college.id}`)}
  >
  <img src={imgSrc} alt={college.name} className="college-logo" />
  <h3 className="college-title">{college.name}</h3>
</div>

              );
            })
          ) : (
            <p>No colleges found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Colleges;
