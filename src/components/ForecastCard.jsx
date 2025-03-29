const ForecastCard = ({ forecast, darkMode }) => {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">5-Day Forecast</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {forecast.list.slice(0, 5).map((item, index) => (
          <div key={index} className={`p-4 rounded-lg shadow-md transition-all duration-300
              ${darkMode ? "bg-gray-800 text-white" : "bg-blue-100 text-black"} 
              min-w-[120px] flex flex-col items-center`}>
            <p className="font-semibold">{new Date(item.dt * 1000).toLocaleDateString()}</p>
            <p className="text-lg">{Math.round(item.main.temp)}°C</p>
            <img
              src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
              alt="weather icon"
              className="w-16 h-16"
            />
            <p className="text-sm">{item.weather[0].description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};


export default ForecastCard;