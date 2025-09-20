import React, { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = () => {
    if (!city) return;

    setLoading(true);
    setWeather(null);
    setError(null);

// CORRECT - Use a relative path
fetch(`/api/weather/${city}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('City not found or server error.');
        }
        return response.json();
      })
      .then(data => {
        console.log("Weather API response:", data);
        setWeather(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("An error occurred during fetch:", error);
        setError(error.message);
        setLoading(false);
      });
  };

  return (
    <div className="app-container">
      <div className="weather-section">
        <h1>Welcome to KL Weather </h1>
        <div className="search-bar">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
          />
          <button onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {weather && (
          <div className="weather-card">
            <h2>{weather.name}</h2>

            {/* Weather Icon */}
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
    </div>
  );
}

export default App;

