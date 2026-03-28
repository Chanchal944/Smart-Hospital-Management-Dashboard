import React, { useState, useEffect } from "react";
import MainLayout from "../Components/MainLayout";
import "../CSS/LabTests.css";
import jsPDF from "jspdf";

function LabTests() {
  const [tests, setTests] = useState(() => {
    const stored = localStorage.getItem("labTests");
    return stored ? JSON.parse(stored) : [];
  });

  const [formData, setFormData] = useState({
    patientName: "",
    testName: "",
    date: "",
    status: "Pending",
  });

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    localStorage.setItem("labTests", JSON.stringify(tests));
  }, [tests]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ FIXED ADD + UPDATE (NO DUPLICATE HISTORY ISSUE)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.patientName || !formData.testName) {
      alert("Fill required fields");
      return;
    }

    if (editId !== null) {
      // ✅ UPDATE EXISTING ENTRY ONLY
      const updatedTests = tests.map((t) =>
        t.id === editId
          ? { ...t, ...formData, id: editId }
          : t
      );

      setTests(updatedTests);
      setEditId(null);
    } else {
      // ✅ ADD NEW ENTRY
      const newTest = {
        id: Date.now(),
        ...formData,
      };

      setTests([newTest, ...tests]);
    }

    // reset form
    setFormData({
      patientName: "",
      testName: "",
      date: "",
      status: "Pending",
    });
  };

  const handleEdit = (test) => {
    setFormData(test);
    setEditId(test.id);
  };

  const deleteTest = (id) => {
    setTests(tests.filter((t) => t.id !== id));
  };

  // PDF GENERATOR
  const generatePDF = (test) => {
    const doc = new jsPDF();

    const isCompleted = test.status === "Completed";
    const val = (v) => (isCompleted ? v : "N/A");

    doc.setFontSize(18);
    doc.setTextColor(0, 102, 204);
    doc.text("Smart Hospital Management Lab", 20, 20);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("Address: Nagpur, Maharashtra", 20, 26);

    doc.line(20, 35, 190, 35);

    doc.setFontSize(14);
    doc.text("Patient Details", 20, 45);

    doc.setFontSize(11);
    doc.text(`Name: ${test.patientName}`, 20, 55);
    doc.text(`Date: ${test.date}`, 120, 55);
    doc.text(`Test: ${test.testName}`, 20, 62);
    doc.text(`Status: ${test.status}`, 120, 62);

    doc.line(20, 68, 190, 68);

    doc.setFontSize(14);
    doc.text("Test Report", 20, 80);

    doc.setFontSize(11);
    doc.text("Parameter", 20, 90);
    doc.text("Result", 80, 90);
    doc.text("Normal Range", 130, 90);

    doc.line(20, 92, 190, 92);

    let y = 100;

    const addRow = (p, r, n) => {
      doc.text(p, 20, y);
      doc.text(r, 80, y);
      doc.text(n, 130, y);
      y += 10;
    };

    if (test.testName === "Blood Test") {
      addRow("Hemoglobin", val("13.5 g/dL"), "13 - 17");
      addRow("WBC Count", val("6000 /µL"), "4000 - 11000");
      addRow("Platelets", val("2.5 Lakh"), "1.5 - 4.5 Lakh");
    } else if (test.testName === "Diabetes Test") {
      addRow("Fasting Sugar", val("95 mg/dL"), "70 - 100");
      addRow("Post Meal", val("120 mg/dL"), "<140");
    } else if (test.testName === "Urine Test") {
      addRow("Color", val("Yellow"), "Normal");
      addRow("pH", val("6.0"), "4.5 - 8");
    } else {
      addRow("Result", val("Normal"), "N/A");
    }

    doc.line(20, y + 5, 190, y + 5);

    doc.text("Doctor Signature", 140, y + 20);
    doc.text("Dr. Amit Sharma", 140, y + 30);

    doc.save(`${test.patientName}_Lab_Report.pdf`);
  };

  const filteredTests = tests.filter((t) => {
    const matchSearch =
      t.patientName.toLowerCase().includes(search.toLowerCase()) ||
      t.testName.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      filterStatus === "All" || t.status === filterStatus;

    return matchSearch && matchStatus;
  });

  return (
    <MainLayout>
      <div className="lab-container">

        <h2 className="title">🧪 Lab Dashboard</h2>

        <div className="cards">
          <div className="card total">Total: {tests.length}</div>
          <div className="card pending">
            Pending: {tests.filter((t) => t.status === "Pending").length}
          </div>
          <div className="card completed">
            Completed: {tests.filter((t) => t.status === "Completed").length}
          </div>
        </div>

        {/* FORM */}
        <form className="lab-form" onSubmit={handleSubmit}>
          <input
            name="patientName"
            placeholder="Patient Name"
            value={formData.patientName}
            onChange={handleChange}
          />

          <select
            name="testName"
            value={formData.testName}
            onChange={handleChange}
          >
            <option value="">Select Test</option>
            <option>Blood Test</option>
            <option>Urine Test</option>
            <option>X-Ray</option>
            <option>Diabetes Test</option>
          </select>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option>Pending</option>
            <option>Completed</option>
          </select>

          <button type="submit">
            {editId ? "Update Test" : "Add Test"}
          </button>
        </form>

        {/* FILTER */}
        <div className="filters">
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select onChange={(e) => setFilterStatus(e.target.value)}>
            <option>All</option>
            <option>Pending</option>
            <option>Completed</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="table-wrapper">
          <table className="lab-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Test</th>
                <th>Date</th>
                <th>Status</th>
                <th>Report</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredTests.map((t) => (
                <tr key={t.id}>
                  <td>{t.patientName}</td>
                  <td>{t.testName}</td>
                  <td>{t.date}</td>

                  <td>
                    <span className={`status ${t.status.toLowerCase()}`}>
                      {t.status}
                    </span>
                  </td>

                  <td>
                    <button onClick={() => generatePDF(t)}>
                      Download
                    </button>
                  </td>

                  <td>
                    <button onClick={() => handleEdit(t)}>
                      Edit
                    </button>

                    <button
                      className="delete"
                      onClick={() => deleteTest(t.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </MainLayout>
  );
}

export default LabTests;