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
  const [username, setUsername] = useState(null);

  const harmfulWords = ["badword1", "badword2", "spamword"];
  const containsHarmfulWord = (text) =>
    harmfulWords.some((word) => text.toLowerCase().includes(word));



  const chatPairs = [];
  if (chatHistory.length > 0) {
    for (let i = 0; i < chatHistory.length - 1; i++) {
      if (
        chatHistory[i].sender !== "assistant" &&
        chatHistory[i + 1] &&
        chatHistory[i + 1].sender === "assistant"
      ) {
        chatPairs.push({
          question: chatHistory[i].content,
          answer: chatHistory[i + 1].content,
        });
      }
    }
  }

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("http://localhost:8083/chat-history/all");
        const data = await response.json();
        setChatHistory(data); // Set full chat history from DB
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchMessages = async () => {
        try {
          const response = await fetch("http://localhost:8083/chat-history/all");
          const data = await response.json();
          setChatHistory(data);
        } catch (error) {
          console.error("Error fetching chat history:", error);
        }
      };

      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    if (mode === "admin") {
      const initialRequests = [
        { id: 1, sender: "user1", content: "Hello!", timestamp: new Date() },
        {
          id: 2,
          sender: "assistant",
          content: "Hi! How can I assist you?",
          timestamp: new Date(),
        },
        {
          id: 3,
          sender: "user1",
          content: "This is a badword1 message.",
          timestamp: new Date(),
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
    }
  }, [mode]);

  const toggleBanUser = (sender) => {
    setBannedUsers((prev) =>
      prev.includes(sender) ? prev.filter((u) => u !== sender) : [...prev, sender]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveAnswerToDB(question, username); // Save user message to DB

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
        await saveAnswerToDB(data.response, "ASSISTANT"); // Save assistant message to DB
      } else {
        setAnswer("No response from AI");
      }
    } catch (err) {
      console.error("Fetch/JSON Error:", err);
      setAnswer("Failed to get response from AI assistant.");
    }

    setQuestion(""); // Clear input after submission
  };

      useEffect(() => {
    const storedUser = localStorage.getItem("username");
    setUsername(storedUser);  // store username in state for use in handleSubmit
  }, []);

const saveAnswerToDB = async (text, sender) => {
  try {
    const response = await fetch("http://localhost:8083/chat-history/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Important!
      },
      body: JSON.stringify({
        content: text,
        sender: sender, // This must be a string like "sami" or "assistant"
      }),
    });

    if (!response.ok) {
      console.error("Failed to save chat message:", await response.text());
    }
  } catch (err) {
    console.error("Error saving message to DB:", err);
  }
};


  if (mode === "user") {
    return (
      <div className="App">
        <img src={hpeLogo} alt="HPE Logo" className="logo" />
        <h1 style={{ fontFamily: "monospace" }}> AI ASSISTANT </h1>

        <div style={{ display: "flex" }}>
          <div className="sidebar">
            <h3>Chat History</h3>
            <ul>
              {[...chatHistory].reverse().map((msg, index) => (
                <li key={index}>
                  <strong>{msg.sender || "USER"}:</strong> {msg.content}
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
