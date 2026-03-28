import React, { useState, useEffect } from "react";
import MainLayout from "../Components/MainLayout";
import "../CSS/PatientManagement.css";
import logo from "../assets/Image/Logo_English.png";

function PatientManagement() {

  const getStoredPatients = () => {
    try {
      const data = localStorage.getItem("patients");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const [patients, setPatients] = useState(getStoredPatients());
  const [search, setSearch] = useState("");
  const [showToast, setShowToast] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
    history: "",
    recoveryStatus: "", // ✅ NEW FIELD
  });

  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem("patients", JSON.stringify(patients));
  }, [patients]);

  const toggleForm = () => {
    setShowForm(!showForm);
    if (showForm) {
      setFormData({
        name: "",
        age: "",
        gender: "",
        contact: "",
        history: "",
        recoveryStatus: "",
      });
      setEditingIndex(null);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.age || !formData.gender) {
      alert("Please fill required fields!");
      return;
    }

    if (formData.contact && !/^[0-9]{10}$/.test(formData.contact)) {
      alert("Contact must be 10 digits!");
      return;
    }

    if (!formData.recoveryStatus) {
      alert("Please select recovery status!");
      return;
    }

    let updatedPatients;

    if (editingIndex !== null) {
      updatedPatients = [...patients];
      updatedPatients[editingIndex] = formData;
    } else {
      updatedPatients = [...patients, formData];

      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }

    setPatients(updatedPatients);
    localStorage.setItem("patients", JSON.stringify(updatedPatients));

    toggleForm();
  };

  const handleEdit = (index) => {
    setFormData(patients[index]);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    if (window.confirm("Delete this patient?")) {
      const updated = patients.filter((_, i) => i !== index);
      setPatients(updated);
      localStorage.setItem("patients", JSON.stringify(updated));
    }
  };

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="patient-page">
        <img src={logo} alt="logo" className="background-logo" />

        <div className="page-header">
          <h1>Patient Management</h1>
          <button className="add-btn" onClick={toggleForm}>
            + Add Patient
          </button>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search patient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {showToast && (
          <div className="toast">Patient Added Successfully ✔</div>
        )}

        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-btn" onClick={toggleForm}>✖</button>

              <h2>{editingIndex !== null ? "Edit Patient" : "Add Patient"}</h2>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Name*</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Age*</label>
                  <input type="number" name="age" value={formData.age} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Gender*</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* ✅ NEW DROPDOWN */}
                <div className="form-group">
                  <label>Recovery Status*</label>
                  <select
                    name="recoveryStatus"
                    value={formData.recoveryStatus}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Fully Recover">Patient Fully Recover</option>
                    <option value="Partially Recover">Patient Partially Recover</option>
                    <option value="Not Recover">Patient Not Recover</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Contact</label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="10-digit number"
                  />
                </div>

                <div className="form-group">
                  <label>Medical History</label>
                  <textarea name="history" value={formData.history} onChange={handleChange}></textarea>
                </div>

                <button type="submit" className="submit-btn">
                  {editingIndex !== null ? "Update Patient" : "Add Patient"}
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="patient-table">
          <h2>Patients List</h2>

          {filteredPatients.length === 0 ? (
            <p>No patients found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Recovery Status</th> {/* ✅ NEW COLUMN */}
                  <th>Contact</th>
                  <th>History</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredPatients.map((p, index) => (
                  <tr key={index}>
                    <td>{p.name}</td>
                    <td>{p.age}</td>
                    <td>{p.gender}</td>
                    <td>{p.recoveryStatus}</td> {/* ✅ SHOW STATUS */}
                    <td>{p.contact}</td>
                    <td>{p.history}</td>
                    <td>
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

export default PatientManagement;