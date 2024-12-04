import { useQuery } from '@tanstack/react-query';
import {fetchWeatherData} from '@/app/services/weatherService'

interface WeatherCondition {
  text: string;
  icon: string;
}

interface HourlyWeather {
  time: string;
  temp_c: number;
  condition: WeatherCondition;
}

interface DailyWeather {
  date: string;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    condition: WeatherCondition;
  };
  hour: HourlyWeather[];
}

interface WeatherData {
  current: {
    temp_c: number;
    condition: WeatherCondition;
  };
  forecast: {
    forecastday: DailyWeather[];
  };
}


export const useWeatherQuery = () => {
  return useQuery<WeatherData, Error>({
    queryKey: ['weatherData'],
    queryFn: fetchWeatherData,
    staleTime: 24 * 60 * 60 * 1000, // נתונים תקפים ל-24 שעות
    refetchInterval: 24 * 60 * 60 * 1000, // רענון אחת ל-24 שעות
  });
};