"use client";

import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "@/app/globals.css";
import "dayjs/locale/he";
import Image from "next/image";
import useUser from "@/app/store/userStore";
import { toast } from "react-toastify";
import axios from "axios";
import IOutfit from "@/app/types/IOutfit";
import { IDayWithLooks } from "@/app/types/IDay";
import { userLooks } from "@/app/services/daysService";


const Page: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [cellHeight, setCellHeight] = useState<string>(""); // גובה התא

  const [dayData, setDayData] = useState<Record<string, IDayWithLooks>>({});
  const { _id } = useUser((state) => state);

  useEffect(() => {
    loadDayLooks();
    calculateCellHeight();
  }, [currentMonth, currentYear]);

  const loadDayLooks = async () => {
    try {
      const response = await userLooks(currentMonth, currentYear, _id);
      setDayData(response);
    } catch (error) {
      console.error("Failed to process user looks:", error);
      if (axios.isAxiosError(error)) {
        const serverError = error.response?.data?.error || "Unknown server error";
        toast.error(`Server Error: ${serverError}`);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const calculateCellHeight = () => {
    const calendarHeight = 50; // הגובה המקסימלי של התאים (ב-vh)
    const numberOfWeeks = getNumberOfWeeks(currentMonth, currentYear);
    const heightPerCell = Math.floor(calendarHeight / numberOfWeeks);

    setCellHeight ( `${heightPerCell-4}vh`);//(`${heightPerCell}vh`);
  };

  const tileContent = ({ date }: { date: Date }) => {
    const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

    const dayLooks = dayData[dateKey]?.looks || [];

    return (
      <div className="flex flex-col md:flex-row md:items-start justify-center items-center  text-base text-center w-full " style={{ height: cellHeight }}>
        {dayLooks && dayLooks.map((look: IOutfit, index) => (
          index < 1 ? (
            <Image
              key={index}
              src={look.img}
              alt={`Look ${index + 1}`}
              className="w-8 h-8 rounded-full object-cover m-1 inline-block"
              width={25}
              height={25}
            />
          ) : (index === 1 && `+${dayLooks.length - 1}`)
        ))}
      </div>
    );
  };

  const onActiveStartDateChange = ({ activeStartDate }: { activeStartDate: Date | null }) => {
    console.log("onActiveStartDateChange");
    
    if (activeStartDate) {
      setCurrentMonth(activeStartDate.getMonth());
      setCurrentYear(activeStartDate.getFullYear());
    }
  };

  const onClickDay = (value: Date) => {
    console.log("Selected date:", value);
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


 

  return (
    <div className="h-[calc(100vh-20vh)] w-full flex items-center justify-center  m-auto border-2">
      {/* <div> */}
      <Calendar
        locale="he"
        tileContent={tileContent}
        onActiveStartDateChange={onActiveStartDateChange}
        onClickDay={onClickDay}
        
        className="w-full max-w-[900px] h-full"
        // tileClassName={cellHeight} // Custom class to apply for tiles
      />
      {/* </div> */}
    </div>
  );
};

export default Page;

