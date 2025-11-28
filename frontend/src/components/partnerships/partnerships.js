import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosConfig";
import Sidebar from "../shared/sidebar";

const Partnerships = () => {
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
        <h1>Partnerships</h1>
        <p>Manage, track, and oversee institutional partnerships here.</p>
      </main>
    </div>
  );
};

export default Partnerships;
