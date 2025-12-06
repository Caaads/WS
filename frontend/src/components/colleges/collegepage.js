import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../shared/sidebar";
import Navbar from "../shared/navbar";
import axiosInstance from "../../api/axiosConfig";
import { formatDatePretty } from "../shared/datepretty";
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
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Get user info
  const user = JSON.parse(localStorage.getItem("user")); // { id, username, role, college }

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

    axiosInstance.get(`/partners/?college_id=${id}`)
      .then(res => setPartnerships(res.data))
      .catch(err => console.log(err));
  }, [id]);

  const handleDelete = (partnerId) => {
    if (!window.confirm("Are you sure you want to delete this partnership?")) return;
    axiosInstance.delete(`/partners/${partnerId}/`)
      .then(() => setPartnerships(prev => prev.filter(p => p.id !== partnerId)))
      .catch(console.log);
  };

  const openModal = (partner) => {
    setSelectedPartner(partner);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedPartner(null);
    setShowModal(false);
  };

  if (loading) return <p className="loading-text">Loading college data...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!college) return <p className="error-text">College not found.</p>;

  const imgSrc = collegeImages[college.name] || defaultImg;

  // College-specific CRUD permission
  const canEdit =
    user?.role === "superadmin" || // superadmin can edit all colleges
    (user?.role === "college_admin" && user?.college === college.name); // college admin can edit only their college

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

        {/* PARTNERSHIPS TABLE */}
        <div className="details-section">
          <h2>Partnerships</h2>

          {/* ADD PARTNERSHIP BUTTON */}
          {canEdit && (
            <div className="btn-container" style={{ marginBottom: "15px" }}>
              <a href={`/add-partnership?college_id=${college.id}`} className="btn-add">
                + Add Partnership
              </a>
            </div>
          )}

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
                {partnerships.map(p => (
                  <tr key={p.id}>
                    <td>{p.company}</td>
                    <td>{p.department?.name || "N/A"}</td>
                    <td>{p.effectivity_start} → {p.effectivity_end}</td>
                    <td>{p.status}</td>
                    <td>
                      <button className="action-btn view-btn" onClick={() => openModal(p)}>View</button>
                      {canEdit && (
                        <>
                          <a href={`/edit-partnership/${p.id}?from=collegepage&id=${college.id}`} className="action-btn edit-btn">
                            Edit
                          </a>
                          <button onClick={() => handleDelete(p.id)} className="action-btn delete-btn">Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No partnerships available.</p>
          )}
        </div>

        {/* PARTNERSHIP MODAL */}
        {showModal && selectedPartner && (
          <div className="modal-backdrop" onClick={closeModal}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <h2 className="modal-title">{selectedPartner.company}</h2>

              <div className="modal-section">
                <p><strong>Contacts:</strong></p>
                {selectedPartner.contacts?.length > 0 ? (
                  selectedPartner.contacts.map((c, idx) => (
                    <p key={idx}>
                      {c.fullname} {c.position ? `(${c.position})` : ""} | {c.email} | {c.phone}
                    </p>
                  ))
                ) : (
                  <p>N/A</p>
                )}
              </div>

              <div className="modal-section">
                <p><strong>College:</strong> {selectedPartner.college?.name || "N/A"}</p>
                <p><strong>Department:</strong> {selectedPartner.department?.name || "N/A"}</p>
                <p><strong>Effectivity:</strong> {formatDatePretty(selectedPartner.effectivity_start)} → {formatDatePretty(selectedPartner.effectivity_end)}</p>
                <p><strong>Status:</strong> <span className={`status ${selectedPartner.status.toLowerCase()}`}>{selectedPartner.status}</span></p>
              </div>

              <button className="btn-close" onClick={closeModal}>Close</button>
            </div>
          </div>
        )}

        {/* College Description */}
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
