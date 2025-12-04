import { useState} from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../shared/sidebar";
import axiosInstance from "../../api/axiosConfig";
import { ArrowLeft } from "lucide-react";
import "./add_partnership.css";

const AddPartnership = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    company: "",
    effectivity_start: "",
    effectivity_end: "",
    status: "pending",
    contacts: [
      { fullname: "", position: "", email: "", phone: "" }, // Contact 1
      { fullname: "", position: "", email: "", phone: "" }, // Contact 2 (optional)
    ],
  });

  const [errors, setErrors] = useState([
    { email: false, phone: false }, // Contact 1
    { email: false, phone: false }, // Contact 2
  ]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleContactChange = (index, e) => {
    const { name, value } = e.target;
    const updatedContacts = [...form.contacts];
    const updatedErrors = [...errors];

    if (name === "phone") {
      // Only digits allowed
      if (/^\d*$/.test(value)) {
        updatedContacts[index][name] = value;
        updatedErrors[index][name] = false;
      } else {
        updatedErrors[index][name] = true;
      }
    } else if (name === "email") {
      updatedContacts[index][name] = value;
      updatedErrors[index][name] = !value.includes("@");
    } else {
      updatedContacts[index][name] = value;
    }

    setForm({ ...form, contacts: updatedContacts });
    setErrors(updatedErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Remove empty contact 2 if not filled
    const contactsToSend = form.contacts.filter(
      (c) => c.fullname || c.email || c.phone
    );

    // Final validation before submit
    for (let i = 0; i < contactsToSend.length; i++) {
      const c = contactsToSend[i];
      if (errors[i].email) {
        alert(`Invalid email for ${c.fullname || "Contact " + (i + 1)}`);
        return;
      }
      if (errors[i].phone) {
        alert(`Phone must contain only digits for ${c.fullname || "Contact " + (i + 1)}`);
        return;
      }
      if (i === 0 && (!c.email || !c.phone)) {
        alert("Contact 1 must have email and phone filled");
        return;
      }
    }

    axiosInstance
      .post("/partners/", { ...form, contacts: contactsToSend })
      .then(() => navigate("/partnerships"))
      .catch(console.log);
  };

  return (
    <div className="page-container">
      <Sidebar />
      <div className="content">
        <h1>Create New Partnership</h1>

        <form className="form-card" onSubmit={handleSubmit}>
          <div className="top-row">
            <button className="btn-back" type="button" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} /> Back
            </button>
          </div>

          {/* Partner */}
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
              <input
                type="date"
                name="effectivity_start"
                value={form.effectivity_start}
                onChange={handleChange}
                required
              />
            </div>
            <div className="date-block">
              <p className="date-label">End Date</p>
              <input
                type="date"
                name="effectivity_end"
                value={form.effectivity_end}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <h2 className="section-title">Status</h2>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>

          {/* Contacts */}
          {form.contacts.map((contact, index) => (
            <div key={index}>
              <h2 className="section-title">
                Contact Person {index + 1} {index === 1 && "(Optional)"}
              </h2>
              <div className="form-grid">
                <div className="input-group">
                  <input
                    name="fullname"
                    value={contact.fullname}
                    onChange={(e) => handleContactChange(index, e)}
                    placeholder="Full Name"
                    required={index === 0}
                  />
                </div>

                <div className="input-group">
                  <input
                    name="position"
                    value={contact.position}
                    onChange={(e) => handleContactChange(index, e)}
                    placeholder="Position (Optional)"
                  />
                </div>

                <div className="input-group">
                  <input
                    name="email"
                    value={contact.email}
                    onChange={(e) => handleContactChange(index, e)}
                    placeholder="Email"
                    required={index === 0}
                    style={{
                      borderColor: errors[index].email ? "red" : "#ccc",
                    }}
                  />
                  {errors[index].email && (
                    <span className="error-tooltip">Invalid email (must contain "@")</span>
                  )}
                </div>

                <div className="input-group">
                  <input
                    name="phone"
                    value={contact.phone}
                    onChange={(e) => handleContactChange(index, e)}
                    placeholder="Phone"
                    required={index === 0}
                    style={{
                      borderColor: errors[index].phone ? "red" : "#ccc",
                    }}
                  />
                  {errors[index].phone && (
                    <span className="error-tooltip">Phone must contain only digits</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button type="submit" className="btn-save">Save Partnership</button>
        </form>
      </div>
    </div>
  );
};

export default AddPartnership;
