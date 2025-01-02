"use client";
import React, { useEffect, useState } from 'react'
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
import Carusela from '@/app/components/swiper/Carusela';

const Page = () => {
  const { data: weatherData } = useWeatherQuery();
  const user = useUser();
  const { selectedDate, setSelectedDate, setOutfits, setUserId, userId, addToAllLooks, selectedLooks } = useDay();
  const [changed, setChanged] = useState(false);

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
              console.log("error with algorithem", error);
              toast.warn("אין לך לוקים מתאימים למזג אוויר זה, הוסף לוק", {
                position: 'top-right',
                autoClose: 3000,
              });
            }
          }
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            const serverError = error.response?.data?.error || "Unknown server error";
            const status = error.response?.status || 500;

            if (status === 500) {
              toast.error(`שגיאת שרת: ${serverError}`);
            }
            else {
              toast.error("אירעה שגיאה לא צפויה בעת טעינת לוקים");
            }
          } else {
            // toast.error(" אירעה שגיאה בעת טעינת לוקים");
          }
          setOutfits([]);
          // if (weatherData) {
          //   const looks = await recommendedLooks(weatherData.list, selectedDate, userId, user.sensitive);
          //   console.log("looks from algorithem: ", looks);
          //   addToAllLooks(looks);
          // }
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
          toast.success("השינויים נשמרו בהצלחה", {
            position: 'top-right',
            autoClose: 3000,
          });
        } else {
          if (response && response.error) {
            toast.error(`שגיאה בשמירת נתונים: ${response.error || 'Unknown error'}`, {
              position: 'top-right',
              autoClose: 3000,
            });
          }
        }
      } else {
        toast.warn('חסר נתוני מזג אוויר כדי לשמור את השינוים', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('אירעה שגיאה בלתי צפויה בעת שמירת הנתונים', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };
  return (
    <div className='flex gap-10 flex-col  py-5  h-full' >
      <WeeklyCalendar saveChanges={saveChanges} changed={changed} setChanged={setChanged} />
      {/* <ImageCaruseka looks={looks} /> */}
      {/* <SwiperComponent /> */}
      <div >
        <Carusela setChanged={setChanged} />
      </div>
      <LooksList saveChanges={saveChanges} changed={changed} setChanged={setChanged} />
    </div>
  )
}

export default Page