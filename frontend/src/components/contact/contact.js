import { useEffect, useState } from "react";
import Sidebar from "../shared/sidebar";
import Navbar from "../shared/navbar";
import axiosInstance from "../../api/axiosConfig";
import "./contact.css";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axiosInstance
      .get("/contacts/")
      .then((res) => setContacts(res.data))
      .catch((err) => console.log(err));
  }, []);

  const openModal = (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedContact(null);
    setShowModal(false);
  };

  return (
    <div className="page-container">
      <Navbar />
      <Sidebar />
      <div className="content">
        <div className="page-header header-row">
          <h1>Contacts</h1>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Name</th>
                <th>Position</th>
                <th>Actions</th> {/* Only actions column now */}
              </tr>
            </thead>
            <tbody>
              {contacts.length > 0 ? (
                contacts.map((item) => (
                  <tr key={item.id}>
                    <td>{item.partner_name}</td>
                    <td>{item.fullname}</td>
                    <td>{item.position || "N/A"}</td>
                    <td>
                      <button
                        className="action-btn view-btn"
                        onClick={() => openModal(item)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-data">
                    No contacts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && selectedContact && (
          <div className="modal-backdrop" onClick={closeModal}>
            <div
              className="modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>{selectedContact.fullname}</h2>
              <p><strong>Company:</strong> {selectedContact.partner_name}</p>
              <p><strong>Position:</strong> {selectedContact.position || "N/A"}</p>
              <p><strong>Email:</strong> {selectedContact.email}</p>
              <p><strong>Phone:</strong> {selectedContact.phone}</p>

              <button className="btn-close" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contacts;
