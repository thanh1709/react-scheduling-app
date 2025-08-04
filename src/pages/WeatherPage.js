
import React, { useState, useEffect } from 'react';
import apiClient from '../api/api'; // Import a pre-configured API client

function WeatherPage() {
  const [weatherData, setWeatherData] = useState(null); // State to store weather data
  const [loading, setLoading] = useState(true); // State to handle loading status
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    // Function to fetch weather data from the API
    const fetchWeather = async () => {
      try {
        // Make a GET request to the /WeatherForecast endpoint
        const response = await apiClient.get('/WeatherForecast');
        setWeatherData(response.data); // Store the received data in the state
      } catch (err) {
        // If an error occurs, save the error message
        setError(err.response?.data?.message || err.message);
      } finally {
        // Set loading to false once the request is complete
        setLoading(false);
      }
    };

    fetchWeather(); // Call the function to get the data
  }, []); // The empty dependency array ensures this effect runs only once

  return (
    <div style={{ padding: '20px' }}>
      <h1>Weather Forecast from API</h1>
      
      {/* Display loading status */}
      {loading && <p>Loading...</p>}
      
      {/* Display error message if any */}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      {/* Display weather data if available */}
      {weatherData && (
        <table style={{ marginTop: '20px', borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ padding: '10px', border: '1px solid black', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '10px', border: '1px solid black', textAlign: 'left' }}>Temp. (C)</th>
              <th style={{ padding: '10px', border: '1px solid black', textAlign: 'left' }}>Summary</th>
            </tr>
          </thead>
          <tbody>
            {weatherData.map((forecast, index) => (
              <tr key={index}>
                <td style={{ padding: '10px', border: '1px solid black' }}>{new Date(forecast.date).toLocaleDateString()}</td>
                <td style={{ padding: '10px', border: '1px solid black' }}>{forecast.temperatureC}</td>
                <td style={{ padding: '10px', border: '1px solid black' }}>{forecast.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default WeatherPage;
