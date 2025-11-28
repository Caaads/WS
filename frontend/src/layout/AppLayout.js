import React from "react";
import Sidebar from "../components/shared/sidebar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1, marginLeft: "220px", padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}
