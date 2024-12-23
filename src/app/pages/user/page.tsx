"use client";
import React, { useEffect } from 'react'
import WeeklyCalendar from '@/app/components/swiper/WeeklyCalendar'
import { getDay } from '@/app/services/daysService'
import useUser from "@/app/store/userStore";
import axios from 'axios';
import LooksList from '@/app/components/swiper/OutlooksGread';
import useDay from '@/app/store/currentDayStore';
import { recommendedLooks } from "@/app/services/outfitAlgo"
import { useWeatherQuery } from '@/app/hooks/weatherQueryHook';
import { setLooksForDay } from '@/app/services/daysService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Page = () => {
  const { data: weatherData } = useWeatherQuery();
  const user = useUser();
  const { selectedDate, setSelectedDate, setOutfits, setUserId, userId, addToAllLooks, selectedLooks } = useDay();
  useEffect(() => {
    setSelectedDate(new Date());
  }, [setSelectedDate]);
  useEffect(() => {
    const fetchDayData = async () => {
      setUserId(user._id);
      console.log("user id from page: ", userId);
      if (userId && selectedDate) {
        try {
          const response = await getDay(userId, selectedDate);
          console.log("Data received:", response);
          if (await response.data.success) {
            console.log(response.data.data);
            setOutfits(response.data.data.looks);
          }
          else if (await response.data) {
            console.log(response.data);
            setOutfits([]);
          }
          if (weatherData) {
            try {
              const looks = await recommendedLooks(weatherData.list, selectedDate, userId, user.sensitive);
              console.log("looks from algorithem: ", looks);
              addToAllLooks(looks);
            } catch (error) {
              toast.error(`${error || 'Unknown error'}`, {
                position: 'top-right',
                autoClose: 3000,
              });
            }
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
          if (weatherData) {
            const looks = await recommendedLooks(weatherData.list, selectedDate, userId, user.sensitive);
            console.log("looks from algorithem: ", looks);
            addToAllLooks(looks);
          }
        }
      }
    };

    fetchDayData(); // קריאה לפונקציה הפנימית
  }, [user._id, selectedDate]); // תלות ריקה מבטיחה שהאפקט רץ רק פעם אחת כשהקומפוננטה נטענת

  const saveChanges = async () => {
    try {
      console.log("user id from WeeklyCalendar: ", user._id, selectedDate, selectedLooks);
      if (selectedDate && user._id && weatherData && weatherData.list) {
        const response = await setLooksForDay(weatherData.list, user._id, selectedDate, selectedLooks);

        if (response.success) {
          toast.success('Changes saved successfully!', {
            position: 'top-right',
            autoClose: 3000,
          });
        } else {
          if (response && response.error) {
            toast.error(`Failed to save changes: ${response.error || 'Unknown error'}`, {
              position: 'top-right',
              autoClose: 3000,
            });
          }
        }
      } else {
        toast.warn('Missing required data to save changes.', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('An unexpected error occurred.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };
  return (
    <div className='flex gap-10 flex-col p-2'>
      <WeeklyCalendar saveChanges={saveChanges} />
      {/* <ImageCaruseka looks={looks} /> */}
      {/* <SwiperComponent /> */}
      <LooksList saveChanges={saveChanges} />
    </div>
  )
}

export default Page