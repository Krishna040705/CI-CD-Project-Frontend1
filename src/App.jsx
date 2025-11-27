import React, { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const handleSearch = () => {
    if (!city) return;

    setLoading(true);
    setWeather(null);
    setError(null);

    fetch(`http://localhost:9194/api/weather/${city}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("City not found or server error.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Weather API response:", data);
        setWeather(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("An error occurred during fetch:", error);
        setError(error.message);
        setLoading(false);
      });
  };

  return (
    <div className="app-container">

      {/* 🔵 SIMPLE MARQUEE (NO CSS CHANGE OUTSIDE APP.JSX) */}
      <marquee
        style={{
          background: "grey",
          padding: "8px",
          fontWeight: "bold",
          position: "fixed",
          top: 0,
          width: "100vw",
          zIndex: 10
        }}
      >
        🌦️ Welcome to KL Weather — Stay updated with live temperature, humidity & conditions 🌤️
      </marquee>

      {/* 🔵 TOP RIGHT ADMIN LOGIN */}
      <div style={{ position: "absolute", top: "50px", right: "20px" }}>
        {!localStorage.getItem("token") ? (
          <button
            onClick={() => setShowLogin(true)}
            style={{
              padding: "8px 16px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px"
            }}
          >
            Admin Login
          </button>
        ) : (
          <p
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "green",
              marginRight: "10px"
            }}
          >
            Namaskaram Owner 🙏
          </p>
        )}
      </div>

      {/* WEATHER SECTION */}
      <div className="weather-section" style={{ marginTop: "80px" }}>
        <h1>Welcome to KL Weather</h1>

        <div className="search-bar">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
          />

          {/* 🔵 SEARCH BUTTON WITH YOUR EXACT SAME STYLE */}
          <button
            onClick={handleSearch}
            disabled={loading}
            style={{
              padding: "12px 26px",
              border: "none",
              borderRadius: "40px",
              background: "linear-gradient(to right, #9ef7ff, #fde1ae)",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
              color: "#0d2b4a"
            }}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {weather && (
          <div className="weather-card">
            <h2>{weather.name}</h2>

            {weather.weatherIcon && (
              <img
                className="weather-icon"
                src={`http://openweathermap.org/img/wn/${weather.weatherIcon}@2x.png`}
                alt={weather.weatherDescription}
              />
            )}

            <p className="temperature">{Math.round(weather.temperature)}°C</p>
            <p className="description">
              {weather.weatherMain} - {weather.weatherDescription}
            </p>

            <div className="details-grid">
              <div className="detail-box">
                <span>Feels Like</span>
                <strong>{Math.round(weather.feelsLike)}°C</strong>
              </div>
              <div className="detail-box">
                <span>Min Temp</span>
                <strong>{Math.round(weather.tempMin)}°C</strong>
              </div>
              <div className="detail-box">
                <span>Max Temp</span>
                <strong>{Math.round(weather.tempMax)}°C</strong>
              </div>
              <div className="detail-box">
                <span>Pressure</span>
                <strong>{weather.pressure} hPa</strong>
              </div>
              <div className="detail-box">
                <span>Humidity</span>
                <strong>{weather.humidity}%</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* LOGIN POPUP */}
      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </div>
  );
}

/* LOGIN POPUP COMPONENT */
function Login({ onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();

    fetch("http://localhost:9194/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.text())
      .then((data) => {
        if (data.includes("Invalid")) {
          setError("Invalid username or password!");
          return;
        }

        localStorage.setItem("token", data);
        alert("Admin logged in successfully!");
        onClose();
        window.location.reload();
      })
      .catch(() => setError("Login failed"));
  };

  return (
    <div
      className="login-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="login-box"
        style={{
          width: "300px",
          padding: "20px",
          background: "black",
          borderRadius: "10px",
          border: "1px solid #ccc",
          textAlign: "center",
        }}
      >
        <h2>Admin Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "90%",
              padding: "10px",
              margin: "10px 0",
              borderRadius: "5px",
            }}
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "90%",
              padding: "10px",
              margin: "10px 0",
              borderRadius: "5px",
            }}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit" style={{ marginTop: "10px" }}>
            Login
          </button>
        </form>

        <button
          className="close-btn"
          onClick={onClose}
          style={{
            marginTop: "10px",
            padding: "10px",
            background: "#ff4d4d",
            borderRadius: "5px",
            color: "white",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default App;
