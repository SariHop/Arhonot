import React, { useState, useEffect } from "react";
import { Sun, Cloud, CloudRain, Snowflake, MapPin ,ChevronDown} from "lucide-react";
import { useWeatherQuery } from "@/app/hooks/weatherQueryHook";
import { useLocationTracking } from "@/app/hooks/locationHook";

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
  const { hasSignificantLocationChange, resetLocationChange } =useLocationTracking();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expanded, setExpanded] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);
 
  // בדיקה אם הנתונים כבר תקפים (לא עברו 24 שעות)
//   const isStaleData = () => {
//     const lastFetchTime = localStorage.getItem('lastFetchTime');
//     if (!lastFetchTime) return true;
//     const elapsed = Date.now() - Number(lastFetchTime);
//     return elapsed > 24 * 60 * 60 * 1000; // אם עברו יותר מ-24 שעות
//   };

    // הגדרת enabled לפי התנאים
//   const { data: weatherData, isLoading, error, refetch } = useWeatherQuery({
//     enabled: hasSignificantLocationChange || !isStaleData() // אם המיקום השתנה או אם נתונים כבר לא עדכניים
//   });
const { data: weatherData, isLoading, error, refetch} = useWeatherQuery();


  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timeInterval);
  }, []);
  useEffect(() => {
    if (hasSignificantLocationChange && !errorOccurred) {
      refetch()
        .catch(() => setErrorOccurred(true)); 
        
         resetLocationChange();  
          }
  }, [hasSignificantLocationChange, refetch, resetLocationChange, errorOccurred]);
  console.log("isLoading:", isLoading);
  console.log("error:", error);
  console.log("errorOccurred:", errorOccurred);
  console.log("weatherData:", weatherData);
  if (isLoading) return <div>טוען נתוני מזג אוויר...</div>;
  if (error||errorOccurred) return <div>שגיאה בטעינת נתונים</div>;
  if (!weatherData) return null;

   // לוגיקה להדפסת נתונים אם הם מהשרת או מהקאש
//   useEffect(() => {
//     if (isStaleData()) {
//       console.log("נתונים חדשים: הנתונים הושגו מהשרת.");
//     } else {
//       console.log("נתונים מקאש: הנתונים הושגו מהקאש.");
//     }

//     // עדכון קונסול אחרי טעינת הנתונים
//     if (!isLoading && weatherData) {
//       console.log("נתונים שהתקבלו:", weatherData); // פה את יכולה גם לראות את הנתונים עצמם אם תרצי
//     }
//   }, [weatherData, isLoading]);  // תנאי לבדוק את הנתונים לאחר טעינה או שינוי

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
  // const currentTemp = closestHour.main.temp;
  // const currentDesc = closestHour.weather[0].description;
  // const currentIcon = closestHour.weather[0].icon;

  return (
    <div
      className="fixed top-0 left-0 w-full bg-gray-100 z-50 shadow-md"
    >
      <header
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-2">
          <MapPin className="w-6 h-6 text-gray-600" />
          <span className="text-lg font-semibold">{cityName}</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-lg font-semibold">
            {currentTime.toLocaleTimeString("he-IL", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </div>
          <div className="flex items-center">
            {getWeatherIcon(closestHour.weather[0].main)}
            <span className="mr-2">
              {closestHour.main.temp.toFixed(1)}°C - {closestHour.weather[0].description}
            </span>
          </div>
          <ChevronDown className={`transform transition-transform ${expanded ? "rotate-180" : ""}`} />
        </div>
      </header>

      {expanded && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg z-50">
          <div className="flex justify-between overflow-x-auto p-2">
            {hourlyWeather.slice(0, 8).map((hourlyData) => (
              <div
                key={hourlyData.dt}
                className="text-center flex flex-col items-center p-2 text-gray-700"
              >
                <div>{new Date(hourlyData.dt_txt).getHours()}:00</div>
                {getWeatherIcon(hourlyData.weather[0].main)}
                <div className="font-bold">{hourlyData.main.temp.toFixed(1)}°C</div>
                <div className="text-sm">{hourlyData.weather[0].description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherHeader;