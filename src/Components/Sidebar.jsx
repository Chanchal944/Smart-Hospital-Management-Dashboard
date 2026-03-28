import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../CSS/Sidebar.css";
import logo from "../assets/Image/Logo_English.png";

import {
  FaTachometerAlt,
  FaUserInjured,
  FaUserMd,
  FaCalendarCheck,
  FaBed,
  FaFileInvoiceDollar,
  FaPills,
  FaFlask,
  FaUsers,
  FaBell,
  FaCog,
} from "react-icons/fa";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [role, setRole] = useState(localStorage.getItem("role"));
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  const handleLinkClick = (path) => {
    // ✅ ONLY NAVIGATE (NO LOGIN BLOCK)
    navigate(path);

    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const getDashboardPath = () => {
    if (role === "admin") return "/admin-dashboard";
    if (role === "doctor") return "/doctor-dashboard";
    if (role === "receptionist") return "/reception-dashboard";
    return "/";
  };

  return (
    <>
      {/* TOGGLE BUTTON */}
      <button className="toggle-btn" onClick={toggleSidebar}>
        ☰
      </button>

      {/* SIDEBAR */}
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>

        {/* HEADER */}
        <div className="sidebar-header">
          <img src={logo} alt="logo" />
          {isOpen && <h4>Smart HMS</h4>}
        </div>

        <ul>

          {/* DASHBOARD */}
          <li onClick={() => handleLinkClick(getDashboardPath())}>
            <div className="menu-link">
              <FaTachometerAlt />
              {isOpen && <span>Dashboard</span>}
            </div>
          </li>

          {/* ================= ADMIN ================= */}
          {role === "admin" && (
            <>
              <li onClick={() => handleLinkClick("/patients")}>
                <div className="menu-link">
                  <FaUserInjured />
                  {isOpen && <span>Patient Management</span>}
                </div>
              </li>

              <li onClick={() => handleLinkClick("/doctors")}>
                <div className="menu-link">
                  <FaUserMd />
                  {isOpen && <span>Doctor Management</span>}
                </div>
              </li>

              <li onClick={() => handleLinkClick("/appointments")}>
                <div className="menu-link">
                  <FaCalendarCheck />
                  {isOpen && <span>Appointments</span>}
                </div>
              </li>

              <li onClick={() => handleLinkClick("/beds")}>
                <div className="menu-link">
                  <FaBed />
                  {isOpen && <span>Bed Management</span>}
                </div>
              </li>

              <li onClick={() => handleLinkClick("/billing")}>
                <div className="menu-link">
                  <FaFileInvoiceDollar />
                  {isOpen && <span>Billing & Payments</span>}
                </div>
              </li>

              <li onClick={() => handleLinkClick("/pharmacy")}>
                <div className="menu-link">
                  <FaPills />
                  {isOpen && <span>Pharmacy</span>}
                </div>
              </li>

              <li onClick={() => handleLinkClick("/lab-tests")}>
                <div className="menu-link">
                  <FaFlask />
                  {isOpen && <span>Lab Tests</span>}
                </div>
              </li>

              <li onClick={() => handleLinkClick("/staff")}>
                <div className="menu-link">
                  <FaUsers />
                  {isOpen && <span>Staff Management</span>}
                </div>
              </li>

              <li onClick={() => handleLinkClick("/emergency")}>
                <div className="menu-link">
                  <span style={{ color: "red" }}>🚨</span>
                  {isOpen && <span>Emergency Alerts</span>}
                </div>
              </li>

              <li onClick={() => handleLinkClick("/notifications")}>
                <div className="menu-link">
                  <FaBell />
                  {isOpen && <span>Notifications</span>}
                </div>
              </li>

              {/* ✅ SETTINGS FIXED */}
              <li onClick={() => handleLinkClick("/settings")}>
                <div className="menu-link">
                  <FaCog />
                  {isOpen && <span>Settings</span>}
                </div>
              </li>
            </>
          )}

          {/* ================= DOCTOR ================= */}
          {role === "doctor" && (
            <>
              {/* ✅ Assigned Patients FIXED */}
              <li onClick={() => handleLinkClick("/patients")}>
                <div className="menu-link">
                  <FaUserInjured />
                  {isOpen && <span>Assigned Patients</span>}
                </div>
              </li>

              <li onClick={() => handleLinkClick("/appointments")}>
                <div className="menu-link">
                  <FaCalendarCheck />
                  {isOpen && <span>Appointments</span>}
                </div>
              </li>

              <li onClick={() => handleLinkClick("/lab-tests")}>
                <div className="menu-link">
                  <FaFlask />
                  {isOpen && <span>Lab Tests</span>}
                </div>
              </li>

              <li onClick={() => handleLinkClick("/emergency")}>
                <div className="menu-link">
                  <span style={{ color: "red" }}>🚨</span>
                  {isOpen && <span>Emergency Cases</span>}
                </div>
              </li>

              {/* ✅ SETTINGS FIXED */}
              <li onClick={() => handleLinkClick("/settings")}>
                <div className="menu-link">
                  <FaCog />
                  {isOpen && <span>Settings</span>}
                </div>
              </li>
            </>
          )}

          {/* ================= RECEPTIONIST ================= */}
          {role === "receptionist" && (
            <>
              <li onClick={() => handleLinkClick("/patients")}>
                <div className="menu-link">
                  <FaUserInjured />
                  {isOpen && <span>Patient Registration</span>}
                </div>
              </li>

              <li onClick={() => handleLinkClick("/appointments")}>
                <div className="menu-link">
                  <FaCalendarCheck />
                  {isOpen && <span>Appointment Scheduling</span>}
                </div>
              </li>

              <li onClick={() => handleLinkClick("/beds")}>
                <div className="menu-link">
                  <FaBed />
                  {isOpen && <span>Bed Availability</span>}
                </div>
              </li>

              <li onClick={() => handleLinkClick("/billing")}>
                <div className="menu-link">
                  <FaFileInvoiceDollar />
                  {isOpen && <span>Billing</span>}
                </div>
              </li>

              <li onClick={() => handleLinkClick("/notifications")}>
                <div className="menu-link">
                  <FaBell />
                  {isOpen && <span>Notifications</span>}
                </div>
              </li>
            </>
          )}

        </ul>
      </div>
    </>
  );
}

export default Sidebar;