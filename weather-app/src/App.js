import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [city, setCity] = useState(null);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(null);
  const fetchWeather = async (event) => {
    event.preventDefault();
    const options = {
      method: 'GET',
      url: 'https://yahoo-weather5.p.rapidapi.com/weather',
      params: {
        location: city,
        format: 'json',
        u: 'f',
      },
      headers: {
        'X-RapidAPI-Key': 'cd51ca3772msh12684712c5ec13bp12e369jsn82c055ee8bfd',
        'X-RapidAPI-Host': 'yahoo-weather5.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      const weatherData = response.data;

      // Convert temperature from Fahrenheit to Celsius
      const tempFahrenheit =
        weatherData.current_observation.condition.temperature;
      const tempCelsius = (tempFahrenheit - 32) * (5 / 9);

      console.log(tempCelsius);

      weatherData.current_observation.condition.temperature = tempCelsius;
      setWeather(weatherData);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch weather data');
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`App ${isDarkMode ? 'dark' : 'light'}`}>
      <header className="App-header">
        <h1>Weather App</h1>
        <button onClick={toggleTheme}>
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        <form onSubmit={fetchWeather}>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter City Name"
          ></input>
          <button type="submit">Get Weather</button>
        </form>
        {/* <button onClick={fetchWeather}>Get Weather for Firozabad</button> */}
        {error && <p>{error}</p>}
      </header>
      <div className="container">
        <div className="sidebar">
          {weather && (
            <div className="weather-info">
              <h2>
                {weather.location.city}, {weather.location.country}
              </h2>
              <p>{weather.current_observation.condition.text}</p>
              <p>
                Temperature: {weather.current_observation.condition.temperature}
                °C
              </p>{' '}
              {/* Temperature in Celsius */}
              <p>
                Humidity: {weather.current_observation.atmosphere.humidity}%
              </p>
              <p>Wind Speed: {weather.current_observation.wind.speed} km/h</p>
              <p>
                Pressure: {weather.current_observation.atmosphere.pressure} hPa
              </p>
            </div>
          )}
        </div>
        <div className="forecast-section">
          {weather && weather.forecasts && weather.forecasts.length > 0 && (
            <div className="forecast">
              <h2>10-Day Forecast</h2>
              <div className="forecast-grid">
                {weather.forecasts.slice(0, 10).map((forecast, index) => (
                  <div key={index} className="forecast-day">
                    <p>
                      {forecast.day}: {forecast.high}°F / {forecast.low}°F
                    </p>
                    <p>{forecast.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default App;
