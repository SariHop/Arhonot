"use client";

import React, { useState, useEffect } from 'react';
import useDay from '@/app/store/currentDayStore';
import useUser from "@/app/store/userStore";
import { setLooksForDay } from '@/app/services/daysService';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const WeeklyCalendar: React.FC = () => {  // יצירת משתנה מצב לתאריכים של השבוע
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const { selectedDate, setSelectedDate, selectedLooks } = useDay();
  const [pendingDate, setPendingDate] = useState<Date | null>(null); // תאריך זמני
  const { _id } = useUser();
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

  const fetchData = async () => {
    try {
      console.log("user id from WeeklyCalendar: ", _id, selectedDate, selectedLooks)
      if (selectedDate&&_id) {
        const response = setLooksForDay(_id, selectedDate, selectedLooks);
        console.log(response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const confirmAndSave = (newDate: Date) => {
    setPendingDate(newDate); // שמירת התאריך הזמני
    toast(
      <div className="flex flex-col items-center">
        <p>האם אתה רוצה לשמור שינויים?</p>
        <div className="flex gap-4 mt-2">
          <button
            onClick={async () => {
              await fetchData(); // קריאה לשרת לאחר האישור
              setPendingDate(null); // איפוס התאריך הזמני
              toast.dismiss(); // סגירת הטוסט
              setSelectedDate(newDate);
            }}
            className="bg-blue-500 text-white py-1 px-4 rounded"
          >
            כן
          </button>
          <button
            onClick={() => {
              setPendingDate(null); // ביטול התאריך הזמני
              toast.dismiss(); // סגירת הטוסט
              setSelectedDate(newDate);
            }}
            className="bg-gray-500 text-white py-1 px-4 rounded"
          >
            לא
          </button>
        </div>
      </div>,
      {
        position: "bottom-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        pauseOnHover: true,
      }
    );
  };

  return (
    <div className="flex justify-between flex-wrap max-w-full gap-0.5">
      {weekDates.map((date, index) => (
        <div
          key={index}
          className={`bg-gray-200 rounded-lg p-4 text-blue-950 text-center shadow-md w-[calc(100%/7.5)] h-[70px] flex items-center justify-center cursor-pointer relative
                  ${isSameDate(selectedDate, date) ? 'after:content-[""] after:block after:w-full after:h-1 after:bg-blue-950 after:absolute after:bottom-0 after:rounded-b-lg' : ''}`}
          onClick={() => {
            if (!isSameDate(selectedDate, date) && !pendingDate) {
              confirmAndSave(date); // הצגת הטוסט
            }
          }}


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
