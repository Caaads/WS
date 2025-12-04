import React, { useEffect, useState } from "react";
import Sidebar from "../shared/sidebar";
import Navbar from "../shared/navbar";
import axiosInstance from "../../api/axiosConfig";
import { Layers, CheckCircle2, Clock, XCircle } from "lucide-react";
import "./dashboard.css";

const Dashboard = () => {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/partners/")
      .then((res) => setPartners(res.data))
      .catch(console.log);
  }, []);

  // Stats
  const totalPartnerships = partners.length;
  const activePartnerships = partners.filter(
    (p) => p.status.toLowerCase() === "active"
  ).length;
  const expiringSoon = partners.filter((p) => {
    if (!p.effectivity_end) return false;
    const endDate = new Date(p.effectivity_end);
    const now = new Date();
    const diffDays = (endDate - now) / (1000 * 60 * 60 * 24);
    return diffDays > 0 && diffDays <= 30;
  }).length;
  const expired = partners.filter(
    (p) => p.status.toLowerCase() === "expired"
  ).length;

  return (
    <div className="page-container">
      <Navbar />
      <Sidebar />

      <div className="content">
        <div className="page-header">
          <h1>Dashboard</h1>
        </div>

        <div className="cards-row">

          <div className="card card-total">
            <div className="card-icon">
              <Layers size={36} />
            </div>
            <h3>Total Partnerships</h3>
            <p>{totalPartnerships}</p>
          </div>

          <div className="card card-active">
            <div className="card-icon">
              <CheckCircle2 size={36} />
            </div>
            <h3>Active Partnerships</h3>
            <p>{activePartnerships}</p>
          </div>

          <div className="card card-warning">
            <div className="card-icon">
              <Clock size={36} />
            </div>
            <h3>Expiring Soon</h3>
            <p>{expiringSoon}</p>
          </div>

          <div className="card card-expired">
            <div className="card-icon">
              <XCircle size={36} />
            </div>
            <h3>Expired</h3>
            <p>{expired}</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
