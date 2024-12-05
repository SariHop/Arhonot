import { useQuery } from '@tanstack/react-query';
import { fetchTags } from '../services/categoriesService';


export const useTagQuery = () => {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => fetchTags(),
    staleTime: 24 * 60 * 60 * 1000, // נתונים תקפים ל-24 שעות
    refetchInterval: 24 * 60 * 60 * 1000, // רענון אחת ל-24 שעות
  });
};
