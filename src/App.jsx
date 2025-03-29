import { useState, useEffect } from "react";
import axios from "axios";
import { FaSyncAlt, FaBars, FaTimes } from "react-icons/fa";
import Search from "./components/Search";
import WeatherCard from "./components/WeatherCard";
import CircularLoader from "./components/CircularLoader";
import ErrorMessage from "./components/ErrorMessage";
import ForecastCard from "./components/ForecastCard";

const API_KEY = "b7acb6335813e39d5e3757e953cd5c5b";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("weatherHistory")) || [];
    setHistory(savedHistory);
  }, []);

  const fetchWeather = async (searchCity) => {
    if (!searchCity) {
      setError("Please enter a city before refreshing.");
      return;
    }
    setLoading(true);
    setError("");
    setWeather(null);
    setForecast(null);

    try {
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${API_KEY}&units=metric`
      );
      setWeather(weatherResponse.data);
      setCity(searchCity);
      fetchForecast(searchCity);
      updateHistory(searchCity);
    } catch (err) {
      setError(err.response?.status === 404 ? "City not found." : "API error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchForecast = async (searchCity) => {
    try {
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${searchCity}&appid=${API_KEY}&units=metric`
      );
      setForecast(forecastResponse.data);
    } catch (err) {
      console.error("Forecast API Error:", err);
    }
  };

  const updateHistory = (searchCity) => {
    let updatedHistory = [searchCity, ...history.filter((c) => c !== searchCity)].slice(0, 5);
    setHistory(updatedHistory);
    localStorage.setItem("weatherHistory", JSON.stringify(updatedHistory));
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center p-5 ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-r from-blue-500 to-purple-600 text-white"}`}>
      <button onClick={toggleTheme} className="absolute top-4 right-4 px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg transition duration-300">
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      <h1 className="text-5xl font-extrabold mb-6 font-serif drop-shadow-lg">Weather Dashboard</h1>

      <div className="flex flex-col lg:flex-row w-full max-w-5xl gap-6">
        {/* Left Side - Search and History */}
        <div className="w-full lg:w-1/3 p-4 bg-white text-black rounded-lg shadow-lg">
          <Search city={city} setCity={setCity} fetchWeather={fetchWeather} />
          <button onClick={() => fetchWeather(city)} className="w-full mt-4 px-5 py-3 rounded bg-yellow-500 hover:bg-yellow-600 text-white flex items-center justify-center transition duration-300 shadow-lg">
            <FaSyncAlt className="mr-2" /> Refresh
          </button>

          {history.length > 0 && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Recent Searches</h2>
              <div className="flex gap-2 flex-wrap">
                {history.map((c, index) => (
                  <button key={index} onClick={() => fetchWeather(c)} className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-white transition duration-300 shadow-md">
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Forecast and Weather Info */}
        <div className="w-full lg:w-2/3 p-4 bg-white text-black rounded-lg shadow-lg">
          {loading && <CircularLoader />}
          {error && <ErrorMessage message={error} />}
          {weather && !error && <WeatherCard weather={weather} darkMode={darkMode} />}
          {forecast && !error && <ForecastCard forecast={forecast} darkMode={darkMode} />}
        </div>
      </div>
    </div>
  );
}

export default App;
