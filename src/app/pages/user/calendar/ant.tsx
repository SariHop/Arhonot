"use client";
import { Calendar, CalendarProps, ConfigProvider, Modal } from "antd";
import React, { useEffect, useState } from "react";
import type { Dayjs } from "dayjs";
import "@/app/globals.css";
import "dayjs/locale/he"; 
import heIL from "antd/locale/he_IL"; 
import Image from 'next/image'
import useUser from "@/app/store/userStore";
import { toast } from "react-toastify";
import axios from "axios";
import { IDayResult, looks } from "@/app/services/daysService";
import IOutfit from "@/app/types/IOutfit";
const customDayNames = ["יום א", "יום ב", "יום ג", "יום ד", "יום ה", "יום ו", "שבת"];


const Page: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth()); // חודש נבחר
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear()); // שנה נבחרת
  const [cellHeight, setCellHeight] = useState<string>(""); // גובה התא
  const [calendarMode, setCalendarMode] = useState<CalendarProps<Dayjs>["mode"]>("month"); // מצב היומן (חודש/שנה)
  const {_id} = useUser((state) => state);
  const [dayData, setDayData] = useState<Record<string, IDayResult>>({}); // מפת לוקים לפי תאריך

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedLooks, setSelectedLooks] = useState<IOutfit[]>([]);



  useEffect(() => {
    console.log("\n\n\n\nTh user is\n\n\n\n",_id);
    
    calculateCellHeight();
    loadDayLooks();
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

  const calculateCellHeight = () => {
    const calendarHeight = 75; // הגובה המקסימלי של התאים (ב-vh)
    const numberOfWeeks = getNumberOfWeeks(currentMonth, currentYear);
    const heightPerCell = Math.floor(calendarHeight / numberOfWeeks);

    setCellHeight(`${heightPerCell}vh`);
  };

  const fullCellRender = (current: Dayjs) => {
    const isInDisplayedMonth =
      current.month() === currentMonth && current.year() === currentYear;

    // בדוק אם התאריך שייך לחודש הנוכחי
    if (isInDisplayedMonth) {
      const dateKey = current.format("YYYY-MM-DD");
      const dayLooks = dayData[dateKey] || []; // קבלת תמונות לוקים ליום זה
      return (
        // <div className="ant-picker-cell-inner w-full ">
        <div
          className="ant-picker-calendar-date w-full " style={{ maxHeight: cellHeight }}>
          <div className="ant-picker-calendar-date-value text-right">{current.date()}</div>
          <div className="ant-picker-calendar-date-content flex flex-col md:flex-row md:items-start justify-center items-center overflow-hidden text-base text-center ">
          {dayLooks.looks && dayLooks.looks.map((look:IOutfit, index) => (
            index<1 ?
              (<Image
                key={index}
                src={look.img}
                alt={`Look ${index + 1}`}
                className="w-8 h-8 rounded-full object-cover m-1 inline-block"
                width={25}
                height={25}
              />):(index===1 && `+${dayLooks.looks.length - 1}`)
            ))}
          </div>
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
    const formattedDay = value.format("YYYY-MM-DD");
    if (dayData[formattedDay]?.looks) {
      setSelectedLooks(dayData[formattedDay].looks);
      setIsModalVisible(true);
    }
  };

const loadDayLooks = async () => {
    try {
      const response = await looks(currentMonth,currentYear, _id); // החלף ב-ID של המשתמש
      const  days  = response; // נניח ש-days מחזיק את נתוני הימים
      setDayData(days);
    } 
    catch (error) {
      console.error("Failed to process user looks:", error);
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data?.error || "Unknown server error";
      toast.error(`Server Error: ${serverError}`);
    } else {
      toast.error("An unexpected error occurred");
    }
    throw error;
    }
  };


  return (
    <ConfigProvider locale={heIL}> 
      <div className="h-[90vh] w-full max-w-[800px] m-auto  border-2 ">
        <Calendar
          onPanelChange={onPanelChange}
          fullCellRender={calendarMode === "month" ? fullCellRender : undefined}
          className="h-full flex flex-col justify-center  "
          onSelect={onSelect}
        />
        <Modal
          title="הלוקים ליום הנבחר"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <div className="flex flex-wrap justify-center">
            {selectedLooks.map((look, index) => (
              <div
                key={index}
                className="m-2 flex flex-col items-center justify-center"
              >
                <Image
                  src={look.img}
                  alt={`Look ${index + 1}`}
                  className="w-24 h-36 object-cover"
                  width={96}
                  height={144}
                />
                <span className="mt-2 text-sm">עונה: {look.season}</span>
              </div>
            ))}
          </div>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default Page;
