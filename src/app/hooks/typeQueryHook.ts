import { useQuery } from '@tanstack/react-query';
import { fetchTypes } from '../services/categoriesService';


export const useTypeQuery = () => {
  return useQuery({
    queryKey: ['types'],
    queryFn: () => fetchTypes(),
    staleTime: 24 * 60 * 60 * 1000, // נתונים תקפים ל-24 שעות
    refetchInterval: 24 * 60 * 60 * 1000, // רענון אחת ל-24 שעות
  });
};
