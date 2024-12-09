"use client";
import { Calendar, CalendarProps, ConfigProvider } from "antd";
import React, { useEffect, useState } from "react";
import type { Dayjs } from "dayjs";
import "@/app/globals.css";
import "dayjs/locale/he"; // ייבוא של השפה העברית
import heIL from "antd/locale/he_IL"; // Import the Hebrew locale
const customDayNames = ["יום א", "יום ב", "יום ג", "יום ד", "יום ה", "יום ו", "שבת"];


const Page: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth()); // חודש נבחר
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear()); // שנה נבחרת
  const [cellHeight, setCellHeight] = useState<string>(""); // גובה התא
  const [calendarMode, setCalendarMode] = useState<CalendarProps<Dayjs>["mode"]>("month"); // מצב היומן (חודש/שנה)


  const calculateCellHeight = () => {
    const calendarHeight = 75; // הגובה המקסימלי של התאים (ב-vh)
    const numberOfWeeks = getNumberOfWeeks(currentMonth, currentYear);
    const heightPerCell = Math.floor(calendarHeight / numberOfWeeks);

    setCellHeight(`${heightPerCell}vh`);
  };

  useEffect(() => {
    calculateCellHeight();
    const updateDayHeaders = () => {
      const headers = document.querySelectorAll(
        ".ant-picker-calendar .ant-picker-content thead th"
      );
      headers.forEach((header, index) => {
        if (customDayNames[index]) {
          header.textContent = customDayNames[index];
        }
      });
    };
    // עדכון שמות הימים לאחר הרינדור
    updateDayHeaders();

    // עדכון בעת שינוי התצוגה
    const observer = new MutationObserver(() => {
      updateDayHeaders();
    });

    const calendarContainer = document.querySelector(".ant-picker-calendar");
    if (calendarContainer) {
      observer.observe(calendarContainer, { childList: true, subtree: true });
    }

    return () => {
      observer.disconnect();
    };
  }, [currentMonth, currentYear]);


  const fullCellRender = (current: Dayjs) => {
    const isInDisplayedMonth =
      current.month() === currentMonth && current.year() === currentYear;

    // בדוק אם התאריך שייך לחודש הנוכחי
    if (isInDisplayedMonth) {
      return (
        // <div className="ant-picker-cell-inner w-full ">
        <div
          className="ant-picker-calendar-date w-full " style={{ maxHeight: cellHeight }}>
          <div className="ant-picker-calendar-date-value text-right">{current.date()}</div>
          <div className="ant-picker-calendar-date-content  "></div>
          {/* </div> */}
        </div>
      );
    }
    //בדוק אם התאריך משלים את השבועות של החודש הנוכחי
    if (isFillerDay(current)) {
      return (
        <div
          className="ant-picker-calendar-date w-full text-gray-400 "
          style={{ maxHeight: cellHeight }}
        >
          <div className="ant-picker-calendar-date-value text-right">{current.date()}</div>
          <div className="ant-picker-calendar-date-content "></div>
        </div>
      );
    }
    // עבור ימים מחוץ לחודש הנוכחי, נסתיר רק אם הם בשורה האחרונה
    return <div style={{ display: "none" }} />;
  };

  const isFillerDay = (current: Dayjs) => {
    // אם הוא בשבוע שמכיל גם ימים מהחודש הנוכחי
    const weekStart = current.startOf("week"); // תחילת השבוע
    const weekEnd = current.endOf("week"); // סוף השבוע

    const hasDaysFromCurrentMonth = Array.from({ length: 7 }).some((_, i) => {
      const dayOfWeeekStart = weekStart.add(i, "day");
      const dayofWeekEnd = weekEnd.add(i, "day");
      return (
        dayOfWeeekStart.month() === currentMonth ||
        dayofWeekEnd.month() === currentMonth
      );
    });

    return hasDaysFromCurrentMonth;
  };

  const getNumberOfWeeks = (month: number, year: number) => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startWeek = firstDayOfMonth.getDay();
    const endWeek = lastDayOfMonth.getDay();

    //חישוב של מספר השבועות האמצעיים- לא כולל השבוע הראשון והאחרון
    const fillerDays = (7-startWeek) + (endWeek + 1);
    const fullWeeks = Math.floor((Number(lastDayOfMonth.getDate()) - Number(firstDayOfMonth.getDate()) + 1 - fillerDays) / 7);
    const partialWeeks = 2;
    return fullWeeks + partialWeeks;
  };
  // עדכון החודש והשנה כאשר היומן משתנה
  const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>["mode"]) => {
    setCurrentMonth(value.month());
    setCurrentYear(value.year());
    setCalendarMode(mode); 
    console.log(value.format("YYYY-MM-DD"), mode);
  };

  const onSelect = (value: Dayjs) => {
    console.log(value.format("YYYY-MM-DD"));
    
  }


  return (
    <ConfigProvider locale={heIL}> 
      <div className="h-[90vh] w-full max-w-[800px] m-auto mb-[10vh]  border-2 ">
        <Calendar
          onPanelChange={onPanelChange}
          fullCellRender={calendarMode === "month" ? fullCellRender : undefined}
          className="h-full flex flex-col justify-center  "
          onSelect={onSelect}
        />
      </div>
    </ConfigProvider>
  );
};


export default Page;
