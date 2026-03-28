import React, { useEffect, useState } from "react";
import MainLayout from "../Components/MainLayout";
import "../CSS/AdminDashboard.css";

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

function AdminDashboard() {

  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [emergencyCount, setEmergencyCount] = useState(0);

  // ✅ LOAD ALL DATA (REAL-TIME)
  useEffect(() => {
    const loadData = () => {
      const storedPatients = localStorage.getItem("patients");
      const storedAppointments = localStorage.getItem("appointments");
      const storedEmergency = localStorage.getItem("emergencyCases");

      setPatients(storedPatients ? JSON.parse(storedPatients) : []);
      setAppointments(storedAppointments ? JSON.parse(storedAppointments) : []);
      setEmergencyCount(
        storedEmergency ? JSON.parse(storedEmergency).length : 0
      );
    };

    // Initial load
    loadData();

    // 🔄 Real-time sync (same tab + other tabs)
    const interval = setInterval(loadData, 1000); // refresh every second

    window.addEventListener("storage", loadData);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", loadData);
    };
  }, []);

  // ✅ COUNTS
  const totalPatients = patients.length;
  const totalAppointments = appointments.length;

  const fullyRecover = patients.filter(
    (p) => p.recoveryStatus === "Fully Recover"
  ).length;

  const partiallyRecover = patients.filter(
    (p) => p.recoveryStatus === "Partially Recover"
  ).length;

  const notRecover = patients.filter(
    (p) => p.recoveryStatus === "Not Recover"
  ).length;

  // ✅ CHART DATA
  const chartData = [
    { name: "Fully Recover", count: fullyRecover },
    { name: "Partially Recover", count: partiallyRecover },
    { name: "Not Recover", count: notRecover }
  ];

  return (
    <MainLayout>
      <div className="dashboard-container">

        <h2 className="dashboard-title">Admin Dashboard</h2>

        {/* 🔥 CARDS */}
        <div className="card-container">

          <div className="card blue">
            <h3>Patients</h3>
            <p>{totalPatients}</p>
          </div>

          <div className="card green">
            <h3>Beds</h3>
            <p>80</p>
          </div>

          <div className="card yellow">
            <h3>Appointments</h3>
            <p>{totalAppointments}</p>
          </div>

          <div className="card red">
            <h3> Emergency</h3>
            <p>{emergencyCount}</p> {/* ✅ LIVE */}
          </div>

        </div>

        {/* 📊 BAR CHART */}
        <div className="chart-box">
          <h3>Patient Trends</h3>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />
                <YAxis domain={[1, "auto"]} allowDecimals={false} />

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

      {/* FOOTER */}
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

export default AdminDashboard;