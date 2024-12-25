"use client";
import { Calendar, CalendarProps, ConfigProvider } from "antd";
import React, { useEffect, useState } from "react";
import type { Dayjs } from "dayjs";
import "@/app/globals.css";
import "dayjs/locale/he";
import heIL from "antd/locale/he_IL";
import Image from 'next/image'
import useUser from "@/app/store/userStore";
import IOutfit from "@/app/types/IOutfit";
import OutfitsModal from "@/app/components/calendar/OutfitsModal";
import { IDayWithLooks } from "@/app/types/IDay";
import { userLooks } from "@/app/services/daysService";
const customDayNames = ["יום א", "יום ב", "יום ג", "יום ד", "יום ה", "יום ו", "שבת"];


const Page: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth()); // חודש נבחר
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear()); // שנה נבחרת
  const [cellHeight, setCellHeight] = useState<string>(""); // גובה התא
  const [calendarMode, setCalendarMode] = useState<CalendarProps<Dayjs>["mode"]>("month"); // מצב היומן (חודש/שנה)
  const user = useUser();
  const [dayData, setDayData] = useState<Record<string, IDayWithLooks>>({}); // מפת לוקים לפי תאריך
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<string>("");



  useEffect(() => {
    calculateCellHeight();
    loadDayLooks();
    updateDayHeaders();
  }, [currentMonth, currentYear]);


  const calculateCellHeight = () => {
    const calendarHeight = 60; // הגובה המקסימלי של התאים (ב-vh)
    const numberOfWeeks = getNumberOfWeeks(currentMonth, currentYear);
    const heightPerCell = Math.floor(calendarHeight / numberOfWeeks);
    setCellHeight(`${heightPerCell}vh`);
  };


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


  const getNumberOfWeeks = (month: number, year: number) => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startWeek = firstDayOfMonth.getDay();
    const endWeek = lastDayOfMonth.getDay();

    //חישוב של מספר השבועות האמצעיים- לא כולל השבוע הראשון והאחרון
    const fillerDays = (7 - startWeek) + (endWeek + 1);
    const fullWeeks = Math.floor((Number(lastDayOfMonth.getDate()) - Number(firstDayOfMonth.getDate()) + 1 - fillerDays) / 7);
    const partialWeeks = 2;
    return fullWeeks + partialWeeks;
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


  const fullCellRender = (current: Dayjs) => {
    const isInDisplayedMonth =
      current.month() === currentMonth && current.year() === currentYear;

    // בדוק אם התאריך שייך לחודש הנוכחי
    if (isInDisplayedMonth) {
      const dateKey = current.format("YYYY-MM-DD");
      const dayLooks = dayData[dateKey] || []; // קבלת תמונות לוקים ליום זה
      return (
        <div className="ant-picker-calendar-date w-full" style={{ height: cellHeight }}>
          <div className="ant-picker-calendar-date-content flex flex-col xl:flex-row xl:items-start justify-between items-center overflow-hidden text-base text-center ">
            <p className="ant-picker-calendar-date-value text-right text-sm">{current.date()}</p>
            <div className=" flex flex-col h-[65%] md:flex-row justify-center align-middle items-center  overflow-hidden">
              {dayLooks.looks && dayLooks.looks.map((look: IOutfit, index) => (
                index < 1 ?
                  (<Image
                    key={index}
                    src={look.img}
                    alt={`Look ${index + 1}`}
                    className="w-7 h-7 rounded-full  object-cover m-1 inline-block"
                    width={25}
                    height={25}
                  />) : (index === 1 && <p key={index} className="text-xs text-gray-500">+{dayLooks.looks.length - 1}</p>)
              ))}
            </div>
          </div>
        </div>
      );
    }
    //בדוק אם התאריך משלים את השבועות של החודש הנוכחי
    if (isFillerDay(current)) {
      return (
        <div
          className="ant-picker-calendar-date w-full text-gray-400"
          style={{ height: cellHeight }}
        >
          <div className="ant-picker-calendar-date-value text-right">{current.date()}</div>
          <div className="ant-picker-calendar-date-content "></div>
        </div>
      );
    }
    // עבור ימים מחוץ לחודש הנוכחי, נסתיר רק אם הם בשורה האחרונה
    return <div style={{ display: "none" }} />;
  };


  const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>["mode"]) => {
    setCurrentMonth(value.month());
    setCurrentYear(value.year());
    setCalendarMode(mode);
  };


  const onSelect = (value: Dayjs) => {
    const formattedDay = value.format("YYYY-MM-DD");
    if (dayData[formattedDay]?.looks) {
      setSelectedDay(formattedDay);
      setIsModalVisible(true);
    }
  };


  const loadDayLooks = async () => {
    try {
      const response = await userLooks(currentMonth, currentYear, user._id); // החלף ב-ID של המשתמש
      const days = response; // נניח ש-days מחזיק את נתוני הימים
      setDayData(days);
    }
    catch (error) {
      console.error("Failed to process user looks:", error);
    }
  };


  return (
    <ConfigProvider locale={heIL}>
      <div className=" w-full max-w-[800px] m-auto ">
        <Calendar
          onPanelChange={onPanelChange}
          fullCellRender={calendarMode === "month" ? fullCellRender : undefined}
          className="md:h-[75vh] h-[79vh] flex flex-col justify-center  "
          onSelect={onSelect}
        />
        {selectedDay !== "" && <OutfitsModal isOpen={isModalVisible} setIsOpen={setIsModalVisible} dateDetails={dayData[selectedDay]} date={selectedDay} />}
      </div>
    </ConfigProvider>
  );
};

export default Page;
