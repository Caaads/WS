import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosConfig";
import { Link, useLocation } from "react-router-dom";

import {
  Menu,
  ChartColumnBig,
  Handshake,
  School,
  Users,
  LogOut
} from "lucide-react";

import "./sidebar.css";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    axiosInstance
      .get("current_user/")
      .then((res) => setUser(res.data))
      .catch(() => (window.location.href = "/login"));
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.get("logout/");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <ChartColumnBig /> },
    { name: "Partnerships", path: "/partnerships", icon: <Handshake /> },
    { name: "Colleges", path: "/colleges", icon: <School /> },
    { name: "Contact", path: "/contact", icon: <Users /> }
  ];

  return (
    <div className={collapsed ? "sidebar collapsed" : "sidebar"}>
      
      {/* toggle button */}
      <button
        className="toggle-btn"
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <Menu />
      </button>

      {/* header area */}
      <div className="sidebar-header">

        {/* expanded sidebar */}
        {!collapsed && (
          <div className="logo-section">
            <img src="/hcdc_logo.png" alt="HCDC Logo" className="hcdc-logo" />

            {/* user info directly under logo */}
            {user && (
              <div className="user-info under-logo">
                <h3>{user.fullname}</h3>

                <p>
                  {user.role === "superadmin" && "Superadmin"}
                  {user.role === "college_admin" && `${user.college} Admin`}
                  {user.role === "department_admin" && `${user.department} Admin`}
                </p>
              </div>
            )}
          </div>
        )}

        {/* collapsed sidebar */}
        {collapsed && (
          <div className="logo-collapsed">
            <img src="/hcdc_logo.png" alt="HCDC Logo" className="hcdc-logo-small" />
          </div>
        )}

        <hr className="divider" />
      </div>

      {/* menu */}
      <ul className="menu">
        {navItems.map((item, i) => (
          <li key={i} className={location.pathname === item.path ? "active" : ""}>
            <Link to={item.path} className="menu-link">
              <span className="icon">{item.icon}</span>
              {!collapsed && <span className="label">{item.name}</span>}
            </Link>
          </li>
        ))}

      </ul>
    </div>
  );
}
