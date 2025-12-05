import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../shared/sidebar";
import axiosInstance from "../../api/axiosConfig";
import { ArrowLeft } from "lucide-react";
import "./add_partnership.css";

const EditPartnership = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [form, setForm] = useState({
    company: "",
    effectivity_start: "",
    effectivity_end: "",
    status: "pending",
    college_id: "",
    department_id: "",
    contacts: [
      { fullname: "", position: "", email: "", phone: "" },
      { fullname: "", position: "", email: "", phone: "" },
    ],
  });

  const [errors, setErrors] = useState([
    { email: false, phone: false },
    { email: false, phone: false },
  ]);

  // Fetch colleges
  useEffect(() => {
    axiosInstance.get("/all_colleges_api/")
      .then((res) => setColleges(res.data))
      .catch(console.error);
  }, []);

  // Fetch partnership data
useEffect(() => {
  axiosInstance.get(`/partners/${id}/`)
    .then((res) => {
      const data = res.data;

      // Always ensure 2 contacts exist
      const contacts = [0, 1].map(i => data.contacts[i] || { fullname: "", position: "", email: "", phone: "" });

      setForm({
        company: data.company || "",
        effectivity_start: data.effectivity_start || "",
        effectivity_end: data.effectivity_end || "",
        status: data.status || "pending",
        college_id: data.college?.id || "",
        department_id: data.department?.id || "",
        contacts,
      });
    })
    .catch(console.error);
}, [id]);

  // Fetch departments whenever college changes
  useEffect(() => {
    if (form.college_id) {
      axiosInstance.get(`/departments_by_college/${form.college_id}/`)
        .then((res) => setDepartments(res.data))
        .catch(console.error);
    } else {
      setDepartments([]);
      setForm((prev) => ({ ...prev, department_id: "" }));
    }
  }, [form.college_id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleContactChange = (index, e) => {
    const { name, value } = e.target;
    const updatedContacts = [...form.contacts];
    const updatedErrors = [...errors];

    if (name === "phone") {
      if (/^\d*$/.test(value)) updatedErrors[index][name] = false;
      else updatedErrors[index][name] = true;
    }
    if (name === "email") updatedErrors[index][name] = !value.includes("@");

    updatedContacts[index][name] = value;
    setForm({ ...form, contacts: updatedContacts });
    setErrors(updatedErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.college_id) return alert("Please select a college.");
    if (!form.department_id) return alert("Please select a department.");

    const contactsToSend = form.contacts.filter(c => c.fullname || c.email || c.phone);

    for (let i = 0; i < contactsToSend.length; i++) {
      const c = contactsToSend[i];
      if (errors[i].email) return alert(`Invalid email for ${c.fullname || "Contact " + (i + 1)}`);
      if (errors[i].phone) return alert(`Phone must contain only digits for ${c.fullname || "Contact " + (i + 1)}`);
      if (i === 0 && (!c.email || !c.phone)) return alert("Contact 1 must have email and phone filled");
    }

    axiosInstance.patch(`/partners/${id}/`, { ...form, contacts: contactsToSend })
      .then(() => navigate("/partnerships"))
      .catch(console.log);
  };

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
          <input name="company" value={form.company} onChange={handleChange} placeholder="Company Name" required />

          <h2 className="section-title">College</h2>
          <select name="college_id" value={form.college_id} onChange={handleChange} required>
            <option value="">Select College</option>
            {colleges.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          {departments.length > 0 && (
            <>
              <h2 className="section-title">Department</h2>
              <select name="department_id" value={form.department_id} onChange={handleChange} required>
                <option value="">Select Department</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </>
          )}

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

          {form.contacts.map((contact, index) => (
            <div key={index}>
              <h2 className="section-title">
                Contact Person {index + 1} {index === 1 && "(Optional)"}
              </h2>
              <div className="form-grid">
                <input name="fullname" value={contact.fullname} onChange={(e) => handleContactChange(index, e)} placeholder="Full Name" required={index === 0} />
                <input name="position" value={contact.position} onChange={(e) => handleContactChange(index, e)} placeholder="Position (Optional)" />
                <input name="email" value={contact.email} onChange={(e) => handleContactChange(index, e)} placeholder="Email" required={index === 0} />
                <input name="phone" value={contact.phone} onChange={(e) => handleContactChange(index, e)} placeholder="Phone" required={index === 0} />
              </div>
            </div>
          ))}

          <button type="submit" className="btn-save">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default EditPartnership;
