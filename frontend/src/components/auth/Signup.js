import React, { useState } from 'react';
import './AuthForm.css';
import axios from "../../api/axiosConfig"; // make sure axiosConfig has baseURL and withCredentials
import { User, Mail, Briefcase, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await axios.post(
        "signup/", 
        { fullname, email, position, password },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      if (response.data.success) {
        alert("Signup successful! Redirecting to login...");
        navigate("/login"); // redirect after successful signup
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
