import React, { useEffect, useState } from "react";
import Sidebar from "../shared/sidebar";
import Navbar from "../shared/navbar";
import axiosInstance from "../../api/axiosConfig";
import "./users.css";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);

  // Filters
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [collegeFilter, setCollegeFilter] = useState("");

  const [collegesList, setCollegesList] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);

  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "",
    college: "",
    department: "",
  });

  const [loading, setLoading] = useState(false);

  // Auth check
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "superadmin") {
      alert("You are not authorized to access this page.");
      navigate("/dashboard");
    }
  }, [navigate]);

  // Fetch users
  const fetchUsers = () => {
    axiosInstance
      .get("/users/")
      .then((res) => setUsers(res.data))
      .catch(console.log);
  };

  // Fetch colleges
  const fetchColleges = () => {
    axiosInstance
      .get("/colleges/")
      .then((res) => setCollegesList(res.data))
      .catch(console.log);
  };

  // Fetch departments *for the modal only*
  useEffect(() => {
    if (formData.college) {
      axiosInstance
        .get(`/departments/?college_id=${formData.college}`)
        .then((res) => setDepartmentsList(res.data))
        .catch(() => setDepartmentsList([]));
    } else {
      setDepartmentsList([]);
      setFormData((prev) => ({ ...prev, department: "" }));
    }
  }, [formData.college]);

  useEffect(() => {
    fetchUsers();
    fetchColleges();
  }, []);

  const openModal = (user = null, create = false) => {
    setSelectedUser(user);
    setCreating(create);

    if (create) {
      setFormData({
        fullname: "",
        email: "",
        password: "",
        role: "",
        college: "",
        department: "",
      });
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setCreating(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        fullname: formData.fullname,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        college:
          ["student", "college_admin", "department_admin"].includes(
            formData.role
          )
            ? formData.college || null
            : null,
        department:
          ["student", "department_admin"].includes(formData.role)
            ? formData.department || null
            : null,
      };

      const res = await axiosInstance.post("/signup/", payload);

      if (res.data.success) {
        alert("User created successfully!");
        closeModal();
        fetchUsers();
      } else {
        alert(res.data.error || "Failed to create user.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create user.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (user) => {
    if (!window.confirm(`Delete ${user.fullname}?`)) return;

    axiosInstance
      .delete(`/users/${user.id}/`)
      .then(() =>
        setUsers((prev) => prev.filter((u) => u.id !== user.id))
      )
      .catch(() => alert("Delete failed."));
  };

  // FILTERED LIST (department filter removed)
  const filteredUsers = users
    .filter((u) =>
      u.fullname.toLowerCase().includes(searchName.toLowerCase())
    )
    .filter((u) => u.email.toLowerCase().includes(searchEmail.toLowerCase()))
    .filter((u) => (roleFilter ? u.role === roleFilter : true))
    .filter((u) =>
      collegeFilter ? u.college?.id === Number(collegeFilter) : true
    );

  return (
    <div className="page-container">
      <Navbar />
      <Sidebar />

      <div className="content">
        <div className="page-header">
          <h1>Users</h1>
        </div>

        {/* FILTERS */}
        <div className="filters-row">
          <input
            type="text"
            placeholder="Search Name"
            className="filter-input"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Search Email"
            className="filter-input"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />

          <select
            className="filter-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="superadmin">Superadmin</option>
            <option value="college_admin">College Admin</option>
            <option value="department_admin">Department Admin</option>
            <option value="student">Student</option>
            <option value="guest">Guest</option>
          </select>

          {/* COLLEGE FILTER (department filter removed) */}
          <select
            className="filter-select"
            value={collegeFilter}
            onChange={(e) => setCollegeFilter(e.target.value)}
          >
            <option value="">All Colleges</option>
            {collegesList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button className="btn add-btn" onClick={() => openModal(null, true)}>
            Create User
          </button>
        </div>

        {/* USERS TABLE */}
        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length ? (
                filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>{u.fullname}</td>
                    <td>{u.role}</td>
                    <td className="actions">
                      <button
                        className="btn view-btn"
                        onClick={() => openModal(u)}
                      >
                        View
                      </button>
                      <button
                        className="btn delete-btn"
                        onClick={() => handleDelete(u)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="no-data">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="modal-backdrop">
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              {creating ? (
                <>
                  <h2>Create User</h2>
                  <form onSubmit={handleCreateUser} className="edit-user-form">
                    <label>
                      Full Name
                      <input
                        type="text"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleChange}
                        required
                      />
                    </label>

                    <label>
                      Email
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </label>

                    <label>
                      Role
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Role</option>
                        <option value="superadmin">Superadmin</option>
                        <option value="college_admin">College Admin</option>
                        <option value="department_admin">
                          Department Admin
                        </option>
                        <option value="student">Student</option>
                        <option value="guest">Guest</option>
                      </select>
                    </label>

                    {(formData.role === "college_admin" ||
                      formData.role === "department_admin" ||
                      formData.role === "student") && (
                      <label>
                        College
                        <select
                          name="college"
                          value={formData.college}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select College</option>
                          {collegesList.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}

                    {(formData.role === "department_admin" ||
                      formData.role === "student") && (
                      <label>
                        Department
                        <select
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Department</option>
                          {departmentsList.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}

                    <label>
                      Password
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </label>

                    <div className="form-buttons">
                      <button
                        type="submit"
                        className="btn save-btn"
                        disabled={loading}
                      >
                        {loading ? "Creating..." : "Create"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-close"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </>
              ) : selectedUser ? (
                <>
                  <h2>User Details</h2>
                  <div className="user-details">
                    <p>
                      <strong>Full Name:</strong> {selectedUser.fullname}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedUser.email}
                    </p>
                    <p>
                      <strong>Role:</strong> {selectedUser.role}
                    </p>
                    <p>
                      <strong>College:</strong>{" "}
                      {selectedUser.college?.name ?? "N/A"}
                    </p>
                    <p>
                      <strong>Department:</strong>{" "}
                      {selectedUser.department?.name ?? "N/A"}
                    </p>
                  </div>
                  <div className="form-buttons">
                    <button
                      type="button"
                      className="btn btn-close"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
