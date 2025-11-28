import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Dashboard from "./components/dashboard/dashboard";
import Partnerships from "./components/partnerships/partnerships";
import Reports from "./components/reports/reports";
import Settings from "./components/settings/settings";

import AppLayout from "./layout/AppLayout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth pages — no sidebar */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Signup />} />

        {/* Pages WITH sidebar */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/partnerships" element={<Partnerships />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
