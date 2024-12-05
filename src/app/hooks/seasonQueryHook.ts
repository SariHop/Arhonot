import { useQuery } from '@tanstack/react-query';
import { fetchSeasons } from '../services/categoriesService';


export const useSeasonQuery = () => {
  return useQuery({
    queryKey: ['seasons'],
    queryFn: () => fetchSeasons(),
    staleTime: 24 * 60 * 60 * 1000, // נתונים תקפים ל-24 שעות
    refetchInterval: 24 * 60 * 60 * 1000, // רענון אחת ל-24 שעות
  });
};
