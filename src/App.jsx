import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Protected Route
import ProtectedRoute from "./Components/ProtectedRoute";

// Pages
import Login from "./Pages/Login";
import AdminDashboard from "./Pages/AdminDashboard";
import DoctorDashboard from "./Pages/DoctorDashboard";
import ReceptionistDashboard from "./Pages/ReceptionistDashboard";

import PatientManagement from "./Pages/PatientManagement";
import DoctorManagement from "./Pages/DoctorManagement";
import Appointments from "./Pages/Appointments";
import BedManagement from "./Pages/BedManagement";
import BillingPayments from "./Pages/BillingPayments";
import Pharmacy from "./Pages/Pharmacy";
import LabTests from "./Pages/LabTests";
import StaffManagement from "./Pages/StaffManagement";
import Emergency from "./Pages/Emergency";
import Notifications from "./Pages/Notifications";
import Settings from "./Pages/Settings";

function App() {
  return (
    <Router>
      <Routes>

        {/* ================= LOGIN FIX ================= */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRole={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctors"
          element={
            <ProtectedRoute allowedRole={["admin"]}>
              <DoctorManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRole={["admin"]}>
              <StaffManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRole={["admin", "doctor", "receptionist"]}>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pharmacy"
          element={
            <ProtectedRoute allowedRole={["admin"]}>
              <Pharmacy />
            </ProtectedRoute>
          }
        />

        {/* ================= DOCTOR ================= */}
        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute allowedRole={["doctor"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= RECEPTIONIST ================= */}
        <Route
          path="/reception-dashboard"
          element={
            <ProtectedRoute allowedRole={["receptionist"]}>
              <ReceptionistDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= COMMON ACCESS ================= */}
        <Route
          path="/patients"
          element={
            <ProtectedRoute allowedRole={["admin", "receptionist", "doctor"]}>
              <PatientManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/beds"
          element={
            <ProtectedRoute allowedRole={["admin", "receptionist"]}>
              <BedManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/billing"
          element={
            <ProtectedRoute allowedRole={["admin", "receptionist"]}>
              <BillingPayments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute allowedRole={["admin", "receptionist"]}>
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <ProtectedRoute allowedRole={["admin", "doctor", "receptionist"]}>
              <Appointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lab-tests"
          element={
            <ProtectedRoute allowedRole={["admin", "doctor"]}>
              <LabTests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/emergency"
          element={
            <ProtectedRoute allowedRole={["admin", "doctor"]}>
              <Emergency />
            </ProtectedRoute>
          }
        />

        {/* ================= FALLBACK FIX ================= */}
        <Route path="*" element={<Login />} />

      </Routes>
    </Router>
  );
}

export default App;