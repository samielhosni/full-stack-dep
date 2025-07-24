import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Loginn from "./Loginn";
import App from "./App";

function Root() {
  const [userRole, setUserRole] = useState(null); // null, "admin", or "user"

  return (
    <Router>
      <Routes>
        {/* Login route */}
        <Route
          path="/login"
          element={<LoginWrapper onLogin={(role) => setUserRole(role)} />}
        />

        {/* Admin protected route */}
        <Route
          path="/admin"
          element={
            userRole === "admin" ? (
              <App mode="admin" onLogout={() => setUserRole(null)} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* User protected route */}
        <Route
          path="/user"
          element={
            userRole === "user" ? (
              <App mode="user" onLogout={() => setUserRole(null)} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

// Wrapper for Loginn to handle navigation after login
function LoginWrapper({ onLogin }) {
  const navigate = useNavigate();

  const handleLogin = (foundUser) => {
    onLogin(foundUser.role);
    if (foundUser.role === "admin") {
      navigate("/admin", { replace: true });
    } else if (foundUser.role === "user") {
      navigate("/user", { replace: true });
    }
  };

  return <Loginn onLogin={handleLogin} />;
}

export default Root;
