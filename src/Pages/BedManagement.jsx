import React, { useState, useEffect } from "react";
import MainLayout from "../Components/MainLayout";
import "../CSS/BedManagement.css";

function BedManagement() {

  const [beds, setBeds] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    patient: "",
    bedNumber: "",
  });

  // ✅ INITIAL BEDS (10 beds)
  useEffect(() => {
    const stored = localStorage.getItem("beds");

    if (stored) {
      setBeds(JSON.parse(stored));
    } else {
      const initialBeds = Array.from({ length: 10 }, (_, i) => ({
        bedNumber: i + 1,
        status: "Available",
        patient: ""
      }));
      setBeds(initialBeds);
      localStorage.setItem("beds", JSON.stringify(initialBeds));
    }
  }, []);

  // ✅ SAVE
  const saveBeds = (updatedBeds) => {
    setBeds(updatedBeds);
    localStorage.setItem("beds", JSON.stringify(updatedBeds));
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setFormData({ patient: "", bedNumber: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ ASSIGN BED
  const handleAssign = (e) => {
    e.preventDefault();

    if (!formData.patient || !formData.bedNumber) {
      alert("Fill all fields!");
      return;
    }

    const updatedBeds = beds.map((bed) =>
      bed.bedNumber === Number(formData.bedNumber)
        ? { ...bed, status: "Occupied", patient: formData.patient }
        : bed
    );

    saveBeds(updatedBeds);
    toggleForm();
  };

  // ✅ RELEASE BED
  const handleRelease = (bedNumber) => {
    if (window.confirm("Release this bed?")) {
      const updatedBeds = beds.map((bed) =>
        bed.bedNumber === bedNumber
          ? { ...bed, status: "Available", patient: "" }
          : bed
      );

      saveBeds(updatedBeds);
    }
  };

  // ✅ COUNTS
  const availableBeds = beds.filter(b => b.status === "Available").length;
  const occupiedBeds = beds.filter(b => b.status === "Occupied").length;

  return (
    <MainLayout>
      <div className="bed-page">

        {/* HEADER */}
        <div className="bed-header">
          <h1>Bed Management</h1>
          <button className="add-btn" onClick={toggleForm}>
            + Assign Bed
          </button>
        </div>

        {/* CARDS */}
        <div className="bed-cards">
          <div className="card available">
            <h3>Available Beds</h3>
            <p>{availableBeds}</p>
          </div>

          <div className="card occupied">
            <h3>Occupied Beds</h3>
            <p>{occupiedBeds}</p>
          </div>
        </div>

        {/* TABLE */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Bed No</th>
                <th>Status</th>
                <th>Patient</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {beds.map((bed, index) => (
                <tr key={index}>
                  <td>{bed.bedNumber}</td>
                  <td>
                    <span className={bed.status === "Available" ? "status available" : "status occupied"}>
                      {bed.status}
                    </span>
                  </td>
                  <td>{bed.patient || "-"}</td>

                  <td>
                    {bed.status === "Occupied" && (
                      <button onClick={() => handleRelease(bed.bedNumber)}>
                        Release
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* FORM */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-btn" onClick={toggleForm}>✖</button>

              <h2>Assign Bed</h2>

              <form onSubmit={handleAssign}>

                <div className="form-group">
                  <label>Patient Name*</label>
                  <input
                    name="patient"
                    value={formData.patient}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Select Bed*</label>
                  <select
                    name="bedNumber"
                    value={formData.bedNumber}
                    onChange={handleChange}
                  >
                    <option value="">Select Bed</option>
                    {beds
                      .filter(b => b.status === "Available")
                      .map((bed) => (
                        <option key={bed.bedNumber} value={bed.bedNumber}>
                          Bed {bed.bedNumber}
                        </option>
                      ))}
                  </select>
                </div>

                <button className="submit-btn">Assign</button>

              </form>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
}

export default BedManagement;