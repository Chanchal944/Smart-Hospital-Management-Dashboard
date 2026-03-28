import React, { useState, useEffect } from "react";
import MainLayout from "../Components/MainLayout";
import "../CSS/Pharmacy.css";

function Pharmacy() {

  const [medicines, setMedicines] = useState(() => {
    const stored = localStorage.getItem("medicines");
    return stored ? JSON.parse(stored) : [];
  });

  const [showForm, setShowForm] = useState(false);
  const [showSell, setShowSell] = useState(false);
  const [showRefill, setShowRefill] = useState(false);

  const [selectedMed, setSelectedMed] = useState(null);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    expiry: ""
  });

  const [sellData, setSellData] = useState({
    patient: "",
    quantity: ""
  });

  const [refillQty, setRefillQty] = useState("");

  // ✅ REAL DATA
  const defaultMedicines = [
    "Paracetamol","Crocin","Dolo 650","Azithromycin","Amoxicillin",
    "Ibuprofen","Cetirizine","Pantoprazole","Omeprazole","ORS",
    "Insulin","Metformin","Atorvastatin","Aspirin","Cough Syrup"
  ];

  const defaultCategories = [
    "Tablet","Capsule","Syrup","Injection","Drops",
    "Cream","Ointment","Powder","Inhaler"
  ];

  // ✅ MERGED DROPDOWN
  const uniqueNames = [
    ...new Set([...defaultMedicines, ...medicines.map(m => m.name)])
  ];

  const uniqueCategories = [
    ...new Set([...defaultCategories, ...medicines.map(m => m.category)])
  ];

  useEffect(() => {
    localStorage.setItem("medicines", JSON.stringify(medicines));
  }, [medicines]);

  const toggleForm = () => {
    setShowForm(!showForm);
    setFormData({
      name: "",
      category: "",
      price: "",
      quantity: "",
      expiry: ""
    });
  };

  // ✅ AUTO FILL PRICE + CATEGORY
  const handleChange = (e) => {
    const { name, value } = e.target;

    let updated = { ...formData, [name]: value };

    if (name === "name") {
      const found = medicines.find(m => m.name === value);
      if (found) {
        updated.price = found.price;
        updated.category = found.category;
      }
    }

    setFormData(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.quantity) {
      alert("Fill required fields!");
      return;
    }

    setMedicines([...medicines, formData]);
    toggleForm();
  };

  // ✅ EXPIRY ALERT
  const getExpiryStatus = (date) => {
    if (!date) return "";

    const today = new Date();
    const exp = new Date(date);
    const diff = (exp - today) / (1000 * 60 * 60 * 24);

    if (diff < 0) return "expired";
    if (diff <= 7) return "near-expiry";
    return "";
  };

  // SELL WITH GST
  const openSell = (med, index) => {
    setSelectedMed({ ...med, index });
    setShowSell(true);
  };

  const handleSell = () => {
    const qty = parseInt(sellData.quantity);

    if (!sellData.patient || !qty) {
      alert("Enter details!");
      return;
    }

    if (qty > selectedMed.quantity) {
      alert("Not enough stock!");
      return;
    }

    const updated = [...medicines];
    updated[selectedMed.index].quantity -= qty;
    setMedicines(updated);

    let bills = JSON.parse(localStorage.getItem("bills")) || [];

    const price = parseFloat(selectedMed.price);
    const baseTotal = qty * price;

    const gst = baseTotal * 0.18;
    const total = baseTotal + gst;

    const newBill = {
      id: "BILL" + Date.now(),
      patient: sellData.patient,
      items: [{
        medicine: selectedMed.name,
        qty,
        price,
        gst,
        total
      }],
      amount: total,
      paid: 0,
      pending: total,
      status: "Pending"
    };

    bills.push(newBill);
    localStorage.setItem("bills", JSON.stringify(bills));

    setShowSell(false);
    setSellData({ patient: "", quantity: "" });
  };

  const openRefill = (med, index) => {
    setSelectedMed({ ...med, index });
    setShowRefill(true);
  };

  const handleRefill = () => {
    const qty = parseInt(refillQty);
    if (!qty) return;

    const updated = [...medicines];
    updated[selectedMed.index].quantity += qty;

    setMedicines(updated);
    setShowRefill(false);
    setRefillQty("");
  };

  const handleDelete = (index) => {
    if (window.confirm("Delete medicine?")) {
      setMedicines(medicines.filter((_, i) => i !== index));
    }
  };

  const filtered = medicines.filter((med) =>
    med.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="pharmacy-page">

        <div className="pharmacy-header">
          <h1>Pharmacy Management</h1>
          <button className="add-btn" onClick={toggleForm}>
            + Add Medicine
          </button>
        </div>

        <input
          type="text"
          placeholder="Search Medicine..."
          className="search-bar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Expiry</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((med, index) => (
                <tr key={index} className={getExpiryStatus(med.expiry)}>
                  <td>{med.name}</td>
                  <td>{med.category}</td>
                  <td>₹{med.price}</td>
                  <td>{med.quantity}</td>
                  <td>{med.expiry}</td>

                  <td>{med.quantity <= 5 ? "Low" : "Available"}</td>

                  <td>
                    <button onClick={() => openSell(med, index)}>Sell</button>
                    <button onClick={() => openRefill(med, index)}>Refill</button>
                    <button onClick={() => handleDelete(index)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ADD MODAL */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-btn" onClick={toggleForm}>✖</button>

              <h2>Add Medicine</h2>

              <form onSubmit={handleSubmit}>

                <input list="names" name="name" value={formData.name} onChange={handleChange} placeholder="Medicine"/>
                <datalist id="names">
                  {uniqueNames.map((n,i)=><option key={i} value={n}/>)}
                </datalist>

                <input list="cats" name="category" value={formData.category} onChange={handleChange} placeholder="Category"/>
                <datalist id="cats">
                  {uniqueCategories.map((c,i)=><option key={i} value={c}/>)}
                </datalist>

                <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price"/>
                <input type="number" name="quantity" onChange={handleChange} placeholder="Stock"/>
                <input type="date" name="expiry" onChange={handleChange}/>

                <button className="submit-btn">Add</button>

              </form>
            </div>
          </div>
        )}

        {/* SELL */}
        {showSell && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-btn" onClick={()=>setShowSell(false)}>✖</button>

              <h2>Sell Medicine</h2>

              <input placeholder="Patient" value={sellData.patient}
                onChange={(e)=>setSellData({...sellData,patient:e.target.value})}/>

              <input type="number" placeholder="Qty" value={sellData.quantity}
                onChange={(e)=>setSellData({...sellData,quantity:e.target.value})}/>

              <button onClick={handleSell}>Sell (GST Included)</button>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
}

export default Pharmacy;