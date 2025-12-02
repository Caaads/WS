import React from "react";
import Sidebar from "../shared/sidebar";
import Navbar from "../shared/navbar";
import "./dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <Navbar />
      <Sidebar />
      <div className="content">
        {/* Add top margin to avoid overlap with navbar */}
        <div className="page-header">
          <h1>Dashboard</h1>
        </div>

        {/* STAT CARDS - ready for dynamic data */}
        <div className="cards-row">
          <div className="card">
            <h3>Total Partnerships</h3>
            <p>0</p>
          </div>

          <div className="card">
            <h3>Active Partnerships</h3>
            <p>0</p>
          </div>

          <div className="card">
            <h3>Expiring Soon</h3>
            <p>0</p>
          </div>

          <div className="card">
            <h3>Expired</h3>
            <p>0</p>
          </div>
        </div>

        {/* TABLE - ready for dynamic data */}
        <div className="table-container">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Company/Department 1</th>
                <th>Company/Department 2</th>
                <th>Date Started</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                  No data available
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
