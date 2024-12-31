import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const city = new URL(request.url).searchParams.get("city");

  if (!city) {
    return NextResponse.json({ error: "City is required" }, { status: 400 });
  }

  const apiKey = process.env.COORDINATES_A_PLACE_APIKEY;
  const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=${apiKey}&language=he&no_annotations=1`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry;
      return NextResponse.json({ lat, lon: lng }, { status: 200 });
    } else {
      return NextResponse.json({ error: "No coordinates found for the given city" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return NextResponse.json({ error: "Failed to fetch coordinates" }, { status: 500 });
  }
}
