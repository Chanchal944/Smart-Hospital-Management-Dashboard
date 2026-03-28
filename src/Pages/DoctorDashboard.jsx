import React, { useEffect, useState } from "react";
import MainLayout from "../Components/MainLayout";
import "../CSS/DoctorDashboard.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from "recharts";

function DoctorDashboard() {

  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [emergencies, setEmergencies] = useState([]);

  // ✅ FIXED LOADER (MATCHES YOUR EMERGENCY PAGE)
  const loadData = () => {

    const storedPatients = localStorage.getItem("patients");
    const storedAppointments = localStorage.getItem("appointments");

    // 🚨 IMPORTANT FIX HERE
    const storedEmergencyCases = localStorage.getItem("emergencyCases");

    try {
      setPatients(storedPatients ? JSON.parse(storedPatients) : []);
    } catch {
      setPatients([]);
    }

    try {
      setAppointments(storedAppointments ? JSON.parse(storedAppointments) : []);
    } catch {
      setAppointments([]);
    }

    try {
      const parsed = storedEmergencyCases
        ? JSON.parse(storedEmergencyCases)
        : [];

      setEmergencies(Array.isArray(parsed) ? parsed : []);
    } catch {
      setEmergencies([]);
    }
  };

  // ✅ REAL-TIME SYNC (same tab + other tabs)
  useEffect(() => {
    loadData();

    const handleStorageChange = () => loadData();

    const handleCustomUpdate = () => loadData();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("hospitalDataUpdated", handleCustomUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("hospitalDataUpdated", handleCustomUpdate);
    };
  }, []);

  // COUNTS
  const totalPatients = patients.length;
  const totalAppointments = appointments.length;
  const totalEmergency = emergencies.length;

  const fullyRecover = patients.filter(
    (p) => p.recoveryStatus === "Fully Recover"
  ).length;

  const partiallyRecover = patients.filter(
    (p) => p.recoveryStatus === "Partially Recover"
  ).length;

  const notRecover = patients.filter(
    (p) => p.recoveryStatus === "Not Recover"
  ).length;

  const chartData = [
    { name: "Fully Recover", count: fullyRecover },
    { name: "Partially Recover", count: partiallyRecover },
    { name: "Not Recover", count: notRecover }
  ];

  return (
    <MainLayout>
      <div className="doctor-dashboard">

        <h2 className="dashboard-title">Doctor Dashboard</h2>

        {/* CARDS */}
        <div className="card-container">

          <div className="card blue">
            <h3>Patients</h3>
            <p>{totalPatients}</p>
          </div>

          <div className="card green">
            <h3>Appointments</h3>
            <p>{totalAppointments}</p>
          </div>

          <div className="card yellow">
            <h3>Completed</h3>
            <p>{appointments.filter(a => a.status === "Completed").length}</p>
          </div>

          {/* 🚨 LIVE EMERGENCY CARD FIXED */}
          <div className="card red">
            <h3>Emergency</h3>
            <p>{totalEmergency}</p>
          </div>

        </div>

        {/* CHART */}
        <div className="chart-box">
          <h3>Patient Recovery Trends</h3>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, "auto"]} allowDecimals={false} />
                <Tooltip />
                <Legend />

                <Bar dataKey="count">
                  {chartData.map((entry, index) => {
                    let color = "#000";

                    if (entry.name === "Fully Recover") color = "#28a745";
                    if (entry.name === "Partially Recover") color = "#ffc107";
                    if (entry.name === "Not Recover") color = "#dc3545";

                    return <Cell key={index} fill={color} />;
                  })}
                </Bar>

              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

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

export default DoctorDashboard;