import React, { useState, useEffect } from "react";
import { Sun, Cloud, CloudRain, Snowflake } from "lucide-react";
import { useWeatherQuery } from "@/app/hooks/weatherQueryHook";

const WeatherHeader: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expanded, setExpanded] = useState(false);
  const [selectedDateIndex,/* setSelectedDateIndex*/] = useState(0);
  const { data: weatherData, isLoading, error } = useWeatherQuery();

  const getWeatherIcon = (condition: string) => {
    const iconMap = {
      Sunny: <Sun className="w-6 h-6" />,
      Cloudy: <Cloud className="w-6 h-6" />,
      Rain: <CloudRain className="w-6 h-6" />,
      Snow: <Snowflake className="w-6 h-6" />,
    };
    return (
      iconMap[condition as keyof typeof iconMap] || <Sun className="w-6 h-6" />
    );
  };

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timeInterval);
  }, []);

  if (isLoading) return <div>טוען נתוני מזג אוויר...</div>;
  if (error) return <div>שגיאה בטעינת נתונים</div>;
  if (!weatherData) return null;

  const currentHour = currentTime.getHours();
  const currentDayForecast = weatherData.forecast.forecastday[selectedDateIndex];

  const getCurrentHourWeather = () => {
    return currentDayForecast.hour.find(
      (hour) => new Date(hour.time).getHours() === currentHour
    );
  };

  const currentHourWeather = getCurrentHourWeather();

  return (
    <div className="relative">
      <header
        className="bg-gray-100 p-4 flex items-center justify-between"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-4">
          <div className="text-lg font-semibold">
            {currentTime.toLocaleTimeString("he-IL", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </div>
          {currentHourWeather && (
            <div className="flex items-center cursor-pointer hover:bg-gray-200 p-2 rounded-md">
              {getWeatherIcon(currentHourWeather.condition.text)}
              <span className="ml-2">
                {currentHourWeather.temp_c.toFixed(1)}°C
              </span>
            </div>
          )}
        </div>
      </header>

      {expanded && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md z-10">
          {/* תחזית לימים הקרובים */}
          {/* <div className="flex justify-between p-2 border-b">
            {weatherData.forecast.forecastday.map((day, index) => (
              <button 
                key={day.date}
                onClick={() => setSelectedDateIndex(index)}
                className={`p-2 ${selectedDateIndex === index ? 'bg-blue-100 font-bold' : ''}`}
              >
                {new Date(day.date).toLocaleDateString('he-IL', { weekday: 'short' })}
                {getWeatherIcon(day.day.condition.text)}
                <div>{day.day.maxtemp_c.toFixed(0)}°/{day.day.mintemp_c.toFixed(0)}°</div>
              </button>
            ))}
          </div> */}

          {/* תחזית שעתית עבור היום הנבחר */}
          <div className="flex justify-between overflow-x-auto p-2">
            {currentDayForecast.hour.map((hourlyData) => {
              const hourTime = new Date(hourlyData.time);
              const isCurrentHour =
                selectedDateIndex === 0 &&
                hourTime.getHours() === currentTime.getHours();

              return (
                <div
                  key={hourlyData.time}
                  className={`text-center flex flex-col items-center p-2 ${
                    isCurrentHour
                      ? "font-bold text-blue-600 bg-blue-100 rounded-md"
                      : "text-gray-700"
                  }`}
                >
                  <div>{hourTime.getHours()}:00</div>
                  {getWeatherIcon(hourlyData.condition.text)}
                  <div>{hourlyData.temp_c.toFixed(1)}°C</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherHeader;
