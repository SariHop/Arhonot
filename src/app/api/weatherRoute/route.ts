import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: Request) {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY; // שנה למפתח OpenWeatherMap
    console.log('apiKey',apiKey);
    
    const { searchParams } = new URL(req.url);
    
    let lat = searchParams.get('lat');
    let lon = searchParams.get('lon');

    // אם לא נמסרו קואורדינטות, ננסה לקבל את המיקום לפי ה-IP
    if (!lat || !lon) {
      const ipLocation = await getLocationByIP();
      if (!ipLocation) {
        return NextResponse.json(
          { error: 'No location data available' },
          { status: 400 }
        );
      }
      // אם הצלחנו לקבל את המיקום לפי ה-IP
      lat = ipLocation.lat.toString(); 
      lon = ipLocation.lon.toString();
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=he&units=metric&cnt=40`
    );
    return NextResponse.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        // טיפול בשגיאה 401 - מפתח API או אימות לא תקינים
        return NextResponse.json(
          {
            error: 'הגישה נדחתה: מפתח ה-API או האימות לא תקינים.',
            details: error.response?.data || error.message,
          },
          { status: 401 }
        );
      }
      return NextResponse.json(
        {
          error: 'Failed to fetch weather data',
          details: error.response?.data || error.message,
        },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'Unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// פונקציה לקבלת מיקום על בסיס ה-IP של המשתמש
const getLocationByIP = async () => {
  try {
    const response = await axios.get('http://ip-api.com/json');
    const data = response.data;

    if (data && data.lat && data.lon) {
      return { lat: data.lat, lon: data.lon };
    }
    return null;
  } catch (error) {
    console.error('Error fetching location by IP:', error);
    return null;
  }
};