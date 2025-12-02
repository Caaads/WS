import React, { useState } from "react";

import Navbar from "../components/shared/navbar";

export default function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
<div className="app-layout">
  <div className={`main-content ${collapsed ? "collapsed" : ""}`}>
    <Navbar />
    <div className="page-content">{children}</div>
  </div>
</div>
  );
}
