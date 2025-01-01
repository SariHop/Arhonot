import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const city = new URL(request.url).searchParams.get("city");

  if (!city) {
    return NextResponse.json({ error: "City is required" }, { status: 400 });
  }

  const apiKey = process.env.COORDINATES_A_PLACE_APIKEY;
  const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=${apiKey}&language=he&no_annotations=1`;

   // קואורדינטות ברירת מחדל לתל אביב
   const defaultCoordinates = { lat: 32.0853, lon: 34.7818 };
  try {
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        return NextResponse.json({ lat, lon: lng }, { status: 200 });
      }
      
      // אם לא נמצאו תוצאות - נחזיר את ברירת המחדל
      console.log(`No coordinates found for city: ${city}. Using default coordinates.`);
      return NextResponse.json(defaultCoordinates, { status: 200 });
      
    } catch (error) {
      // במקרה של שגיאה - נחזיר את ברירת המחדל
      console.error(`Error fetching coordinates for city: ${city}. Using default coordinates.`, error);
      return NextResponse.json(defaultCoordinates, { status: 200 });
    }
  }