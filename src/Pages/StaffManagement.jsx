import React, { useState, useEffect } from "react";
import MainLayout from "../Components/MainLayout";
import "../CSS/StaffManagement.css";

function StaffManagement() {

  const [staffList, setStaffList] = useState(() => {
    const stored = localStorage.getItem("staff");
    return stored ? JSON.parse(stored) : [];
  });

  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    department: "",
    shift: "",
    phone: "",
    email: ""
  });

  // ✅ DROPDOWN DATA
  const roles = [
    "Doctor",
    "Nurse",
    "Receptionist",
    "Pharmacist",
    "Lab Technician",
    "Ward Boy",
    "Admin"
  ];

  const departments = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Emergency",
    "Pharmacy",
    "Radiology",
    "General"
  ];

  const shifts = ["Morning", "Evening", "Night"];

  useEffect(() => {
    localStorage.setItem("staff", JSON.stringify(staffList));
  }, [staffList]);

  const toggleForm = () => {
    setShowForm(!showForm);
    setEditingIndex(null);
    setFormData({
      name: "",
      role: "",
      department: "",
      shift: "",
      phone: "",
      email: ""
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ UPDATED VALIDATION
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.role) {
      alert("Name & Role required!");
      return;
    }

    // ✅ Phone validation (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      alert("Enter valid 10-digit phone number!");
      return;
    }

    // ✅ Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      alert("Enter valid email address!");
      return;
    }

    if (editingIndex !== null) {
      const updated = [...staffList];
      updated[editingIndex] = formData;
      setStaffList(updated);
    } else {
      setStaffList([...staffList, formData]);
    }

    toggleForm();
  };

  const handleEdit = (staff, index) => {
    setFormData(staff);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    if (window.confirm("Delete staff?")) {
      setStaffList(staffList.filter((_, i) => i !== index));
    }
  };

  const filtered = staffList.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="staff-page">

        {/* HEADER */}
        <div className="staff-header">
          <h1>Staff Management</h1>
          <button className="add-btn" onClick={toggleForm}>
            + Add Staff
          </button>
        </div>

        {/* SEARCH */}
        <input
          className="search-bar"
          placeholder="Search staff..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* TABLE */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Department</th>
                <th>Shift</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7">No staff found</td>
                </tr>
              ) : (
                filtered.map((staff, index) => (
                  <tr key={index}>
                    <td>{staff.name}</td>
                    <td>{staff.role}</td>
                    <td>{staff.department}</td>
                    <td>{staff.shift}</td>
                    <td>{staff.phone}</td>
                    <td>{staff.email}</td>

                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(staff, index)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(index)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* FORM MODAL */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-btn" onClick={toggleForm}>✖</button>

              <h2>{editingIndex !== null ? "Edit Staff" : "Add Staff"}</h2>

              <form onSubmit={handleSubmit}>

                <input
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                />

                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="">Select Role</option>
                  {roles.map((r, i) => (
                    <option key={i} value={r}>{r}</option>
                  ))}
                </select>

                <select name="department" value={formData.department} onChange={handleChange}>
                  <option value="">Select Department</option>
                  {departments.map((d, i) => (
                    <option key={i} value={d}>{d}</option>
                  ))}
                </select>

                <select name="shift" value={formData.shift} onChange={handleChange}>
                  <option value="">Select Shift</option>
                  {shifts.map((s, i) => (
                    <option key={i} value={s}>{s}</option>
                  ))}
                </select>

                <input
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel"
                />

                <input
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                />

                <button className="submit-btn">
                  {editingIndex !== null ? "Update" : "Add Staff"}
                </button>

              </form>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
}

export default StaffManagement;