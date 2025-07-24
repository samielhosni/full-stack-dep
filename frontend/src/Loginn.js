import React, { useState } from "react";
import "./Loginn.css"; // Import the CSS file
 
const staticUsers = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "user", password: "user123", role: "user" },
];
 
function Loginn({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
 
  const handleSubmit = (e) => {
    e.preventDefault();
    const foundUser = staticUsers.find(
      (u) => u.username === username && u.password === password
    );
    if (foundUser) {
      onLogin(foundUser);
    } else {
      setError("Invalid username or password");
    }
  };
 
  return (
<div className="login-background">
<div className="login-container">
<h2 className="login-title">Login</h2>
<form onSubmit={handleSubmit} className="login-form">
<input
          type="text"
          placeholder="Username"
          className="login-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
<input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
<button type="submit" className="login-button">Login</button>
</form>
      {error && <p className="login-error">{error}</p>}
</div>
 </div>
  );
}
 
export default Loginn;