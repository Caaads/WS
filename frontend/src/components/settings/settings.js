import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosConfig";
import Sidebar from "../shared/sidebar";

const Settings = () => {
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
        <h1>Settings</h1>
        <p>Update account settings, user preferences, and system configuration.</p>
      </main>
    </div>
  );
};

export default Settings;
