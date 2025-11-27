import { useState } from "react";

function Login({ onClose, onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    fetch("http://localhost:9194/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.text())
      .then((token) => {
        if (token.includes("Invalid")) {
          setError("Invalid username or password!");
        } else {
          localStorage.setItem("token", token);
          onSuccess();
          onClose();
        }
      })
      .catch(() => setError("Login failed! Server error."));
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.box}>
        <h2 style={{ marginBottom: "20px" }}>Admin Login</h2>

        <input
          style={styles.input}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.loginButton} onClick={handleLogin}>
          Login
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button style={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  box: {
    background: "white",
    padding: "30px",
    width: "350px",
    borderRadius: "10px",
    textAlign: "center",
  },
  input: {
    width: "90%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "5px",
    border: "1px solid #aaa",
  },
  loginButton: {
    marginTop: "15px",
    padding: "10px 20px",
    width: "60%",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  closeButton: {
    marginTop: "10px",
    background: "transparent",
    border: "none",
    color: "#555",
    cursor: "pointer",
  },
};

export default Login;
