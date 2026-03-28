import React, { useState, useEffect } from "react";
import MainLayout from "../Components/MainLayout";
import "../CSS/Notifications.css";

function NotificationsSystem() {

  const [notifications, setNotifications] = useState(() => {
    const data = localStorage.getItem("notifications");
    return data ? JSON.parse(data) : [];
  });

  // 🔥 Track deleted notifications
  const [deletedRefs, setDeletedRefs] = useState(() => {
    const data = localStorage.getItem("deletedNotifications");
    return data ? JSON.parse(data) : [];
  });

  const [activeTab, setActiveTab] = useState("all");

  // 💾 Save notifications
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  // 💾 Save deleted refs
  useEffect(() => {
    localStorage.setItem("deletedNotifications", JSON.stringify(deletedRefs));
  }, [deletedRefs]);

  // 🔄 AUTO FETCH
  useEffect(() => {

    const loadExternalData = () => {

      const appointments =
        JSON.parse(localStorage.getItem("appointments")) || [];

      const emergencies =
        JSON.parse(localStorage.getItem("emergencyCases")) || [];

      setNotifications((prev) => {
        let updated = [...prev];
        let newAdded = false;

        // 📅 Appointment
        appointments.forEach((a) => {
          const alreadyDeleted = deletedRefs.find(
            (d) => d.refId === a.id && d.type === "appointment"
          );

          const exists = updated.find(
            (n) => n.refId === a.id && n.type === "appointment"
          );

          if (!exists && !alreadyDeleted) {
            updated.unshift({
              id: Date.now() + Math.random(),
              refId: a.id,
              type: "appointment",
              title: "Appointment Scheduled",
              message: `${a.name || "Patient"} | Dr. ${a.doctor || "N/A"} | ${a.date || ""} ${a.time || ""}`,
              time: new Date().toLocaleTimeString(),
              read: false,
            });
            newAdded = true;
          }
        });

        // 🚨 Emergency
        emergencies.forEach((e) => {
          const alreadyDeleted = deletedRefs.find(
            (d) => d.refId === e.id && d.type === "emergency"
          );

          const exists = updated.find(
            (n) => n.refId === e.id && n.type === "emergency"
          );

          if (!exists && !alreadyDeleted) {
            updated.unshift({
              id: Date.now() + Math.random(),
              refId: e.id,
              type: "emergency",
              title: "🚨 Emergency Alert",
              message: `${e.patient} | ${e.issue} | ${e.priority?.toUpperCase()}`,
              time: e.time || new Date().toLocaleTimeString(),
              read: false,
            });

            const audio = new Audio("/alert.mp3");
            audio.play();

            newAdded = true;
          }
        });

        return newAdded ? updated : prev;
      });
    };

    loadExternalData();

    const interval = setInterval(loadExternalData, 2000);

    return () => clearInterval(interval);

  }, [deletedRefs]);

  // ✅ Mark as Read
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // ❌ DELETE (FINAL FIX)
  const deleteNotification = (id) => {
    setNotifications((prev) => {
      const toDelete = prev.find((n) => n.id === id);

      if (toDelete) {
        setDeletedRefs((prevDeleted) => [
          ...prevDeleted,
          { refId: toDelete.refId, type: toDelete.type },
        ]);
      }

      const updated = prev.filter((n) => n.id !== id);
      localStorage.setItem("notifications", JSON.stringify(updated));

      return updated;
    });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered =
    activeTab === "all"
      ? notifications
      : notifications.filter((n) => n.type === activeTab);

  return (
    <MainLayout>
      <div className="notifications-container">

        <div className="top-bar">
          <h2>
            <span className="alert-icon">🔔</span> Notifications
          </h2>

          <div className="bell">
            🔔
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={activeTab === "all" ? "active" : ""}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>

          <button
            className={activeTab === "appointment" ? "active" : ""}
            onClick={() => setActiveTab("appointment")}
          >
            Appointment
          </button>

          <button
            className={activeTab === "emergency" ? "active" : ""}
            onClick={() => setActiveTab("emergency")}
          >
            Emergency
          </button>
        </div>

        {/* List */}
        <div className="notification-list">
          {filtered.length === 0 ? (
            <p className="no-data">No notifications</p>
          ) : (
            filtered.map((n) => (
              <div
                key={n.id}
                className={`notification-card ${n.read ? "read" : "unread"} ${
                  n.type === "emergency" ? "emergency" : ""
                }`}
              >
                <div>
                  <h4>{n.title}</h4>

                  <p style={{ whiteSpace: "pre-line" }}>
                    {n.message.replaceAll("|", "\n")}
                  </p>

                  <span>{n.time}</span>
                </div>

                <div className="actions">
                  {!n.read && (
                    <button
                      className="read"
                      onClick={() => markAsRead(n.id)}
                    >
                      Read
                    </button>
                  )}

                  <button
                    className="delete"
                    onClick={() => deleteNotification(n.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </MainLayout>
  );
}

export default NotificationsSystem;