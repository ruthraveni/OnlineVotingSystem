import React, { useState } from "react";
import "./App.css"; 
 const API_URL = "http://localhost:5000/api";

const candidates = [
  { id: 1, name: "ADMK", vision: "Better Education & Jobs", symbol: "🌿🌿" },
  { id: 2, name: "DMK", vision: "Healthcare & Development", symbol: "🌞" },
  { id: 3, name: "TVK", vision: "Clean Energy & Environment", symbol: "🐘" },
  { id: 4, name: "NOTA", vision: "None of the Above", symbol: "🚫" },
];

function App() {
  const [page, setPage] = useState("home");
  const [form, setForm] = useState({ aadhaar: "", name: "", password: "" });
  const [loginForm, setLoginForm] = useState({ aadhaar: "", password: "" });
  const [user, setUser] = useState(null);
  const [votes, setVotes] = useState(
    candidates.map((c) => ({ ...c, votes: 0 }))
  ); 
  const getUsers = () => JSON.parse(localStorage.getItem("users")) || [];
  const saveUsers = (users) =>
    localStorage.setItem("users", JSON.stringify(users));
  const handleRegister = () => {
    if (!form.aadhaar || !form.name || !form.password) {
      alert("Please fill Aadhaar, Name and Password!");
      return;
    }
    let users = getUsers();
    const exists = users.find((u) => u.aadhaar === form.aadhaar);
    if (exists) {
      alert("❌ Aadhaar already registered! Please login.");
      setPage("login");
      return;
    }
    users.push({ ...form, votedCandidate: null });
    saveUsers(users);
    alert("✅ Registered Successfully! Please Login.");
    setPage("login");
  };

  const handleLogin = () => {
    const users = getUsers();
    const found = users.find(
      (u) =>
        u.aadhaar === loginForm.aadhaar && u.password === loginForm.password
    );
    if (!found) {
      alert("❌ Invalid Aadhaar or Password");
      return;
    }
    setUser(found);
    setPage("dashboard");
  };
  const handleVote = (candidate) => {
    let users = getUsers();
    const index = users.findIndex((u) => u.aadhaar === user.aadhaar);

    if (users[index].votedCandidate) {
      alert("❌ You already voted!");
      return;
    }
    users[index].votedCandidate = candidate.name;
    saveUsers(users);
    setUser(users[index]);
    const updatedVotes = votes.map((c) =>
      c.id === candidate.id ? { ...c, votes: c.votes + 1 } : c
    );
    setVotes(updatedVotes);

    alert(`✅ You voted for ${candidate.name}`);
  };

  const handleLogout = () => {
    setUser(null);
    setPage("home");
  };

  const totalVotes = votes.reduce((sum, c) => sum + c.votes, 0);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "Arial",
        backgroundImage:
          "url(https://media.kasperskydaily.com/wp-content/uploads/sites/92/2020/10/16044143/M187_Digital-voting-header.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 style={{ textAlign: "center", color: "white" }}>
        🗳️ Online Voting System
      </h1>

      {/* Home Page */}
      {page === "home" && (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <button
            onClick={() => setPage("register")}
            style={{ margin: "10px", padding: "10px 20px" }}
          >
            Register
          </button>
          <button
            onClick={() => setPage("login")}
            style={{ margin: "10px", padding: "10px 20px" }}
          >
            Login
          </button>
        </div>
      )}

      {/* Register Page */}
      {page === "register" && (
        <div
          style={{
            maxWidth: "350px",
            margin: "40px auto",
            padding: "20px",
            border: "2px solid pink",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.9)",
          }}
        >
          <h2 style={{ textAlign: "center" }}>Register</h2>
          <input
            type="text"
            placeholder="Aadhaar Number"
            value={form.aadhaar}
            onChange={(e) => setForm({ ...form, aadhaar: e.target.value })}
          />
          <br />
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <br />
          <button onClick={handleRegister} style={{ marginTop: "10px" }}>
            Register
          </button>
          <p style={{ textAlign: "center" }}>
            Already registered?{" "}
            <button onClick={() => setPage("login")}>Login</button>
          </p>
        </div>
      )}

      {/* Login Page */}
      {page === "login" && (
        <div
          style={{
            maxWidth: "350px",
            margin: "40px auto",
            padding: "20px",
            border: "2px solid pink",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.9)",
          }}
        >
          <h2 style={{ textAlign: "center" }}>Login</h2>
          <input
            type="text"
            placeholder="Aadhaar Number"
            value={loginForm.aadhaar}
            onChange={(e) =>
              setLoginForm({ ...loginForm, aadhaar: e.target.value })
            }
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm({ ...loginForm, password: e.target.value })
            }
          />
          <br />
          <button onClick={handleLogin} style={{ marginTop: "10px" }}>
            Login
          </button>
          <p style={{ textAlign: "center" }}>
            New user?{" "}
            <button onClick={() => setPage("register")}>Register</button>
          </p>
        </div>
      )}

      {/* Dashboard */}
      {page === "dashboard" && user && (
        <div
          style={{
            maxWidth: "600px",
            margin: "20px auto",
            padding: "20px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.95)",
          }}
        >
          <h2>Welcome, {user.name}</h2>
          <p>Aadhaar: XXXX-XXXX-{user.aadhaar.slice(-4)}</p>
          <h3>Election 2025</h3>

          {/* Voting / Already Voted */}
          {user.votedCandidate ? (
            <p>
              ✅ You already voted for <b>{user.votedCandidate}</b>
            </p>
          ) : (
            <div>
              <p>Cast your vote:</p>
              {candidates.map((c) => (
                <div
                  key={c.id}
                  style={{
                    border: "1px solid gray",
                    margin: "10px",
                    padding: "10px",
                    borderRadius: "10px",
                    background: "#f9f9f9",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "40px", marginBottom: "8px" }}>
                    {c.symbol}
                  </div>
                  <h3>{c.name}</h3>
                  <p>{c.vision}</p>
                  <button onClick={() => handleVote(c)}>Vote</button>
                </div>
              ))}
            </div>
          )}

          {/* Live Results */}
          <h3 style={{ marginTop: "20px" }}>📊 Live Results</h3>
          {votes.map((c) => {
            const percentage =
              totalVotes > 0 ? ((c.votes / totalVotes) * 100).toFixed(0) : 0;
            return (
              <div key={c.id} style={{ marginBottom: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: "bold",
                  }}
                >
                  <span>
                    {c.symbol} {c.name}
                  </span>
                  <span>
                    {c.votes} votes ({percentage}%)
                  </span>
                </div>
                <div
                  style={{
                    height: "10px",
                    background: "#e9ecef",
                    borderRadius: "5px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${percentage}%`,
                      background: "#007bff",
                      height: "100%",
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
          <p style={{ textAlign: "right" }}>Total votes: {totalVotes}</p>

          <button onClick={handleLogout} style={{ marginTop: "15px" }}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
