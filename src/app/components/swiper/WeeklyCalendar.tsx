"use client";

import React, { useState, useEffect } from 'react';
import useDay from '@/app/store/currentDayStore';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useWeatherQuery } from '@/app/hooks/weatherQueryHook';
import { getAverageTemperatureForDate } from '@/app/services/weatherService';

const WeeklyCalendar: React.FC<{ saveChanges: () => void, changed: boolean, setChanged: (b: boolean) => void }> = ({ saveChanges, changed, setChanged }) => {
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const { selectedDate, setSelectedDate } = useDay();
  const [pendingDate, setPendingDate] = useState<Date | null>(null); // תאריך זמני
  const { data: weatherData } = useWeatherQuery();
  const [clicked, setClicked] = useState(false);
  useEffect(() => {
    const today = new Date();
    const daysOfWeek: Date[] = [];

    for (let i = 0; i < 6; i++) {
      const newDate = new Date(today);
      newDate.setDate(today.getDate() + i); // הוספת יום לכל תאריך
      daysOfWeek.push(newDate);
    }
    setWeekDates(daysOfWeek);
  }, []);

  const normalizeDate = (date: Date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  const isSameDate = (date1: Date | null, date2: Date) => {
    if (date1) {
      return normalizeDate(date1).getTime() === normalizeDate(date2).getTime();
    }
    return false;
  };

  const formatDate = (date: Date) => {
    const daysOfWeek = ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "שבת"];

    const day = date.getDate();
    const month = date.getMonth() + 1;

    return `${daysOfWeek[date.getDay()]}, ${day}.${month < 10 ? `0${month}` : month}`;
  };

  const confirmAndSave = (newDate: Date) => {
    setPendingDate(newDate); // שמירת התאריך הזמני
    const isSmallScreen = window.innerWidth <= 640;
    toast(
      <div className="flex flex-col items-center">
        <p>האם אתה רוצה לשמור שינויים?</p>
        <div className="flex gap-4 mt-2">
          <button
            onClick={async () => {
              if (clicked) return; // מניעת לחיצה אם clicked הוא true
              setClicked(true);
              await saveChanges(); // קריאה לשרת לאחר האישור
              setPendingDate(null); // איפוס התאריך הזמני
              toast.dismiss(); // סגירת הטוסט
              setSelectedDate(newDate);
              setClicked(false);
            }}
            className={`py-1 px-4 rounded ${clicked ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white"
              }`}
          >
            כן
          </button>
          <button
            onClick={() => {
              if (clicked) return; // מניעת לחיצה אם clicked הוא true
              setClicked(true);
              setPendingDate(null); // ביטול התאריך הזמני
              toast.dismiss(); // סגירת הטוסט
              setSelectedDate(newDate);
              setClicked(false);
            }}
            className={`py-1 px-4 rounded ${clicked ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-red-400 text-white"
              }`}
          >
            לא
          </button>
        </div>
      </div>,
      {
        position: isSmallScreen ? "top-center" : "bottom-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        pauseOnHover: true,
        closeButton: false, // ביטול כפתור הסגירה
      }
    );
    setChanged(false);
  };

  return (
    <div className="flex justify-around flex-wrap max-w-full gap-0.5">
      {weekDates.map((date, index) => {
        const avgTemp = weatherData && weatherData.list
          ? getAverageTemperatureForDate(weatherData.list, date)
          : null;
        return (
          <div
            key={index}
            className={`bg-gray-200 rounded-lg p-4 text-blue-950 text-center shadow-md w-[calc(100%/7)] h-[90px] flex flex-col items-center justify-center cursor-pointer relative
    ${isSameDate(selectedDate, date) ? 'after:content-[""] after:block after:w-full after:h-1 after:bg-blue-950 after:absolute after:bottom-0 after:rounded-b-lg' : ''}`}
            onClick={() => {
              if (!isSameDate(selectedDate, date) && !pendingDate && changed) {
                confirmAndSave(date); // הצגת הטוסט
              };
              setSelectedDate(date);
            }}
          >
            <div className="text-sm sm:text-base md:text-lg text-center flex justify-center items-center flex-col md:flex-row md:gap-1">
              <span>{formatDate(date).split(",")[0]}</span>
              <span className="font-semibold text-lg md:ml-2">{formatDate(date).split(",")[1]}</span>
            </div>

            {avgTemp !== null && (
              <div className="text-s text-gray-500 mt-2">
                {avgTemp.toFixed(1)}°
              </div>
            )}
          </div>

        );
      })}
    </div>

  );

};

export default WeeklyCalendar;
