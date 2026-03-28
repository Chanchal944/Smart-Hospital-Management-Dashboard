import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Login.css";
import logo from "../assets/Image/Logo_English.png";
import bgImage from "../assets/Image/Login-img.jpg";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "admin",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔐 VALIDATION FUNCTION
  const validateForm = () => {
    const { username, password } = formData;

    // Username: min 3 chars
    if (username.trim().length < 3) {
      return "Username must be at least 3 characters";
    }

    // Password: strong validation
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&]).{6,}$/;

    if (!passwordRegex.test(password)) {
      return "Password must contain 1 uppercase, 1 number, 1 special character";
    }

    return null;
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    // ✅ STORE USER DATA (My Profile)
    localStorage.setItem("name", formData.username);
    localStorage.setItem("email", formData.username + "@mail.com"); // demo
    localStorage.setItem("role", formData.role);

    // ✅ LOGIN FLAG
    localStorage.setItem("isLoggedIn", "true");

    // ✅ LOGIN HISTORY
    const loginUser = {
      name: formData.username,
      role: formData.role,
      time: new Date().toLocaleString(),
    };

    const history =
      JSON.parse(localStorage.getItem("loginHistory")) || [];

    history.unshift(loginUser);

    localStorage.setItem("loginHistory", JSON.stringify(history));

    // ✅ REDIRECT
    if (formData.role === "admin") navigate("/admin-dashboard");
    else if (formData.role === "doctor") navigate("/doctor-dashboard");
    else navigate("/reception-dashboard");
  };

  return (
    <div className="main-container">

      {/* LEFT PANEL */}
      <div
        className="left-panel"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="overlay">
          <img src={logo} alt="logo" className="logo" />
          <h1 className="project-title">Smart Hospital</h1>
          <p>Management System Dashboard</p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        <div className="login-box">
          <h3 className="text-center mb-4">Login</h3>

          <form onSubmit={handleLogin}>

            {/* Username */}
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter Username"
              className="form-control mb-3"
              onChange={handleChange}
            />

            {/* Password */}
            <label className="form-label">Password</label>
            <div className="password-wrapper mb-3">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter Password"
                className="form-control"
                onChange={handleChange}
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>

            {/* 🔴 ERROR MESSAGE */}
            {error && (
              <p style={{ color: "red", fontSize: "14px" }}>
                {error}
              </p>
            )}

            {/* Role */}
            <label className="form-label">Login As</label>
            <select
              name="role"
              className="form-select mb-4"
              onChange={handleChange}
            >
              <option value="admin">Admin</option>
              <option value="doctor">Doctor</option>
              <option value="receptionist">Receptionist</option>
            </select>

            <button className="btn btn-primary w-100 login-btn">
              Login
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;