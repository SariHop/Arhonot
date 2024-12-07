import axios from "axios";
import { toast } from "react-toastify";
import { apiUrl } from '@/app/services/garmentService'
import {Position} from "@/app/types/IWeather"
// טיפוס למיקום


export const fetchWeatherData = async () => {
  try {
    // קבלת המיקום של המשתמש בצורה חכמה
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
  }  catch (error) {
    // טיפול בשגיאות במקרה של בעיות עם הגישה למיקום
    if (error instanceof Error && error.message.includes("User denied")) {
      toast.error("לא ניתן לגשת למיקום שלך. אנא אפשר את גישת המיקום.");
    } else if (axios.isAxiosError(error)) {
      // טיפול בשגיאות של בקשות לשרת
      toast.error("לא הצלחנו למשוך את נתוני מזג האוויר. נסה שוב מאוחר יותר.");
    } else {
      toast.error("התרחשה שגיאה לא צפויה. נסה שוב.");
    }
    throw error; 
  }
};
