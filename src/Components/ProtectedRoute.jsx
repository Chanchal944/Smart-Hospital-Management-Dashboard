import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {
  const role = localStorage.getItem("role");
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  // ❌ Not logged in → redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  // ❌ No role found
  if (!role) {
    return <Navigate to="/" />;
  }

  // ✅ Multiple roles support
  if (Array.isArray(allowedRole)) {
    if (!allowedRole.includes(role)) {
      return <Navigate to="/" />;
    }
  } 
  // ✅ Single role support
  else {
    if (role !== allowedRole) {
      return <Navigate to="/" />;
    }
  }

  // ✅ Authorized → show page
  return children;
}

export default ProtectedRoute;