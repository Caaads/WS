import { useEffect, useState } from "react";
import Sidebar from "../shared/sidebar";
import Navbar from "../shared/navbar";
import axiosInstance from "../../api/axiosConfig";
import "./contact.css";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/contacts/")
      .then((res) => setContacts(res.data))
      .catch((err) => console.log(err));
  }, []);

return (
  <div className="page-container">
    <Navbar />
    <Sidebar />

    <div className="content">
      {/* Add top margin to avoid overlap with navbar */}
      <div className="page-header header-row">
        <h1>Contacts</h1>
        <a href="/add-contact" className="btn-add">
          + Add Contact
        </a>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Partner</th>
              <th>Name</th>
              <th>Position</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>

          <tbody>
            {contacts.length > 0 ? (
              contacts.map((item) => (
                <tr key={item.id}>
                  <td>{item.partner_name || item.partner}</td>
                  <td>{item.name}</td>
                  <td>{item.position}</td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  No contacts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

};

export default Contacts;
