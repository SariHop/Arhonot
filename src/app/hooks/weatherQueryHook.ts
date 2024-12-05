import { useQuery } from '@tanstack/react-query';
import {fetchWeatherData} from '@/app/services/weatherService'
import { WeatherData} from '@/app/types/IWeather'

export const useWeatherQuery = () => {
  return useQuery<WeatherData, Error>({
    queryKey: ['weatherData'],
    queryFn: fetchWeatherData,
    staleTime: 24 * 60 * 60 * 1000, // נתונים תקפים ל-24 שעות
    refetchInterval: 24 * 60 * 60 * 1000, // רענון אחת ל-24 שעות
  });
};