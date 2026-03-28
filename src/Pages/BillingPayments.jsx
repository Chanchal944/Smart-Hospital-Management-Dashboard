import React, { useState, useEffect } from "react";
import MainLayout from "../Components/MainLayout";
import "../CSS/BillingPayments.css";

function BillingPayments() {

  const safeNumber = (val) => Number(val || 0);

  const [bills, setBills] = useState(() => {
    const stored = localStorage.getItem("bills");
    return stored ? JSON.parse(stored) : [];
  });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [formData, setFormData] = useState({
    patient: "",
    amount: "",
    paid: "",
    payNow: ""
  });

  useEffect(() => {
    localStorage.setItem("bills", JSON.stringify(bills));
  }, [bills]);

  const toggleForm = () => {
    setShowForm(!showForm);
    setEditingId(null);
    setFormData({
      patient: "",
      amount: "",
      paid: "",
      payNow: ""
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // EDIT
  const handleEdit = (bill) => {
    setFormData({
      patient: bill.patient,
      amount: bill.amount,
      paid: bill.paid,
      payNow: ""
    });
    setEditingId(bill.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this bill?")) {
      const updated = bills.filter((b) => b.id !== id);
      setBills(updated);
    }
  };

  // SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.patient || !formData.amount) {
      alert("Fill required fields!");
      return;
    }

    let totalAmount = 0;
    let gst = 0;

    // NEW BILL
    if (!editingId) {
      const baseAmount = safeNumber(formData.amount);
      gst = baseAmount * 0.18;
      totalAmount = baseAmount + gst;
    } else {
      const existingBill = bills.find((b) => b.id === editingId);
      totalAmount = existingBill.amount;
      gst = existingBill.gst;
    }

    let paid = safeNumber(formData.paid);
    const payNow = safeNumber(formData.payNow);

    const remaining = totalAmount - paid;

    if (payNow > remaining) {
      alert("You can only pay remaining amount!");
      return;
    }

    let totalPaid = editingId ? paid + payNow : paid;

    const pending = totalAmount - totalPaid;

    let status = "Pending";
    if (totalPaid === 0) status = "Pending";
    else if (totalPaid < totalAmount) status = "Partial";
    else status = "Paid";

    const updatedBill = {
      id: editingId || "BILL" + Date.now(),
      patient: formData.patient,
      amount: totalAmount,
      gst: gst,
      paid: totalPaid,
      pending: pending,
      status: status
    };

    if (editingId) {
      const updatedList = bills.map((b) =>
        b.id === editingId ? updatedBill : b
      );
      setBills(updatedList);
    } else {
      setBills([...bills, updatedBill]);
    }

    toggleForm();
  };

  const filteredBills = bills.filter((bill) => {
    const matchSearch = bill.patient
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchFilter =
      filterStatus === "All" || bill.status === filterStatus;

    return matchSearch && matchFilter;
  });

  return (
    <MainLayout>
      <div className="billing-page">

        {/* HEADER */}
        <div className="billing-header">
          <h1>Billing & Payments</h1>
          <button className="add-btn" onClick={toggleForm}>
            + Generate Bill
          </button>
        </div>

        {/* CONTROLS */}
        <div className="billing-controls">
          <input
            type="text"
            placeholder="Search Patient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option>All</option>
            <option>Paid</option>
            <option>Pending</option>
            <option>Partial</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Total (₹)</th>
                <th>Paid (₹)</th>
                <th>Pending (₹)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan="6">No bills found</td>
                </tr>
              ) : (
                filteredBills.map((bill) => (
                  <tr key={bill.id}>
                    <td>{bill.patient}</td>
                    <td>₹{safeNumber(bill.amount).toFixed(2)}</td>
                    <td>₹{safeNumber(bill.paid).toFixed(2)}</td>
                    <td>₹{safeNumber(bill.pending).toFixed(2)}</td>

                    <td>
                      <span className={`status ${bill.status.toLowerCase()}`}>
                        {bill.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(bill)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(bill.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* FORM */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-btn" onClick={toggleForm}>✖</button>

              <h2>{editingId ? "Update Payment" : "Generate Bill"}</h2>

              <form onSubmit={handleSubmit}>

                <div className="form-group">
                  <label>Patient*</label>
                  <input
                    name="patient"
                    value={formData.patient}
                    onChange={handleChange}
                    disabled={editingId}
                  />
                </div>

                <div className="form-group">
                  <label>Amount*</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    disabled={editingId}
                  />
                </div>

                {/* ✅ GST PREVIEW */}
                {!editingId && formData.amount && (
                  <>
                    <div className="form-group">
                      <label>GST (18%)</label>
                      <input
                        value={(safeNumber(formData.amount) * 0.18).toFixed(2)}
                        disabled
                      />
                    </div>

                    <div className="form-group">
                      <label>Total Amount (Incl. GST)</label>
                      <input
                        value={(
                          safeNumber(formData.amount) +
                          safeNumber(formData.amount) * 0.18
                        ).toFixed(2)}
                        disabled
                      />
                    </div>
                  </>
                )}

                {editingId && (
                  <>
                    <div className="form-group">
                      <label>Already Paid</label>
                      <input value={formData.paid} disabled />
                    </div>

                    <div className="form-group">
                      <label>Remaining Amount</label>
                      <input
                        value={(
                          safeNumber(formData.amount) -
                          safeNumber(formData.paid)
                        ).toFixed(2)}
                        disabled
                      />
                    </div>

                    <div className="form-group">
                      <label>Pay Now</label>
                      <input
                        type="number"
                        name="payNow"
                        value={formData.payNow}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}

                {!editingId && (
                  <div className="form-group">
                    <label>Initial Paid</label>
                    <input
                      type="number"
                      name="paid"
                      value={formData.paid}
                      onChange={handleChange}
                    />
                  </div>
                )}

                <button className="submit-btn">
                  {editingId ? "Pay & Update" : "Save Bill"}
                </button>

              </form>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
}

export default BillingPayments;