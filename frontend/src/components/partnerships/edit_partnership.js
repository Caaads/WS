import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../shared/sidebar";
import axiosInstance from "../../api/axiosConfig";
import { ArrowLeft } from "lucide-react";
import "./add_partnership.css";

const EditPartnership = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);

  useEffect(() => {
    axiosInstance.get(`/partners/${id}/`)
      .then((res) => {
        // Ensure contacts array exists
        const partnerData = res.data;
        if (!partnerData.contacts || partnerData.contacts.length < 2) {
          partnerData.contacts = [
            partnerData.contacts[0] || { fullname: "", position: "", email: "", phone: "" },
            partnerData.contacts[1] || { fullname: "", position: "", email: "", phone: "" },
          ];
        }
        setForm(partnerData);
      })
      .catch(console.log);
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleContactChange = (index, e) => {
    const updatedContacts = [...form.contacts];
    updatedContacts[index][e.target.name] = e.target.value;
    setForm({ ...form, contacts: updatedContacts });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const contactsToSend = form.contacts.filter(c => c.fullname || c.email || c.phone);

    axiosInstance.put(`/partners/${id}/`, { ...form, contacts: contactsToSend })
      .then(() => navigate("/partnerships"))
      .catch(console.log);
  };

  if (!form) return <p>Loading...</p>;

  return (
    <div className="page-container">
      <Sidebar />
      <div className="content">
        <h1>Edit Partnership</h1>

        <form className="form-card" onSubmit={handleSubmit}>
          <div className="top-row">
            <button className="btn-back" type="button" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} /> Back
            </button>
          </div>

          <h2 className="section-title">Partner</h2>
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Company Name"
            required
          />

          <div className="date-row">
            <div className="date-block">
              <p className="date-label">Start Date</p>
              <input type="date" name="effectivity_start" value={form.effectivity_start} onChange={handleChange} required />
            </div>
            <div className="date-block">
              <p className="date-label">End Date</p>
              <input type="date" name="effectivity_end" value={form.effectivity_end} onChange={handleChange} required />
            </div>
          </div>

          <h2 className="section-title">Status</h2>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>

          {/* Render contacts dynamically */}
          {form.contacts.map((contact, index) => (
            <div key={index}>
              <h2 className="section-title">Contact Person {index + 1} {index === 1 && "(Optional)"}</h2>
              <div className="form-grid">
                <input
                  name="fullname"
                  value={contact.fullname}
                  onChange={(e) => handleContactChange(index, e)}
                  placeholder="Full Name"
                  required={index === 0}
                />
                <input
                  name="position"
                  value={contact.position}
                  onChange={(e) => handleContactChange(index, e)}
                  placeholder="Position (Optional)"
                />
                <input
                  name="email"
                  value={contact.email}
                  onChange={(e) => handleContactChange(index, e)}
                  placeholder="Email"
                  required={index === 0}
                />
                <input
                  name="phone"
                  value={contact.phone}
                  onChange={(e) => handleContactChange(index, e)}
                  placeholder="Phone"
                  required={index === 0}
                />
              </div>
            </div>
          ))}

          <button type="submit" className="btn-save">Update Partnership</button>
        </form>
      </div>
    </div>
  );
};

export default EditPartnership;
