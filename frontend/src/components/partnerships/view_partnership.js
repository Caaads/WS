import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../shared/sidebar";
import axiosInstance from "../../api/axiosConfig";
import { ArrowLeft } from "lucide-react";
import { formatDatePretty } from "../shared/datepretty";
import "./add_partnership.css";

const ViewPartnership = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [partner, setPartner] = useState(null);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    // Fetch partner info
    axiosInstance.get(`/partners/${id}/`)
      .then((res) => setPartner(res.data))
      .catch(console.log);

    // Fetch contacts dynamically
    axiosInstance.get(`/contacts/${id}/`)
      .then((res) => setContacts(res.data))
      .catch(console.log);
  }, [id]);

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this partnership?")) return;
    axiosInstance.delete(`/partners/${id}/`)
      .then(() => navigate("/partnerships"))
      .catch(console.log);
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

        <h2 className="section-title">Contacts</h2>
        {contacts.length > 0 ? (
          contacts.map((c) => (
            <div key={c.id} className="form-grid">
              <p><strong>Name:</strong> {c.fullname}</p>
              <p><strong>Position:</strong> {c.position || "N/A"}</p>
              <p><strong>Email:</strong> {c.email}</p>
              <p><strong>Phone:</strong> {c.phone}</p>
            </div>
          ))
        ) : (
          <p>No contacts found.</p>
        )}

        <h2 className="section-title">Effectivity Dates</h2>
        <div className="date-row">
          <div className="date-block">
            <p><strong>Start Date:</strong> {formatDatePretty(partner.effectivity_start)}</p>
          </div>
          <div className="date-block">
            <p><strong>End Date:</strong> {formatDatePretty(partner.effectivity_end)}</p>
          </div>
        </div>

        <h2 className="section-title">Status</h2>
        <span className={`status ${partner.status?.toLowerCase() || "pending"}`}>
          {partner.status || "Pending"}
        </span>

        <div className="form-actions" style={{ marginTop: "20px" }}>
          <button onClick={() => navigate(`/edit-partnership/${partner.id}`)} className="edit-btn" style={{ marginRight: "10px" }}>
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
