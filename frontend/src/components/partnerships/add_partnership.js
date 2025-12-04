import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../shared/sidebar";
import axiosInstance from "../../api/axiosConfig";
import { ArrowLeft } from "lucide-react";
import "./add_partnership.css";

const AddPartnership = () => {
  const navigate = useNavigate();

  const [colleges, setColleges] = useState([]);
  const [departments1, setDepartments1] = useState([]);
  const [departments2, setDepartments2] = useState([]);

  const [form, setForm] = useState({
    company1: "",
    company2: "",
    college1: "",
    college2: "",
    department1: "",
    department2: "",
    contact1_name: "",
    contact1_email: "",
    contact1_phone: "",
    contact2_name: "",
    contact2_email: "",
    contact2_phone: "",
    effectivity_start: "",
    effectivity_end: "",
    status: "pending",
  });

  /* ---------------------------------------------
     FETCH ALL COLLEGES ON PAGE LOAD
  --------------------------------------------- */
  useEffect(() => {
    axiosInstance
      .get("/all_colleges_api/")
      .then((res) => setColleges(res.data))
      .catch(console.log);
  }, []);

  /* ---------------------------------------------
     HANDLE CHANGE (GENERIC)
  --------------------------------------------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ---------------------------------------------
     WHEN COLLEGE 1 CHANGES → LOAD DEPARTMENTS UNDER IT
  --------------------------------------------- */
  const handleCollege1Change = (e) => {
    const collegeId = e.target.value;

    setForm({ ...form, college1: collegeId, department1: "" });

    if (!collegeId) return setDepartments1([]);

    axiosInstance
      .get(`/departments_by_college/${collegeId}/`)
      .then((res) => setDepartments1(res.data))
      .catch(console.log);
  };

  /* ---------------------------------------------
     WHEN COLLEGE 2 CHANGES → LOAD DEPARTMENTS UNDER IT
  --------------------------------------------- */
  const handleCollege2Change = (e) => {
    const collegeId = e.target.value;

    setForm({ ...form, college2: collegeId, department2: "" });

    if (!collegeId) return setDepartments2([]);

    axiosInstance
      .get(`/departments_by_college/${collegeId}/`)
      .then((res) => setDepartments2(res.data))
      .catch(console.log);
  };

  /* ---------------------------------------------
     SUBMIT
  --------------------------------------------- */
  const handleSubmit = (e) => {
    e.preventDefault();

    axiosInstance
      .post("/partners/", form)
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
              <ArrowLeft size={16} />
              Back
            </button>
          </div>

          {/* ===================== PARTNER ORGS ===================== */}
          <h2 className="section-title">Partner Organizations</h2>

          <div className="form-grid">
            <input
              name="company1"
              value={form.company1}
              onChange={handleChange}
              placeholder="Company / College 1"
              required
            />

            <input
              name="company2"
              value={form.company2}
              onChange={handleChange}
              placeholder="Company / College 2 (Optional)"
            />
          </div>

          {/* ===================== COLLEGES & COURSES ===================== */}
          <h2 className="section-title">Courses / Departments Involved</h2>

          <div className="form-grid">
            {/* COLLEGE 1 */}
            <select
              name="college1"
              value={form.college1}
              onChange={handleCollege1Change}
              required
            >
              <option value="">Select College 1</option>
              {colleges.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* COLLEGE 2 */}
            <select
              name="college2"
              value={form.college2}
              onChange={handleCollege2Change}
            >
              <option value="">Select College 2 (Optional)</option>
              {colleges.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-grid">
            {/* DEPARTMENT 1 */}
            <select
              name="department1"
              value={form.department1}
              onChange={handleChange}
              required
            >
              <option value="">Select Department 1</option>
              {departments1.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>

            {/* DEPARTMENT 2 */}
            <select
              name="department2"
              value={form.department2}
              onChange={handleChange}
            >
              <option value="">Select Department 2 (Optional)</option>
              {departments2.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* ===================== CONTACT PERSON 1 ===================== */}
          <h2 className="section-title">Contact Person 1</h2>

          <div className="form-grid">
            <input
              name="contact1_name"
              value={form.contact1_name}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />
            <input
              name="contact1_email"
              value={form.contact1_email}
              onChange={handleChange}
              placeholder="Email Address"
              required
            />
            <input
              name="contact1_phone"
              value={form.contact1_phone}
              onChange={handleChange}
              placeholder="Phone Number"
              required
            />
          </div>

          {/* ===================== CONTACT PERSON 2 ===================== */}
          <h2 className="section-title">Contact Person 2 (Optional)</h2>

          <div className="form-grid">
            <input
              name="contact2_name"
              value={form.contact2_name}
              onChange={handleChange}
              placeholder="Full Name"
            />
            <input
              name="contact2_email"
              value={form.contact2_email}
              onChange={handleChange}
              placeholder="Email Address"
            />
            <input
              name="contact2_phone"
              value={form.contact2_phone}
              onChange={handleChange}
              placeholder="Phone Number"
            />
          </div>

          {/* ===================== EFFECTIVITY DATES ===================== */}
          <h2 className="section-title">Effectivity Dates</h2>

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

          {/* ===================== STATUS ===================== */}
          <h2 className="section-title">Status</h2>

          <select name="status" value={form.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>

          {/* ===================== SUBMIT ===================== */}
          <button type="submit" className="btn-save">
            Save Partnership
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPartnership;
