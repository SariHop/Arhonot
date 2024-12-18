'use client'
import { useWeatherQuery } from '@/app/hooks/weatherQueryHook';
import { recommendedLooks } from '@/app/services/outfitAlgo';
import useUser from '@/app/store/userStore';
import IOutfit from '@/app/types/IOutfit';
import React, { useEffect, useState } from 'react';

const Page = () => {
  const { data: weatherData } = useWeatherQuery();
  const user = useUser();
  const [looks, setLooks] = useState<IOutfit[]>([]);

  useEffect(() => {
    const fetchLooks = async () => {
      if (!weatherData || !user) return;
      const recommended = await recommendedLooks(
        weatherData.list || [],
        new Date(),
        user._id,
        user.sensitive
      );
      setLooks(recommended);
    };

    fetchLooks();
  }, [weatherData, user]);



  return (
    <div>
      {looks.map((look: IOutfit, index: number) => (
        < div key={index}>
        <p >{look.season + look.rangeWheather}</p>
        <img src={look.img}/>
        </div>
      ))}
    </div>
  );
};

export default Page;
