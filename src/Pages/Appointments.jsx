import React, { useState, useEffect } from "react";
import MainLayout from "../Components/MainLayout";
import "../CSS/Appointments.css";

function Appointments() {

  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState("");

  // ✅ DOCTOR DATA
  const doctorsList = [
    {
      name: "Dr. Sharma",
      specialization: "General Physician",
      diseases: ["Fever", "Cold", "Cough"],
      slots: ["10:00 AM", "11:00 AM", "12:00 PM"]
    },
    {
      name: "Dr. Mehta",
      specialization: "Dermatologist",
      diseases: ["Skin", "Allergy"],
      slots: ["02:00 PM", "03:00 PM"]
    },
    {
      name: "Dr. Patel",
      specialization: "Orthopedic",
      diseases: ["Bone", "Fracture"],
      slots: ["10:30 AM", "11:30 AM"]
    },
    {
      name: "Dr. Singh",
      specialization: "Neurologist",
      diseases: ["Headache", "Brain"],
      slots: ["04:00 PM"]
    }
  ];

  const [formData, setFormData] = useState({
    patient: "",
    disease: "",
    doctor: "",
    date: "",
    time: "",
    status: "Pending",
  });

  // ✅ LOAD DATA (ONLY ONCE)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("appointments");
      if (stored) {
        setAppointments(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Load error:", error);
      setAppointments([]);
    }
  }, []);

  const toggleForm = () => {
    setShowForm(!showForm);
    setEditingIndex(null);
    setFormData({
      patient: "",
      disease: "",
      doctor: "",
      date: "",
      time: "",
      status: "Pending",
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ AUTO DOCTOR SUGGEST
  const handleDiseaseChange = (e) => {
    const disease = e.target.value;

    const matchedDoctor = doctorsList.find(doc =>
      doc.diseases.some(d =>
        d.toLowerCase().includes(disease.toLowerCase())
      )
    );

    setFormData({
      ...formData,
      disease,
      doctor: matchedDoctor ? matchedDoctor.name : ""
    });
  };

  const selectedDoctorObj = doctorsList.find(
    d => d.name === formData.doctor
  );

  const availableSlots = selectedDoctorObj
    ? selectedDoctorObj.slots
    : [];

  // ✅ FILTER
  const filteredAppointments = appointments.filter(
    (apt) => selectedDoctor === "" || apt.doctor === selectedDoctor
  );

  // ✅ SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.patient || !formData.disease || !formData.doctor || !formData.date || !formData.time) {
      alert("Fill all fields!");
      return;
    }

    // ❌ PREVENT DOUBLE BOOKING
    const isBooked = appointments.some(
      (apt, i) =>
        apt.doctor === formData.doctor &&
        apt.date === formData.date &&
        apt.time === formData.time &&
        i !== editingIndex
    );

    if (isBooked) {
      alert("This slot already booked!");
      return;
    }

    let updatedAppointments;

    if (editingIndex !== null) {
      updatedAppointments = [...appointments];
      updatedAppointments[editingIndex] = formData;
    } else {
      updatedAppointments = [
        ...appointments,
        { ...formData, id: "APT" + Date.now() }
      ];
    }

    // ✅ SAVE TO LOCALSTORAGE
    setAppointments(updatedAppointments);
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments));

    toggleForm();
  };

  // ✅ EDIT
  const handleEdit = (index) => {
    setFormData(appointments[index]);
    setEditingIndex(index);
    setShowForm(true);
  };

  // ✅ DELETE
  const handleDelete = (index) => {
    if (window.confirm("Delete appointment?")) {
      const updated = appointments.filter((_, i) => i !== index);

      setAppointments(updated);
      localStorage.setItem("appointments", JSON.stringify(updated));
    }
  };

  // ✅ STATUS CHANGE
  const handleStatusChange = (index, status) => {
    const updated = [...appointments];
    updated[index].status = status;

    setAppointments(updated);
    localStorage.setItem("appointments", JSON.stringify(updated));
  };

  return (
    <MainLayout>
      <div className="appointment-page">

        {/* HEADER */}
        <div className="appointment-header">
          <h1>Appointments</h1>
          <button className="add-btn" onClick={toggleForm}>
            + Book Appointment
          </button>
        </div>

        {/* FILTER */}
        <div className="doctor-filter">
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
          >
            <option value="">All Doctors</option>
            {doctorsList.map((doc, i) => (
              <option key={i} value={doc.name}>
                {doc.name} ({doc.specialization})
              </option>
            ))}
          </select>
        </div>

        {/* TABLE */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Disease</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="7">No appointments found</td>
                </tr>
              ) : (
                filteredAppointments.map((apt, index) => (
                  <tr key={index}>
                    <td>{apt.patient}</td>
                    <td>{apt.disease}</td>

                    <td>
                      {apt.doctor}
                      <br />
                      <small>
                        {doctorsList.find(d => d.name === apt.doctor)?.specialization}
                      </small>
                    </td>

                    <td>{apt.date}</td>
                    <td>{apt.time}</td>

                    <td>
                      <select
                        value={apt.status}
                        onChange={(e) =>
                          handleStatusChange(index, e.target.value)
                        }
                        className={`status ${apt.status.toLowerCase()}`}
                      >
                        <option>Pending</option>
                        <option>Completed</option>
                        <option>Cancelled</option>
                      </select>
                    </td>

                    <td>
                      <button onClick={() => handleEdit(index)}>Edit</button>
                      <button onClick={() => handleDelete(index)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* FORM */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-btn" onClick={toggleForm}>✖</button>

              <h2>{editingIndex !== null ? "Edit Appointment" : "Book Appointment"}</h2>

              <form onSubmit={handleSubmit}>

                <div className="form-group">
                  <label>Patient*</label>
                  <input name="patient" value={formData.patient} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Disease*</label>
                  <input
                    name="disease"
                    value={formData.disease}
                    onChange={handleDiseaseChange}
                  />
                </div>

                <div className="form-group">
                  <label>Doctor*</label>
                  <select name="doctor" value={formData.doctor} onChange={handleChange}>
                    <option value="">Select Doctor</option>
                    {doctorsList.map((doc, i) => (
                      <option key={i} value={doc.name}>
                        {doc.name} ({doc.specialization})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Date*</label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Time*</label>
                  <select name="time" value={formData.time} onChange={handleChange}>
                    <option value="">Select Time</option>
                    {availableSlots.map((slot, i) => (
                      <option key={i}>{slot}</option>
                    ))}
                  </select>
                </div>

                <button className="submit-btn">
                  {editingIndex !== null ? "Update" : "Book"}
                </button>

              </form>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
}

export default Appointments;