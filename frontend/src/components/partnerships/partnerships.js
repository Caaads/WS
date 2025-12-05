import React, { useEffect, useState } from "react";
import Sidebar from "../shared/sidebar";
import Table from "../shared/table";
import axiosInstance from "../../api/axiosConfig";
import { formatDatePretty } from "../shared/datepretty";
import "./partnerships.css";
import Navbar from "../shared/navbar";

const Partnerships = () => {
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axiosInstance.get("/partners/")
      .then((res) => setPartners(res.data))
      .catch(console.log);
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this partner?")) return;
    axiosInstance.delete(`/partners/${id}/`)
      .then(() => setPartners((prev) => prev.filter((p) => p.id !== id)))
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

const columns = [
  { header: "Company", accessor: "company" },

  {
    header: "College",
    accessor: "college",
    render: (row) => row.college?.name || "N/A",
  },

  {
    header: "Department",
    accessor: "department",
    render: (row) => row.department?.name || "N/A",
  },

  {
    header: "Status",
    accessor: "status",
    render: (row) => <span className={`status ${row.status.toLowerCase()}`}>{row.status}</span>,
  },

  {
    header: "Actions",
    accessor: "actions",
    render: (row) => (
      <div className="actions">
        <button className="action-btn view-btn" onClick={() => openModal(row)}>View</button>
        <a href={`/edit-partnership/${row.id}`} className="action-btn edit-btn">Edit</a>
        <button onClick={() => handleDelete(row.id)} className="action-btn delete-btn">Delete</button>
      </div>
    ),
  },
];


  return (
    <div className="page-container">
      <Navbar />
      <Sidebar />
      <div className="content">
        <div className="page-header">
          <h1>Partnerships</h1>
        </div>

        <div className="btn-container">
          <a href="/add-partnership" className="btn-add">+ Add Partnership</a>
        </div>

        <Table data={partners} columns={columns} />

        {showModal && selectedPartner && (
          <div className="modal-backdrop" onClick={closeModal}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
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
      </div>
    </div>
  );
};

export default Partnerships;
