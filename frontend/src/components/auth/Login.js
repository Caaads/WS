import React, { useState } from 'react';
import './AuthForm.css';
import axios from "../../api/axiosConfig";
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("login/", { email, password });

      if (response.data.success) {
        alert("Login successful!");
        // Store user info if needed
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/dashboard"); // redirect to dashboard
      } else {
        alert("Login failed: " + response.data.error);
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert("Login error: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        {/* LEFT SIDE */}
        <div className="auth-welcome">
          <h1>Welcome to HCDC OSA Partnership Portal</h1>
          <img 
            src="/hcdc_logo.png"
            alt="HCDC OSA Logo" 
            className="welcome-image"
          />
          <p>Manage your partnerships efficiently and securely. Sign up or login to continue!</p>
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-box">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
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
              <Lock className="input-icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit">Login</button>
          </form>

          <a href="/" className="link">
            Don't have an account? Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
