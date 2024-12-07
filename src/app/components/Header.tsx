import React, { useState, useEffect } from "react";
import { Sun, Cloud, CloudRain, Snowflake, MapPin } from "lucide-react";
import { useWeatherQuery } from "@/app/hooks/weatherQueryHook";

const getWeatherIcon = (condition: string) => {
  const iconMap = {
    Clear: <Sun className="w-6 h-6" />,
    Clouds: <Cloud className="w-6 h-6" />,
    Rain: <CloudRain className="w-6 h-6" />,
    Snow: <Snowflake className="w-6 h-6" />,
  };
  return (
    iconMap[condition as keyof typeof iconMap] || <Sun className="w-6 h-6" />
  );
};

const WeatherHeader: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expanded, setExpanded] = useState(false);
  const { data: weatherData, isLoading, error } = useWeatherQuery();

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timeInterval);
  }, []);

  if (isLoading) return <div>טוען נתוני מזג אוויר...</div>;
  if (error) return <div>שגיאה בטעינת נתונים</div>;
  if (!weatherData) return null;

  const cityName = weatherData.city.name;
  const hourlyWeather = weatherData.list; //מערך תחזית שעות ל5 ימים קרובים

  const getClosestHour = () => {
    let closestHour = hourlyWeather[0];
    for (let i = 0; i < hourlyWeather.length; i++) {
      const currentData = hourlyWeather[i];
      const currentTimeStamp = new Date(currentData.dt_txt);
      if (
        currentTimeStamp.getHours() <= currentTime.getHours() &&
        (!closestHour ||
          currentTimeStamp.getHours() > new Date(closestHour.dt_txt).getHours())
      ) {
        closestHour = currentData;
      }
    }
    return closestHour;
  };

  const closestHour = getClosestHour();

  // פרטי תחזית נוכחית
  const currentTemp = closestHour.main.temp;
  const currentDesc = closestHour.weather[0].description;
  const currentIcon = closestHour.weather[0].icon;

  return (
    <div className="relative">
      <header
        className="bg-gray-100 p-4 flex items-center justify-between"
        onClick={() => setExpanded(!expanded)}
      >
        {/* הצגת המיקום עם אייקון של Location */}
        <div className="flex items-center space-x-2">
          <MapPin className="w-6 h-6 text-gray-600" />
          <span className="text-lg font-semibold">{cityName}</span>
        </div>

        <div className="flex items-center space-x-4">
          {/* הצגת הזמן הנוכחי */}
          <div className="text-lg font-semibold">
            {currentTime.toLocaleTimeString("he-IL", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </div>

          {/* הצגת התחזית הנוכחית */}
          <div className="flex items-center cursor-pointer hover:bg-gray-200 p-2 rounded-md">
            {getWeatherIcon(currentIcon)}
            <span className="mr-2 text-ml">
              {currentTemp.toFixed(1)}°C - {currentDesc}
            </span>
          </div>
        </div>
      </header>

      {expanded && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md z-10">
          {/* תחזית שעתית */}
          <div className="flex justify-between overflow-x-auto p-2">
          {hourlyWeather.slice(0, 8).map((hourlyData)  => {
              const hourTime = new Date(hourlyData.dt_txt);
              const isCurrentHour =
                hourlyData.dt_txt === closestHour.dt_txt;

              return (
                <div
                  key={hourlyData.dt}
                  className={`text-center flex flex-col items-center p-2 ${
                    isCurrentHour
                      ? "font-bold text-blue-600 bg-blue-100 rounded-md"
                      : "text-gray-700"
                  }`}
                >
                  <div>{hourTime.getHours()}:00</div>
                  {getWeatherIcon(hourlyData.weather[0].icon)}
                  <div className="font-bold">
                    {hourlyData.main.temp.toFixed(1)}°C
                  </div>
                  <div className="text-sm text-gray-500">
                    {hourlyData.weather[0].description}
                  </div>
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
