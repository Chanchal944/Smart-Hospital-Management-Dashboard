import React, { useEffect, useState } from "react";
import MainLayout from "../Components/MainLayout";
import "../CSS/ReceptionistDashboard.css";

function ReceptionistDashboard() {

  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [beds, setBeds] = useState([]);

  // ✅ LOAD REAL-TIME DATA
  useEffect(() => {
    const loadData = () => {
      setPatients(JSON.parse(localStorage.getItem("patients")) || []);
      setAppointments(JSON.parse(localStorage.getItem("appointments")) || []);
      setBeds(JSON.parse(localStorage.getItem("beds")) || []);
    };

    loadData();

    window.addEventListener("storage", loadData);
    return () => window.removeEventListener("storage", loadData);
  }, []);

  const availableBeds = beds.filter(b => b.status === "Available").length;
  const occupiedBeds = beds.filter(b => b.status === "Occupied").length;

  const pendingAppointments = appointments.filter(a => a.status === "Pending").length;
  const completedAppointments = appointments.filter(a => a.status === "Completed").length;

  return (
    <MainLayout>

      <div className="reception-dashboard">

        <h2 className="title">Receptionist Dashboard</h2>

        {/* CARDS */}
        <div className="card-grid">

          <div className="card blue">
            <h3>Total Patients</h3>
            <p>{patients.length}</p>
          </div>

          <div className="card green">
            <h3>Appointments</h3>
            <p>{appointments.length}</p>
          </div>

          <div className="card yellow">
            <h3>Pending</h3>
            <p>{pendingAppointments}</p>
          </div>

          <div className="card red">
            <h3>Completed</h3>
            <p>{completedAppointments}</p>
          </div>

          <div className="card purple">
            <h3>Available Beds</h3>
            <p>{availableBeds}</p>
          </div>

          <div className="card dark">
            <h3>Occupied Beds</h3>
            <p>{occupiedBeds}</p>
          </div>

        </div>

        {/* QUICK ACTIONS */}
        <div className="action-box">
          <h3>Quick Actions</h3>

          <div className="action-buttons">
            <button>Register Patient</button>
            <button>Book Appointment</button>
            <button>Check Beds</button>
            <button>Generate Bill</button>
          </div>
        </div>

        {/* TABLE */}
        <div className="table-box">
          <h3>Today's Appointments</h3>

          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {appointments.slice(0, 5).map((a, index) => (
                  <tr key={index}>
                    <td>{a.patient}</td>
                    <td>{a.time}</td>
                    <td>
                      <span className={a.status === "Completed" ? "status green" : "status yellow"}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>

      </div>

      {/* ✅ FOOTER ADDED */}
      <footer className="footer">
        <span>Copyright© 2026 Smart Hospital Management System | All Rights Reserved</span>
        <span>
          Designed & Developed by{" "}
          <a
            href="https://www.kavyainfoweb.com"
            target="_blank"
            rel="noreferrer"
          >
            Kavya Infoweb Pvt Ltd
          </a>
        </span>
      </footer>

    </MainLayout>
  );
}

export default ReceptionistDashboard;