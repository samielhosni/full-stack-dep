// App.js
import React, { useEffect, useState } from "react";
import "./App.css";
import hpeLogo from "./assets/hpe-logo-with-back.png";

function App({ user, mode, onLogout }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [bannedUsers, setBannedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("all");

  const harmfulWords = ["badword1", "badword2", "spamword"];
  const containsHarmfulWord = (text) =>
    harmfulWords.some((word) => text.toLowerCase().includes(word));

  // Fetch chat history when user changes
  useEffect(() => {
    if (user) {
fetch(`http://localhost:8083/chat-history/${user.username}`)
        .then((res) => res.json())
        .then((data) => setChatHistory(data))
        .catch((err) => console.error("Failed to fetch history", err));
    }
  }, [user]);

  // Example admin requests and banned users
  useEffect(() => {
    if (mode === "admin") {
      const initialRequests = [
        { id: 1, sender: "user1", content: "Hello!", timestamp: new Date() },
        { id: 2, sender: "assistant", content: "Hi! How can I assist you?", timestamp: new Date() },
        { id: 3, sender: "user1", content: "This is a badword1 message.", timestamp: new Date() },
      ];
      setRequests(initialRequests);
      const usersToBan = [
        ...new Set(
          initialRequests
            .filter((r) => r.sender !== "assistant" && containsHarmfulWord(r.content))
            .map((r) => r.sender)
        ),
      ];
      setBannedUsers(usersToBan);
    }
  }, [mode]);

  const toggleBanUser = (sender) => {
    setBannedUsers((prev) =>
      prev.includes(sender) ? prev.filter((u) => u !== sender) : [...prev, sender]
    );
  };

  // Submit question (for user mode)
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("http://localhost:5000/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: question }),
    });

    const data = await res.json();
    console.log("AI Response full:", data);

    if (data.response) {
      setAnswer(data.response);
    } else {
      setAnswer("No response from AI");
    }

  } catch (err) {
    console.error("Fetch/JSON Error:", err);
    setAnswer("Failed to get response from AI assistant.");
  }
};




  if (mode === "user") {
    return (
      <div className="App">
        <img src={hpeLogo} alt="HPE Logo" className="logo" />
        <h1 style={{fontFamily: "monospace"}}>AI Assistant</h1>

        <div style={{ display: "flex" }}>
          <div className="sidebar">
            <h3>Chat History</h3>
            <ul>
              {chatHistory.map((msg, index) => (
                <li key={index}>
                  <strong>{msg.sender}:</strong> {msg.content}
                  <br />
                  <small>{new Date(msg.timestamp).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ flexGrow: 1, paddingLeft: "20px" }}>
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
          </div>
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
    const uniqueSenders = [...new Set(requests.map((r) => r.sender))].filter(
      (s) => s !== "assistant"
    );
    const filteredRequests =
      selectedUser === "all"
        ? requests
        : requests.filter((r) => r.sender === selectedUser);

    return (
      <div className="container">
        <img src={hpeLogo} alt="HPE Logo" className="hpe-logo" />
        <h1>Backoffice - Chat Requests</h1>

        <div>
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

        <div className="logout-btn-container">
          <button className="logout-btn" onClick={onLogout}>
            Log out
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default App;