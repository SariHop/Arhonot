"use client";

import React, { useState, useEffect } from 'react';
import useDay from '@/app/store/currentDayStore';

const WeeklyCalendar: React.FC = () => {  // יצירת משתנה מצב לתאריכים של השבוע
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const { selectedDate, setSelectedDate } = useDay();
  useEffect(() => {
    const today = new Date();
    const daysOfWeek: Date[] = [];

    for (let i = 0; i < 7; i++) {
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
    const daysOfWeek = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

    const day = date.getDate();
    const month = date.getMonth() + 1;

    return `${daysOfWeek[date.getDay()]} ${day}.${month < 10 ? `0${month}` : month}`;
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="flex justify-between flex-wrap max-w-full gap-0.5">
      {weekDates.map((date, index) => (
        <div
          key={index}
          className={`bg-gray-200 rounded-lg p-4 text-blue-950 text-center shadow-md w-[calc(100%/7.5)] h-[70px] flex items-center justify-center cursor-pointer relative
                  ${isSameDate(selectedDate, date) ? 'after:content-[""] after:block after:w-full after:h-1 after:bg-blue-950 after:absolute after:bottom-0 after:rounded-b-lg' : ''}`}
          onClick={() => handleDateClick(date)} // מאזין ללחיצה
        >
          <div className="text-sm sm:text-base md:text-lg">
            <span>{formatDate(date).split(",")[0]} </span>
            <strong className="font-semibold text-lg">{formatDate(date).split(",")[1]}</strong>
          </div>
        </div>
      ))}
    </div>

  );
};

export default WeeklyCalendar;
