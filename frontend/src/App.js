import React, { useEffect, useState } from "react";
import "./App.css";
import hpeLogo from "./assets/hpe-logo.png";
// .env 
const API_URL = process.env.REACT_APP_API_URL;

function App({ mode, onLogout }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [requests, setRequests] = useState([]);
  const [bannedUsers, setBannedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("all");

  const harmfulWords = ["badword1", "badword2", "spamword"];

  const containsHarmfulWord = (text) => {
    const lowerText = text.toLowerCase();
    return harmfulWords.some((word) => lowerText.includes(word));
  };

  useEffect(() => {
    const initialRequests = [
      {
        id: 1,
        sender: "user1",
        content: "Hello!",
        timestamp: new Date("2025-07-21T10:00:00"),
      },
      {
        id: 2,
        sender: "assistant",
        content: "Hi! How can I assist you?",
        timestamp: new Date("2025-07-21T10:01:00"),
      },
      {
        id: 3,
        sender: "user1",
        content: "This is a badword1 message.",
        timestamp: new Date("2025-07-21T10:02:00"),
      },
      {
        id: 4,
        sender: "user2",
        content: "Hey! You are spamword!",
        timestamp: new Date("2025-07-21T10:03:00"),
      },
      {
        id: 5,
        sender: "user3",
        content: "Something’s not working.",
        timestamp: new Date("2025-07-21T10:04:00"),
      },
    ];
    setRequests(initialRequests);

    const usersToBan = [
      ...new Set(
        initialRequests
          .filter(
            (r) => r.sender !== "assistant" && containsHarmfulWord(r.content)
          )
          .map((r) => r.sender)
      ),
    ];
    setBannedUsers(usersToBan);
  }, []);

  const toggleBanUser = (sender) => {
    setBannedUsers((prev) =>
      prev.includes(sender) ? prev.filter((u) => u !== sender) : [...prev, sender]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: question }),
      });
      const data = await res.json();
      console.log("Raw API response:", data); 
      setAnswer(data.response);
    } catch (err) {
      setAnswer("Failed to get response from AI assistant.");
    }
  };

  const uniqueSenders = [...new Set(requests.map((r) => r.sender))].filter(
    (s) => s !== "assistant"
  );
  const filteredRequests =
    selectedUser === "all"
      ? requests
      : requests.filter((r) => r.sender === selectedUser);

  if (mode === "user") {
    return (
      <div className="App">
        <img src={hpeLogo} alt="HPE Logo" className="logo" />
        <h1>AI Assistant</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question..."
            required
          />
          <button type="submit">Ask</button>
        </form>
        <div className="answer-box">
          {answer && (
            <>
              <h3>Answer:</h3>
              <p>{answer}</p>
            </>
          )}
        </div>
        <div className="logout-btn-container">
        <button className="logout-btn" onClick={onLogout}>
             Log out
        </button>
</div>
      </div>
    );
  }

  if (mode === "admin") {
    return (
      <div className="container">
        <div className="logo-container">
          <img
            src={hpeLogo}
            alt="Hewlett Packard Enterprise Logo"
            className="hpe-logo"
          />
        </div>

        <h1>Backoffice - Chat Requests</h1>

        <div className="filter">
          <label>
            <strong>Filter by user:</strong>
          </label>
          <select
            onChange={(e) => setSelectedUser(e.target.value)}
            value={selectedUser}
          >
            <option value="all">All users</option>
            {uniqueSenders.map((sender) => (
              <option key={sender} value={sender}>
                {sender}
              </option>
            ))}
          </select>
        </div>

        <div className="table">
          {filteredRequests.map((r) => {
            const isBanned = bannedUsers.includes(r.sender);
            const isHarmful = containsHarmfulWord(r.content);

            return (
              <div
                key={r.id}
                className={`row ${isBanned ? "banned-row" : ""} ${
                  isHarmful ? "harmful-row" : ""
                }`}
              >
                <div>
                  <strong>#{r.id}</strong>
                </div>
                <div>
                  <strong>{r.sender}</strong>: {r.content}{" "}
                  {isHarmful && (
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      ⚠️ Harmful content
                    </span>
                  )}
                </div>
                <div>{new Date(r.timestamp).toLocaleString()}</div>
                {r.sender !== "assistant" && (
                  <div>
                    <button
                      onClick={() => toggleBanUser(r.sender)}
                      className={isBanned ? "unban" : "ban"}
                    >
                      {isBanned ? "Unban" : "Ban"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="banned">
          🔒 <strong>Banned Users:</strong>{" "}
          {bannedUsers.length > 0 ? bannedUsers.join(", ") : "None"}
        </div>

        <button style={{ marginTop: "20px" }} onClick={onLogout}>
          Déconnexion
        </button>
      </div>
    );
  }

  return null;
}

export default App;
