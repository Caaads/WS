import React, { useState, useEffect } from 'react';
import './AuthForm.css';
import axios from "../../api/axiosConfig";
import { User, Mail, Briefcase, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('');
  const [course, setCourse] = useState('');
  const [collegesList, setCollegesList] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  // Fetch all colleges on mount
  useEffect(() => {
    axios.get("/colleges/")
      .then(res => setCollegesList(res.data))
      .catch(err => console.log(err));
  }, []);

  // Fetch courses whenever college changes
  useEffect(() => {
    if (college) {
      axios.get(`/courses/?college_id=${college}`)
        .then(res => setCoursesList(res.data))
        .catch(err => console.log(err));
    } else {
      setCoursesList([]);
      setCourse('');
    }
  }, [college]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Build payload depending on role
    const payload = {
      fullname,
      email,
      password,
      role: position,
      college: position === 'superadmin' ? null : college || null,
      department: position === 'department_admin' ? course || null : null,
    };

    try {
      const response = await axios.post(
        "/signup/",
        payload,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      if (response.data.success) {
        alert("Signup successful! Redirecting to login...");
        navigate("/login");
      } else {
        setErrorMsg(response.data.error || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      setErrorMsg(error.response?.data?.error || "Network or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        {/* LEFT SIDE */}
        <div className="auth-welcome">
          <h1>Welcome to HCDC OSA Partnership Portal</h1>
          <img src="/hcdc_logo.png" alt="HCDC OSA Logo" className="welcome-image" />
          <p>Manage your partnerships efficiently and securely. Sign up or login to continue!</p>
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-box">
          <h2>Sign Up</h2>

          {errorMsg && <p className="error-msg">{errorMsg}</p>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <User className="input-icon" />
              <input
                type="text"
                placeholder="Full Name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <Mail className="input-icon" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <Briefcase className="input-icon" />
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
              >
                <option value="">Select User Role</option>
                <option value="superadmin">Superadmin (OSA Host)</option>
                <option value="college_admin">College Admin</option>
                <option value="department_admin">Department Admin</option>
              </select>
            </div>

            {/* College selection for College or Department Admin */}
            {(position === 'college_admin' || position === 'department_admin') && (
              <div className="input-group">
                <Briefcase className="input-icon" />
                <select
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  required
                >
                  <option value="">Select College</option>
                  {collegesList.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Course selection for Department Admin */}
            {position === 'department_admin' && (
              <div className="input-group">
                <Briefcase className="input-icon" />
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  required
                  disabled={!college}
                >
                  <option value="">Select Course</option>
                  {coursesList.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="input-group">
              <Lock className="input-icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <a href="/login" className="link">
            Already have an account? Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
