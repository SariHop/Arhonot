import React, { useState, useEffect } from "react";
import { Sun, Cloud, CloudRain, Snowflake, MapPin } from "lucide-react";
import { useWeatherQuery } from "@/app/hooks/weatherQueryHook";

const WeatherHeader: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expanded, setExpanded] = useState(false);
  const [selectedDateIndex, /* setSelectedDateIndex*/] = useState(0);
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

  // סינון תחזית לפי שעות זוגיות בלבד
  const hourlyWeather = currentDayForecast.hour.filter((hour, index) => {
    const hourTime = new Date(hour.time);
    return hourTime.getHours() % 2 === 0; // שעתיים זוגיות בלבד
  });

  // פונקציה למציאת השעה הזוגית הקרובה ביותר
  const getClosestEvenHour = () => {
    // אם השעה הנוכחית היא אי זוגית, נבחר את השעה הזוגית הקודמת
    let closestHour = hourlyWeather[0];
    if (currentHour % 2 !== 0) {
      // אם השעה הנוכחית אי זוגית, נבחר את השעה הקודמת הזוגית
      closestHour = hourlyWeather.find(
        (hour) => new Date(hour.time).getHours() === currentHour - 1
      ) || hourlyWeather[0];
    } else {
      // אם השעה הנוכחית זוגית, נבחר אותה כקרובה ביותר
      closestHour = hourlyWeather.find(
        (hour) => new Date(hour.time).getHours() === currentHour
      ) || hourlyWeather[0];
    }
    return closestHour;
  };

  const currentHourWeather = getClosestEvenHour();

  // הוספת המיקום
  const locationName = weatherData.location.name;

  return (
    <div className="relative">
      <header
        className="bg-gray-100 p-4 flex items-center justify-between"
        onClick={() => setExpanded(!expanded)}
      >
        {/* הצגת המיקום בצד השמאלי עם אייקון של Location */}
        <div className="flex items-center space-x-2">
          <MapPin className="w-6 h-6 text-gray-600" />
          <span className="text-lg font-semibold">{locationName}</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-lg font-semibold">
            {currentTime.toLocaleTimeString("he-IL", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </div>
          {/* הצגת תיאור מזג האוויר בעברית */}
          {currentHourWeather && (
            <div className="flex items-center cursor-pointer hover:bg-gray-200 p-2 rounded-md">
              {getWeatherIcon(currentHourWeather.condition.text)}
              <span className="ml-2 text-sm">
                {currentHourWeather.temp_c.toFixed(1)}°C -{" "}
                {currentHourWeather.condition.text} {/* תיאור מזג האוויר */}
              </span>
            </div>
          )}
        </div>
      </header>

      {expanded && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md z-10">
          {/* תחזית שעתית עבור היום הנבחר */}
          <div className="flex justify-between overflow-x-auto p-2">
            {hourlyWeather.map((hourlyData) => {
              const hourTime = new Date(hourlyData.time);

              const isCurrentHour =
                hourlyData.time === currentHourWeather.time;

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
                  <div className="text-sm text-gray-500">
                    {hourlyData.condition.text} {/* תיאור מזג האוויר */}
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
