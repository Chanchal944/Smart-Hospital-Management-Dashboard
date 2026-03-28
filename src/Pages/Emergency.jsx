import React, { useState, useEffect } from "react";
import MainLayout from "../Components/MainLayout";
import "../CSS/Emergency.css";

function Emergency() {
  const [cases, setCases] = useState(() => {
    const data = localStorage.getItem("emergencyCases");
    return data ? JSON.parse(data) : [];
  });

  const [form, setForm] = useState({
    patient: "",
    issue: "",
    priority: "critical",
  });

  const [editId, setEditId] = useState(null);

  // 💾 Save to localStorage
  useEffect(() => {
    localStorage.setItem("emergencyCases", JSON.stringify(cases));
  }, [cases]);

  // ➕ Add / Update
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.patient || !form.issue) return;

    if (editId) {
      const updated = cases.map((c) =>
        c.id === editId ? { ...c, ...form } : c
      );
      setCases(updated);
      setEditId(null);
    } else {
      const newCase = {
        id: Date.now(),
        ...form,
        time: new Date().toLocaleTimeString(),
      };
      setCases([newCase, ...cases]);
    }

    setForm({ patient: "", issue: "", priority: "critical" });
  };

  // ✏️ Edit
  const handleEdit = (c) => {
    setForm({
      patient: c.patient,
      issue: c.issue,
      priority: c.priority,
    });
    setEditId(c.id);
  };

  // ❌ Delete
  const handleDelete = (id) => {
    setCases(cases.filter((c) => c.id !== id));
  };

  return (
    <MainLayout>
      <div className="emergency-container">
        
        {/* 🚨 Title */}
        <h2 className="emergency-title">
          <span className="alert-icon">🚨</span> Emergency Management
        </h2>

        {/* 📝 FORM */}
        <form onSubmit={handleSubmit} className="emergency-form">
          <input
            type="text"
            placeholder="Patient Name"
            value={form.patient}
            onChange={(e) =>
              setForm({ ...form, patient: e.target.value })
            }
          />

          {/* 🏥 Condition Dropdown */}
          <select
            value={form.issue}
            onChange={(e) =>
              setForm({ ...form, issue: e.target.value })
            }
          >
            <option value="">Select Condition</option>
            <option>Heart Attack</option>
            <option>Accident Trauma</option>
            <option>Stroke</option>
            <option>Breathing Problem</option>
            <option>Burn Injury</option>
            <option>Fracture</option>
            <option>Poisoning</option>
            <option>Severe Bleeding</option>
          </select>

          {/* Priority */}
          <select
            value={form.priority}
            onChange={(e) =>
              setForm({ ...form, priority: e.target.value })
            }
          >
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
          </select>

          <button type="submit" className="add-btn">
            {editId ? "Update Case" : "Add Case"}
          </button>
        </form>

        {/* 📋 LIST */}
        <div className="cases-list">
          {cases.length === 0 ? (
            <p className="no-data">No emergency cases</p>
          ) : (
            cases.map((c) => (
              <div key={c.id} className="case-card">
                <div className="case-info">
                  <h4>{c.patient}</h4>
                  <p>{c.issue}</p>
                  <span>{c.time}</span>
                </div>

                {/* 🔥 Priority */}
                <div className={`priority ${c.priority}`}>
                  {c.priority.toUpperCase()}
                </div>

                {/* Actions */}
                <div className="actions">
                  <button className="edit" onClick={() => handleEdit(c)}>
                    Edit
                  </button>
                  <button
                    className="delete"
                    onClick={() => handleDelete(c.id)}
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

export default Emergency;