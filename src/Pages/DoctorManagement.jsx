import React, { useState, useEffect } from "react";
import MainLayout from "../Components/MainLayout";
import "../CSS/DoctorManagement.css";
import logo from "../assets/Image/Logo_English.png";

function DoctorManagement() {

  // ✅ SAFE LOAD
  const getStoredDoctors = () => {
    try {
      const data = localStorage.getItem("doctors");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const [doctors, setDoctors] = useState(getStoredDoctors());
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    specialization: "",
    experience: "",
    contact: "",
    email: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  // ✅ AUTO SAVE
  useEffect(() => {
    localStorage.setItem("doctors", JSON.stringify(doctors));
  }, [doctors]);

  const specializationOptions = [
    "Cardiologist",
    "Dermatologist",
    "Neurologist",
    "Orthopedic",
    "Pediatrician",
    "General Physician",
  ];

  const generateId = () => {
    return "DOC" + Date.now();
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    if (showForm) {
      setFormData({
        id: "",
        name: "",
        specialization: "",
        experience: "",
        contact: "",
        email: "",
      });
      setEditingIndex(null);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.specialization) {
      alert("Please fill required fields!");
      return;
    }

    // ✅ CONTACT VALIDATION
    if (formData.contact && !/^[0-9]{10}$/.test(formData.contact)) {
      alert("Contact must be 10-digit number!");
      return;
    }

    let updatedDoctors;

    if (editingIndex !== null) {
      updatedDoctors = [...doctors];
      updatedDoctors[editingIndex] = formData;
    } else {
      updatedDoctors = [...doctors, { ...formData, id: generateId() }];
    }

    // ✅ UPDATE + SAVE
    setDoctors(updatedDoctors);
    localStorage.setItem("doctors", JSON.stringify(updatedDoctors));

    toggleForm();
  };

  const handleEdit = (index) => {
    setFormData(doctors[index]);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    if (window.confirm("Delete this doctor?")) {
      const updated = doctors.filter((_, i) => i !== index);
      setDoctors(updated);
      localStorage.setItem("doctors", JSON.stringify(updated));
    }
  };

  // SEARCH + FILTER
  const filteredDoctors = doctors.filter((doc) => {
    const matchSearch =
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(search.toLowerCase());

    const matchFilter = filter === "" || doc.specialization === filter;

    return matchSearch && matchFilter;
  });

  return (
    <MainLayout>
      <div className="doctor-page">
        <img src={logo} alt="logo" className="background-logo" />

        <div className="page-header">
          <h1>Doctor Management</h1>
          <button className="add-btn" onClick={toggleForm}>
            + Add Doctor
          </button>
        </div>

        {/* SEARCH + FILTER */}
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search by name or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All Specializations</option>
            {specializationOptions.map((spec, i) => (
              <option key={i} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        {/* POPUP */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-btn" onClick={toggleForm}>
                ✖
              </button>

              <h2>{editingIndex !== null ? "Edit Doctor" : "Add Doctor"}</h2>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Specialization*</label>
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Specialization</option>
                    {specializationOptions.map((spec, i) => (
                      <option key={i} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Experience</label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Contact</label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" className="submit-btn">
                  {editingIndex !== null ? "Update Doctor" : "Add Doctor"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TABLE */}
        <div className="doctor-table">
          <h2>Doctors List</h2>

          {filteredDoctors.length === 0 ? (
            <p>No doctors found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Experience</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredDoctors.map((d, index) => (
                  <tr key={index}>
                    <td>{d.id}</td>
                    <td>{d.name}</td>
                    <td>{d.specialization}</td>
                    <td>{d.experience}</td>
                    <td>{d.contact}</td>
                    <td>{d.email}</td>
                    <td className="action-btns">
                      <button onClick={() => handleEdit(index)}>Edit</button>
                      <button onClick={() => handleDelete(index)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default DoctorManagement;