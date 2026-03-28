import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "../CSS/Layout.css";

function MainLayout({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // 🔔 Load notifications count
  const loadNotifications = () => {
    const data = JSON.parse(localStorage.getItem("notifications")) || [];
    const unread = data.filter((n) => !n.read).length;
    setUnreadCount(unread);
  };

  useEffect(() => {
    loadNotifications();

    // 🔄 auto update
    const interval = setInterval(loadNotifications, 1000);

    window.addEventListener("storage", loadNotifications);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", loadNotifications);
    };
  }, []);

  return (
    <div className="layout">

      {/* Sidebar */}
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className={`main-content ${isOpen ? "open" : "closed"}`}>
        
        {/* 🔔 Pass unreadCount */}
        <Navbar unreadCount={unreadCount} />

        <div className="content-area">{children}</div>
      </div>

    </div>
  );
}

export default MainLayout;