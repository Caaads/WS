import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosConfig";
import "./settingsmodal.css";

export default function SettingsModal({ open, onClose }) {
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);

  // Form state for editing profile
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
  });

  useEffect(() => {
    if (!open) return;

    // Fetch current user
    axiosInstance.get("/current_user/").then((res) => {
      setUserData(res.data);
      setFormData({
        fullname: res.data.fullname,
        email: res.data.email,
      });
    });
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      const payload = { ...formData,
        role: userData.role,
       };
      const res = await axiosInstance.put("/update_user/", payload);
      setUserData(res.data);
      setEditing(false);
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        {!editing && (
          <>
            <h2>User Settings</h2>
            <div className="user-details">
              <p><strong>Full Name:</strong> {userData?.fullname}</p>
              <p><strong>Email:</strong> {userData?.email}</p>
              <p><strong>Role:</strong> {userData?.role}</p>
              <p><strong>College:</strong> {userData?.college || "N/A"}</p>
              <p><strong>Department:</strong> {userData?.department || "N/A"}</p>
            </div>

            <div className="form-buttons">
              <button className="btn save-btn" onClick={() => setEditing(true)}>Edit Profile</button>
              <button className="btn btn-close" onClick={onClose}>Close</button>
            </div>
          </>
        )}

        {editing && (
          <>
            <h2>Edit Profile</h2>
            <div className="user-details">
              <label>
                Full Name
                <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} />
              </label>
              <label>
                Email
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
              </label>
            </div>
            <div className="form-buttons">
              <button className="btn save-btn" onClick={handleSaveProfile}>Save</button>
              <button className="btn btn-close" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
