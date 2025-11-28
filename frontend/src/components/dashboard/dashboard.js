import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import axiosInstance from "../../api/axiosConfig";

// ⬅️ Import Sidebar
import Sidebar from "../shared/sidebar";


const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("current_user/")
      .then((res) => setUser(res.data))
      .catch(() => (window.location.href = "/login"));
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="dashboard-page">
      {/* Sidebar Component */}
      <Sidebar user={user} />

      {/* Main Content */}
      <main className="dashboard-content">
        <h1>Dashboard</h1>
        <p>Welcome to the HCDC OSA Partnership Portal!</p>
      </main>
    </div>
  );
};

export default Dashboard;
