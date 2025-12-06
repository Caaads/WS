import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "../shared/sidebar";
import axiosInstance from "../../api/axiosConfig";
import "./add_partnership.css";
import { ArrowLeft } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddPartnership = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Locked college ID if coming from college page
  const lockedCollegeId = searchParams.get("college_id");

  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

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

  // ==========================
  // FETCH COLLEGES
  // ==========================
  useEffect(() => {
    axiosInstance
      .get("/all_colleges_api/")
      .then((res) => {
        if (lockedCollegeId) {
          const filtered = res.data.filter(
            (c) => c.id === Number(lockedCollegeId)
          );
          setColleges(filtered);

          setForm((prev) => ({
            ...prev,
            college_id: Number(lockedCollegeId),
          }));
        } else {
          setColleges(res.data);
        }
      })
      .catch(() => toast.error("Failed to fetch colleges"))
      .finally(() => setLoading(false));
  }, [lockedCollegeId]);

  // ==========================
  // FETCH DEPARTMENTS
  // ==========================
  useEffect(() => {
    if (!form.college_id) {
      setDepartments([]);
      return;
    }

    axiosInstance
      .get(`/departments_by_college/${form.college_id}/`)
      .then((res) => setDepartments(res.data))
      .catch(() => toast.error("Failed to fetch departments"));
  }, [form.college_id]);

  // ==========================
  // INPUT HANDLERS
  // ==========================
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleContactChange = (index, e) => {
    const { name, value } = e.target;

    const updatedContacts = [...form.contacts];
    const updatedErrors = [...errors];

    if (name === "phone") {
      updatedErrors[index].phone = !/^\d*$/.test(value);
    }
    if (name === "email") {
      updatedErrors[index].email = !value.includes("@");
    }

    updatedContacts[index][name] = value;

    setForm({ ...form, contacts: updatedContacts });
    setErrors(updatedErrors);
  };

  // ==========================
  // SUBMIT FORM
  // ==========================
  const handleSubmit = (e) => {
    e.preventDefault();

    // Hard protection
    if (lockedCollegeId && form.college_id !== Number(lockedCollegeId)) {
      toast.error("You are not allowed to add partnerships to another college.");
      return;
    }

    if (!form.company) return toast.error("Company name is required.");
    if (!form.effectivity_start || !form.effectivity_end)
      return toast.error("Start and end dates are required.");

    // Contacts validation
    const contactsToSend = form.contacts.filter(
      (c) => c.fullname || c.email || c.phone
    );

    const first = contactsToSend[0];
    if (!first.email || !first.phone) {
      return toast.error("First contact must include email & phone.");
    }

    for (let i = 0; i < contactsToSend.length; i++) {
      if (errors[i].email) return toast.error("Invalid email detected.");
      if (errors[i].phone) return toast.error("Phone must contain digits only.");
    }

    setBtnLoading(true);

    axiosInstance
      .post("/partners/", {
        ...form,
        contacts: contactsToSend,
      })
      .then(() => {
        toast.success("Partnership added successfully!");
        setTimeout(() => {
          navigate("/colleges");
        }, 1200);
      })
      .catch(() => toast.error("Failed to save partnership"))
      .finally(() => setBtnLoading(false));
  };

  if (loading) return <p className="loading-text">Loading...</p>;

  return (
    <div className="page-container">
      <Sidebar />
      <ToastContainer />

      <div className="content">
        <h1>Add Partnership</h1>

        <form className="form-card" onSubmit={handleSubmit}>
          <div className="top-row">
            <button className="btn-back" type="button" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} /> Back
            </button>
          </div>

          {/* COMPANY */}
          <h2 className="section-title">Company</h2>
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Company Name"
            required
          />

          {/* COLLEGE */}
          <h2 className="section-title">College</h2>
          <select
            name="college_id"
            value={form.college_id}
            onChange={handleChange}
            required
            disabled={!!lockedCollegeId}
          >
            <option value="">Select College</option>
            {colleges.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* DEPARTMENT (optional) */}
          {departments.length > 0 && (
            <>
              <h2 className="section-title">Department (Optional)</h2>
              <select
                name="department_id"
                value={form.department_id}
                onChange={handleChange}
              >
                <option value="">No Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* DATES */}
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

          {/* STATUS */}
          <h2 className="section-title">Status</h2>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            required
          >
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>

          {/* CONTACTS */}
          {form.contacts.map((c, index) => (
            <div key={index}>
              <h2 className="section-title">
                Contact {index + 1} {index === 1 && "(Optional)"}
              </h2>

              <div className="form-grid">
                <input
                  name="fullname"
                  value={c.fullname}
                  placeholder="Full Name"
                  onChange={(e) => handleContactChange(index, e)}
                  required={index === 0}
                />
                <input
                  name="position"
                  value={c.position}
                  placeholder="Position"
                  onChange={(e) => handleContactChange(index, e)}
                />
                <input
                  name="email"
                  value={c.email}
                  placeholder="Email"
                  onChange={(e) => handleContactChange(index, e)}
                  required={index === 0}
                  className={errors[index].email ? "input-error" : ""}
                />
                <input
                  name="phone"
                  value={c.phone}
                  placeholder="Phone"
                  onChange={(e) => handleContactChange(index, e)}
                  required={index === 0}
                  className={errors[index].phone ? "input-error" : ""}
                />
              </div>
            </div>
          ))}

          <button type="submit" className="btn-save" disabled={btnLoading}>
            {btnLoading ? "Saving..." : "Save Partnership"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPartnership;
