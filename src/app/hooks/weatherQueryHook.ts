import { useQuery } from '@tanstack/react-query';
import {fetchWeatherData} from '@/app/services/weatherService'
import { WeatherResponse} from '@/app/types/IWeather'
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


export const useWeatherQuery = (/*{ enabled }: { enabled: boolean }*/)  => {
  return useQuery<WeatherResponse, Error>({
    queryKey: ['weatherData'],
    queryFn: async () => {
      try {
        const data = await fetchWeatherData();
        localStorage.setItem('lastFetchTime', String(Date.now())); // עדכון הזמן האחרון
        return data;
      } catch (error: unknown) {
        const errorMessage = (error instanceof Error) ? error.message : 'שגיאה לא ידועה';
        toast.error(`לא הצלחנו למשוך את נתוני מזג האוויר: ${errorMessage}`);
        throw error; 
      }
    },
    staleTime: 24 * 60 * 60 * 1000, // נתונים תקפים ל-24 שעות
    refetchInterval: 24 * 60 * 60 * 1000, // רענון אחת ל-24 שעות
    refetchOnWindowFocus: false,
    // enabled,
  });
};