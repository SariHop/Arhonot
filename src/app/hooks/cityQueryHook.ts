import { useQuery } from '@tanstack/react-query';
import { fetchCities } from '../services/categoriesService';


export const useCityQuery = () => {
  return useQuery({
    queryKey: ['cities'],
    queryFn: () => fetchCities(),
    staleTime: 24 * 60 * 60 * 1000, // נתונים תקפים ל-24 שעות
    refetchInterval: 24 * 60 * 60 * 1000, // רענון אחת ל-24 שעות
  });
};
