import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const apiKey = process.env.WEATHER_API_KEY;
    const response = await axios.get(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=auto:ip&days=7`
    );

    return NextResponse.json(response.data);
    } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json({
        error: 'Failed to fetch weather data',
        details: error.response?.data || error.message,
        status: error.response?.status || 500
      },
      { status: error.response?.status || 500 }
    );
  }

  return NextResponse.json(
    {
      error: 'Unexpected error occurred',
      details: error instanceof Error ? error.message : 'Unknown error'
    },
    { status: 500 }
  );
}
}