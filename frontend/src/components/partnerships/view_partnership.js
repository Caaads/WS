import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../shared/sidebar";
import axiosInstance from "../../api/axiosConfig";
import { ArrowLeft } from "lucide-react";
import { formatDatePretty } from "../shared/datepretty";
import "./add_partnership.css"; // reuse your form styling

const ViewPartnership = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [partner, setPartner] = useState(null);

  // Fetch partner details
  useEffect(() => {
    axiosInstance
      .get(`/partners/${id}/`)
      .then((res) => setPartner(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  // Delete handler
  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this partnership?")) return;

    axiosInstance
      .delete(`/partners/${id}/`)
      .then(() => navigate("/partnerships"))
      .catch((err) => console.log(err));
  };

  if (!partner) return <p>Loading...</p>;

  return (
    <div className="page-container">
      <Sidebar />
      <div className="content">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </button>
        <h1>Partnership Details</h1>

        {/* Partner Organizations */}
        <h2 className="section-title">Partner Organizations</h2>
        <div className="form-grid">
          <div className="company-block">
            <p><strong>Company / Department 1:</strong> {partner.company1 || "N/A"}</p>
            <p><strong>College / Course 1:</strong> {partner.college1 || "N/A"}</p>
          </div>
          <div className="company-block">
            <p><strong>Company / Department 2:</strong> {partner.company2 || "N/A"}</p>
            <p><strong>College / Course 2:</strong> {partner.college2 || "N/A"}</p>
          </div>
        </div>

        {/* Contact 1 */}
        <h2 className="section-title">Contact Person 1</h2>
        <div className="form-grid">
          <p><strong>Name:</strong> {partner.contact1_name}</p>
          <p><strong>Email:</strong> {partner.contact1_email}</p>
          <p><strong>Phone:</strong> {partner.contact1_phone}</p>
        </div>

        {/* Contact 2 */}
        <h2 className="section-title">Contact Person 2 (Optional)</h2>
        <div className="form-grid">
          <p><strong>Name:</strong> {partner.contact2_name || "N/A"}</p>
          <p><strong>Email:</strong> {partner.contact2_email || "N/A"}</p>
          <p><strong>Phone:</strong> {partner.contact2_phone || "N/A"}</p>
        </div>

        {/* Effectivity Dates */}
        <h2 className="section-title">Effectivity Dates</h2>
        <div className="date-row">
          <div className="date-block">
            <p className="date-label"><strong>Start Date:</strong> {formatDatePretty(partner.effectivity_start)}</p>
          </div>
          <div className="date-block">
            <p className="date-label"><strong>End Date:</strong> {formatDatePretty(partner.effectivity_end)}</p>
          </div>
        </div>

        {/* Status */}
        <h2 className="section-title">Status</h2>
        <span className={`status ${partner.status?.toLowerCase() || "pending"}`}>
          {partner.status || "Pending"}
        </span>

        {/* Actions */}
        <div className="form-actions" style={{ marginTop: "20px" }}>
          <button
            onClick={() => navigate(`/edit-partnership/${partner.id}`)}
            className="edit-btn"
            style={{ marginRight: "10px" }}
          >
            Edit Partnership
          </button>
          <button onClick={handleDelete} className="delete-btn">
            Delete Partnership
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewPartnership;
