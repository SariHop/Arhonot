import axios from "axios";
import { toast } from "react-toastify";
import { apiUrl } from "@/app/services/garmentService";
import { Position, WeatherData } from "@/app/types/IWeather";
import { Types } from "mongoose";

export const fetchWeatherData = async () => {
  try {
    const position = await new Promise<Position>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    console.log(position);
    const { latitude, longitude } = position.coords;

    const response = await axios.get(`${apiUrl}weatherRoute`, {
      params: {
        lat: latitude,
        lon: longitude,
      },
    });

    return response.data;
  } catch (error) {
    // טיפול בשגיאות במקרה של בעיות עם הגישה למיקום
    if (error instanceof Error && error.message.includes("User denied")) {
      toast.error("לא ניתן לגשת למיקום שלך. אנא אפשר את גישת המיקום.");
    } else {
      throw error;
    }
  }
};


// פונקציה לחישוב הטמפרטורה המקסימלית ליום מסוים
export const getMaxTemperatureForDate = (list: WeatherData[], targetDate: Date) => {
  // return 5;
  const dailyForecasts = list.filter((entry) => {
    // חילוץ התאריך (ללא השעה) מהשדה dt_txt
    const date = entry.dt_txt.split(" ")[0];
    return date === targetDate.toISOString().split("T")[0];
  });

  // אם אין נתונים ליום המבוקש, נחזיר null
  if (dailyForecasts.length === 0) {
    return null;
  }

  const maxTemp = dailyForecasts.reduce((max, entry) => {
    return Math.max(max, entry.main.temp_max);
  }, -Infinity);
  return maxTemp;
};



export const fetchUserOutfits = async (userId: Types.ObjectId|null) => {
  try {
    const response = await axios.get(`${apiUrl}outfitRoute/userOutfits/${userId}`);
    return response.data.data;

  } 
  catch (error) {
    console.log("לא הצלחנו לגשת חנתוני הלוקים שלך");
    throw error;
  }
};

