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

  try {
    const res = await fetch("http://localhost:8083/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      setError("Invalid credentials");
      return;
    }

    const user = await res.json();
    localStorage.setItem("user", JSON.stringify(user));
    onLogin(user);

    if (user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/user");
    }

  } catch (err) {
    console.error("Login error:", err);
    setError("Login failed");
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
