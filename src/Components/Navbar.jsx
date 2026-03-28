import React, { useState, useEffect } from "react";
import "../CSS/Navbar.css";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [showProfile, setShowProfile] = useState(false);
  const [search, setSearch] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const [profileImage, setProfileImage] = useState("");

  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  // 🔔 Notifications
  const loadNotifications = () => {
    const data = JSON.parse(localStorage.getItem("notifications")) || [];
    const unread = data.filter((n) => !n.read).length;
    setUnreadCount(unread);
  };

  // 👤 Profile image load
  const loadProfile = () => {
    setProfileImage(localStorage.getItem("avatar") || "");
  };

  useEffect(() => {
    loadNotifications();
    loadProfile();

    const interval = setInterval(loadNotifications, 1000);

    // ⭐ LIVE PROFILE UPDATE LISTENER
    const handleProfileUpdate = () => {
      loadProfile();
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);
    window.addEventListener("storage", loadProfile);

    return () => {
      clearInterval(interval);
      window.removeEventListener("profileUpdated", handleProfileUpdate);
      window.removeEventListener("storage", loadProfile);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/";
  };

  return (
    <div className="navbar">

      {/* LEFT */}
      <div className="nav-left">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            className="search-box"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="nav-right">

        {/* 🔔 Bell */}
        <div
          className="bell-container"
          onClick={() => navigate("/notifications")}
        >
          <span className="bell-icon">🔔</span>
          {unreadCount > 0 && (
            <span className="badge">{unreadCount}</span>
          )}
        </div>

        {/* PROFILE (LIVE IMAGE) */}
        <div
          className="profile"
          onClick={() => setShowProfile(!showProfile)}
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt="profile"
              className="profile-img"
            />
          ) : (
            <FaUserCircle className="profile-icon" />
          )}

          <span className="role-text">{role}</span>
        </div>

        {showProfile && (
          <div className="dropdown">
            <p onClick={() => (window.location.href = "/settings")}>
              My Profile
            </p>
            <p onClick={handleLogout}>Logout</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default Navbar;