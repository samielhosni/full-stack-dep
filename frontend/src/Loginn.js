import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Loginn.css";
import logo from "./assets/hpe-logo-with-back.png";

const Loginn = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please fill in both fields");
      return;
    }

    // Simulate auth API response
    const response = {
      username,
      role: username === "admin" ? "admin" : "user",
      id: username === "admin" ? 1 : 2, // example ID
    };

    // Save user to localStorage
    localStorage.setItem("user", JSON.stringify(response));
    onLogin(response);

    if (response.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/user");
    }
  };

  return (
    <div className="login-background">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo-image" />
      </div>
      <div className="login-container">
        <h2 className="login-title">Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="login-input"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="login-input"
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Loginn;
