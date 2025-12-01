import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../shared/sidebar";
import axiosInstance from "../../api/axiosConfig";
import { ArrowLeft } from "lucide-react";

const EditPartnership = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get(`/partners/${id}/`)
      .then((res) => setForm(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axiosInstance
      .put(`/partners/${id}/`, form)
      .then(() => navigate("/partnerships"))
      .catch((err) => console.log(err));
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
              <ArrowLeft size={16} />
              Back
            </button>
          </div>

          {/* ===================== PARTNER ORGS ===================== */}
          <h2 className="section-title">Partner Organizations</h2>

          <div className="form-grid">
            <input
              name="company1"
              value={form.company1 || ""}
              onChange={handleChange}
              placeholder="Company / Department 1"
              required
            />
            <input
              name="company2"
              value={form.company2 || ""}
              onChange={handleChange}
              placeholder="Company / Department 2 (Optional)"
            />
          </div>

          {/* ===================== COURSES INVOLVED ===================== */}
          <h2 className="section-title">Courses Involved (Optional)</h2>

          <div className="form-grid">
            <input
              name="college1"
              value={form.college1 || ""}
              onChange={handleChange}
              placeholder="Course / Program 1"
            />
            <input
              name="college2"
              value={form.college2 || ""}
              onChange={handleChange}
              placeholder="Course / Program 2 (Optional)"
            />
          </div>

          {/* ===================== CONTACT 1 ===================== */}
          <h2 className="section-title">Contact Person 1</h2>
          <div className="form-grid">
            <input
              name="contact1_name"
              value={form.contact1_name || ""}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />
            <input
              name="contact1_email"
              value={form.contact1_email || ""}
              onChange={handleChange}
              placeholder="Email Address"
              required
            />
            <input
              name="contact1_phone"
              value={form.contact1_phone || ""}
              onChange={handleChange}
              placeholder="Phone Number"
              required
            />
          </div>

          {/* ===================== CONTACT 2 ===================== */}
          <h2 className="section-title">Contact Person 2 (Optional)</h2>
          <div className="form-grid">
            <input
              name="contact2_name"
              value={form.contact2_name || ""}
              onChange={handleChange}
              placeholder="Full Name"
            />
            <input
              name="contact2_email"
              value={form.contact2_email || ""}
              onChange={handleChange}
              placeholder="Email Address"
            />
            <input
              name="contact2_phone"
              value={form.contact2_phone || ""}
              onChange={handleChange}
              placeholder="Phone Number"
            />
          </div>

          {/* ===================== DATES ===================== */}
          <h2 className="section-title">Effectivity Dates</h2>
          <div className="date-row">
            <div className="date-block">
              <p className="date-label">Start Date</p>
              <input
                type="date"
                name="effectivity_start"
                value={form.effectivity_start || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="date-block">
              <p className="date-label">End Date</p>
              <input
                type="date"
                name="effectivity_end"
                value={form.effectivity_end || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* ===================== STATUS ===================== */}
          <h2 className="section-title">Status</h2>
          <select name="status" value={form.status || "pending"} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>

          {/* ===================== SAVE ===================== */}
          <button type="submit" className="btn-save">
            Update Partnership
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPartnership;
