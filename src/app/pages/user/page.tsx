//user home page
"use client";
import React, { useEffect, useState } from 'react'
// import ImageCaruseka from '../../components/swiper/ImageCaruseka'
import WeeklyCalendar from '@/app/components/swiper/WeeklyCalendar'
import { getDay } from '@/app/services/daysService'
import useUser from "@/app/store/userStore";
import axios from 'axios';
import IOutfit from '@/app/types/IOutfit';
// import ImageCarousel from '@/app/components/Swiper';
import SwiperComponent from '@/app/components/Swiper';
// import TryingSwiper from '@/app/components/Swiper';

const Page = () => {
  const { _id } = useUser((state) => state);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [looks, setLooks] = useState<IOutfit[]>([])
  console.log(looks);
  useEffect(() => {
    const fetchDayData = async () => {
      const userId = _id; // החלף ב-ID של המשתמש
      if (userId) {
        try {
          const response = await getDay(userId, selectedDate);
          console.log("Data received:", response);
          if (response.data.success) {
            console.log(response.data.data);
            setLooks(response.data.data.looks);
          }
          else if (response.data) {
            console.log(response.data);
            setLooks([]);
          }
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            console.error("Axios error:", error.response?.data || error.message);
          } else if (error instanceof Error) {
            console.error("Unexpected error:", error.message);
          } else {
            console.error("Unknown error occurred.");
          }
          setLooks([]);
        }
      }
    };

    fetchDayData(); // קריאה לפונקציה הפנימית
  }, [_id, selectedDate]); // תלות ריקה מבטיחה שהאפקט רץ רק פעם אחת כשהקומפוננטה נטענת
  return (
    <div className='flex gap-10 flex-col p-2'>
      <WeeklyCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      {/* <ImageCaruseka looks={looks} /> */}
      {/* <SwiperComponent /> */}
    </div>
  )
}

export default Page