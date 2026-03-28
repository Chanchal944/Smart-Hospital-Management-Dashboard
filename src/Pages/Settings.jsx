import React, { useState, useEffect } from "react";
import MainLayout from "../Components/MainLayout";
import "../CSS/Settings.css";

function Settings() {
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  // 👤 Profile State
  const [profile, setProfile] = useState({
    name: name || "",
    email: localStorage.getItem("email") || "",
    role: role || "",
    avatar: localStorage.getItem("avatar") || "",
  });

  // 📜 History
  const [history, setHistory] = useState([]);
  const [showAllHistory, setShowAllHistory] = useState(false);

  // 🌙 Theme
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // =========================
  // HISTORY LOAD
  // =========================
  useEffect(() => {
    const allHistory = JSON.parse(localStorage.getItem("loginHistory")) || [];

    if (role === "admin") {
      setHistory(allHistory);
    } else {
      setHistory(allHistory.filter((h) => h.name === name));
    }
  }, [role, name]);

  // =========================
  // THEME APPLY
  // =========================
  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // =========================
  // 🚀 LIVE NAVBAR UPDATE FUNCTION
  // =========================
  const updateNavbarLive = (updatedProfile) => {
    window.dispatchEvent(
      new CustomEvent("profileUpdated", {
        detail: updatedProfile,
      })
    );
  };

  // =========================
  // 💾 SAVE PROFILE
  // =========================
  const handleSave = () => {
    localStorage.setItem("name", profile.name);
    localStorage.setItem("email", profile.email);
    localStorage.setItem("role", profile.role);
    localStorage.setItem("avatar", profile.avatar);

    // 🔥 LIVE UPDATE NAVBAR
    updateNavbarLive(profile);

    alert("Profile updated successfully!");
  };

  // =========================
  // 🖼️ AVATAR CHANGE
  // =========================
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const updatedProfile = {
        ...profile,
        avatar: reader.result,
      };

      setProfile(updatedProfile);

      // 🔥 SAVE + LIVE UPDATE IMMEDIATELY
      localStorage.setItem("avatar", reader.result);
      updateNavbarLive(updatedProfile);
    };

    if (file) reader.readAsDataURL(file);
  };

  // =========================
  // 🗑️ DELETE HISTORY ITEM
  // =========================
  const deleteHistoryItem = (index) => {
    const allHistory = JSON.parse(localStorage.getItem("loginHistory")) || [];

    const updated =
      role === "admin"
        ? allHistory.filter((_, i) => i !== index)
        : allHistory.filter((h) => h.name !== name || allHistory.indexOf(h) !== index);

    localStorage.setItem("loginHistory", JSON.stringify(updated));

    setHistory(
      role === "admin"
        ? updated
        : updated.filter((h) => h.name === name)
    );
  };

  // =========================
  // 🧹 CLEAR HISTORY
  // =========================
  const clearHistory = () => {
    let allHistory = JSON.parse(localStorage.getItem("loginHistory")) || [];

    if (role === "admin") {
      localStorage.removeItem("loginHistory");
      setHistory([]);
    } else {
      allHistory = allHistory.filter((h) => h.name !== name);
      localStorage.setItem("loginHistory", JSON.stringify(allHistory));
      setHistory([]);
    }
  };

  const visibleHistory = showAllHistory ? history : history.slice(0, 2);

  return (
    <MainLayout>
      <div className="settings-container">

        <h2 className="settings-title">⚙️ Settings</h2>

        {/* 👤 PROFILE */}
        <div className="settings-card profile-card">
          <h3>My Profile</h3>

          {/* Avatar */}
          <div className="avatar-box">
            {profile.avatar && (
              <img src={profile.avatar} alt="avatar" className="avatar" />
            )}
            <input type="file" onChange={handleAvatarChange} />
          </div>

          <input
            type="text"
            value={profile.name}
            onChange={(e) =>
              setProfile({ ...profile, name: e.target.value })
            }
          />

          <input
            type="email"
            value={profile.email}
            onChange={(e) =>
              setProfile({ ...profile, email: e.target.value })
            }
          />

          <select
            value={profile.role}
            onChange={(e) =>
              setProfile({ ...profile, role: e.target.value })
            }
          >
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="receptionist">Receptionist</option>
          </select>

          <button className="save-btn" onClick={handleSave}>
            Save Changes
          </button>
        </div>

        {/* 📜 HISTORY */}
        <div className="settings-card">
          <h3>Login History</h3>

          <button
            className="toggle-history"
            onClick={() => setShowAllHistory(!showAllHistory)}
          >
            {showAllHistory ? "Show Recent" : "View All"}
          </button>

          <button className="delete-all" onClick={clearHistory}>
            Clear History
          </button>

          {history.length === 0 ? (
            <p>No history</p>
          ) : (
            <div className="history-list">
              {visibleHistory.map((h, i) => (
                <div key={i} className="history-item">
                  <div>
                    <p>
                      <b>{h.name}</b> ({h.role})
                    </p>
                    <span>{h.time}</span>
                  </div>

                  <button
                    className="delete-btn"
                    onClick={() => deleteHistoryItem(i)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🌙 THEME */}
        <div className="settings-card">
          <h3>Appearance</h3>

          <label className="switch">
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={toggleTheme}
            />
            <span className="slider"></span>
          </label>
        </div>

      </div>
    </MainLayout>
  );
}

export default Settings;