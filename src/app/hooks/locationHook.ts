import { useState, useEffect } from 'react';
import { Position } from "@/app/types/IWeather";

export const useLocationTracking = () => {
  const [hasSignificantLocationChange, setHasSignificantLocationChange] = useState(false);

  const calculateDistance = (loc1: Position, loc2: Position): number => {
    const R = 6371; // רדיוס כדור הארץ בק"מ
    const dLat = (loc2.coords.latitude - loc1.coords.latitude) * Math.PI / 180;
    const dLon = (loc2.coords.longitude - loc1.coords.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(loc1.coords.latitude * Math.PI / 180) * Math.cos(loc2.coords.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  useEffect(() => {
    let lastLocation: Position | null = null;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation: Position = {
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        };

        if (!lastLocation) {
          lastLocation = newLocation;
          return;
        }

        // בדיקה האם המרחק גדול מ-10 ק"מ
        const distance = calculateDistance(lastLocation, newLocation);
        if (distance > 10) {
          console.log(`שינוי משמעותי במיקום. מרחק: ${distance.toFixed(2)} ק"מ`);
          lastLocation = newLocation;
          setHasSignificantLocationChange(true);
        }
      },
      (error) => {
        console.error('שגיאה בקבלת מיקום:', error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return {
    hasSignificantLocationChange,
    resetLocationChange: () => setHasSignificantLocationChange(false)
  };
};