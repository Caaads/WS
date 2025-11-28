import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosConfig";
import Sidebar from "../shared/sidebar";

const Reports = () => {
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
      <Sidebar user={user} />

      <main className="dashboard-content">
        <h1>Reports</h1>
        <p>View analytics, partnership activity, and system-generated reports.</p>
      </main>
    </div>
  );
};

export default Reports;
