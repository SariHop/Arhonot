//user home page
"use client";
import React, { useEffect } from 'react'
import WeeklyCalendar from '@/app/components/swiper/WeeklyCalendar'
import { getDay } from '@/app/services/daysService'
import useUser from "@/app/store/userStore";
import axios from 'axios';
import LooksList from '@/app/components/swiper/OutlooksGread';
import useDay from '@/app/store/currentDayStore';

const Page = () => {
  const { selectedDate, setSelectedDate, setOutfits, setUserId, userId } = useDay();

  const { _id } = useUser();
  useEffect(() => {
    setSelectedDate(new Date());
  }, [setSelectedDate]);
  useEffect(() => {
    const fetchDayData = async () => {
      setUserId(_id); // החלף ב-ID של המשתמש
      console.log("user id from page: ", userId);
      if (userId && selectedDate) {
        try {
          const response = await getDay(userId, selectedDate);
          console.log("Data received:", response);
          if (response.data.success) {
            console.log(response.data.data);
            setOutfits(response.data.data.looks);
          }
          else if (response.data) {
            console.log(response.data);
            setOutfits([]);
          }
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            console.error("Axios error:", error.response?.data || error.message);
          } else if (error instanceof Error) {
            console.error("Unexpected error:", error.message);
          } else {
            console.error("Unknown error occurred.");
          }
          setOutfits([]);
        }
      }
    };

    fetchDayData(); // קריאה לפונקציה הפנימית
  }, [_id, selectedDate]); // תלות ריקה מבטיחה שהאפקט רץ רק פעם אחת כשהקומפוננטה נטענת
  return (
    <div className='flex gap-10 flex-col p-2'>
      <WeeklyCalendar />
      {/* <ImageCaruseka looks={looks} /> */}
      {/* <SwiperComponent /> */}
      <LooksList />
    </div>
  )
}

export default Page