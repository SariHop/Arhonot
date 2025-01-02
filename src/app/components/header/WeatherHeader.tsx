"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaChevronDown } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
import { useWeatherQuery } from "@/app/hooks/weatherQueryHook";
import { useLocationTracking } from "@/app/hooks/locationHook";

const WeatherHeader: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expanded, setExpanded] = useState(false);

  const { hasSignificantLocationChange, resetLocationChange } =
    useLocationTracking();
  const { data: weatherData, isLoading, error, refetch } = useWeatherQuery();

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    if (hasSignificantLocationChange) {
      refetch();
      resetLocationChange();
    }
  }, [hasSignificantLocationChange, refetch, resetLocationChange]);

  if (isLoading) return <div className="p-4">טוען נתוני מזג אוויר...</div>;
  if (error) return <div className="p-4">שגיאה בטעינת נתונים</div>;
  if (!weatherData) return null;

  const cityName = weatherData.city.name;
  const hourlyWeather = weatherData.list;

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
  const currentTemp = closestHour.main.temp;
  const currentDesc = closestHour.weather[0].description;
  const currentIcon = closestHour.weather[0].icon;

  return (
    <div>
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex flex-col items-end w-full md:w-auto ml-2 mt-2 mb-1 space-y-0.5">
          <div className="flex items-center justify-end text-sm text-gray-900 font-semibold space-x-2">
            <IoLocationOutline className="w-4 h-4 text-gray-600" />
            <span>{cityName}</span>
          </div>

          <div className="flex items-center justify-end space-x-2">
            <div className="pl-2 text-lg font-semibold hidden md:block">
              {currentTime.toLocaleTimeString("he-IL", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </div>

            <div>
              <Image
                src={`https://openweathermap.org/img/wn/${currentIcon}@2x.png`}
                alt={currentDesc}
                width={50}
                height={50}
                priority
              />
            </div>

            <span className="text-lg font-semibold">
              {currentTemp.toFixed(1)}°C
            </span>
            <span className="text-sm text-gray-500">{currentDesc}</span>

            <FaChevronDown
            className={`transform transition-transform ${
              expanded ? "rotate-180" : ""
            } text-gray-600 text-sm`}
          />
          </div>

         
        </div>
      </div>

      {expanded && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md z-50 pointer-events-auto">
          <div className="flex justify-between overflow-x-auto p-2">
            {hourlyWeather.slice(0, 8).map((hourlyData) => {
              const hourTime = new Date(hourlyData.dt_txt);
              const isCurrentHour = hourlyData.dt_txt === closestHour.dt_txt;

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
                  <Image
                    src={`https://openweathermap.org/img/wn/${hourlyData.weather[0].icon}@2x.png`}
                    alt={hourlyData.weather[0].description}
                    width={40}
                    height={40}
                  />
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
