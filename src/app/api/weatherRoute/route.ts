import { NextResponse } from "next/server";
import axios from "axios";
import connect from "@/app/lib/db/mongoDB";
import jwt from "jsonwebtoken";
import User from "@/app/lib/models/userSchema";

export async function GET(req: Request) {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY; 
    const { searchParams } = new URL(req.url);

    let lat = searchParams.get("lat");
    let lon = searchParams.get("lon");
    console.log("Initial lat and lon from searchParams:", { lat, lon });

    if (!lat || !lon) {
      console.log("Attempting to get coordinates from user data...");
      const cookieHeader = req.headers.get("cookie");
    
      if (!cookieHeader) {
        return NextResponse.json({ error: "Missing cookies" }, { status: 401 });
      }
    
      const token = cookieHeader.match(/auth_token=([^;]+)/)?.[1];

      if (!token) {
        return NextResponse.json(
          { error: "Missing auth_token cookie" },
          { status: 401 }
        );
      }
    
      const secretKey = process.env.SECRET_KEY;
      if (!secretKey) {
        throw new Error("SECRET_KEY is not defined in .env file");
      }
    
      let decoded;
      try {
        decoded = jwt.verify(token, secretKey) as { email: string };
        console.log("Decoded token:", decoded);
      } catch (error) {
        return NextResponse.json(
          {error: "Invalid token", details: error instanceof Error ? error.message : "Unknown error",},
          { status: 401 });
      }
    
      await connect();
      const user = await User.findOne({ email: { $regex: new RegExp(`^${decoded.email}$`, "i") } });
      if (user && user.lat && user.lon) {
        lat = user.lat.toString();
        lon = user.lon.toString();
        console.log("Coordinates from user data:", { lat, lon });
      } else {
        console.log("No user data available or missing coordinates.");
      }
    }
    
    if (!lat || !lon) {
      console.log("Attempting to get coordinates from IP...");
      const ipLocation = await getLocationByIP();
      if (ipLocation) {
        lat = ipLocation.lat.toString();
        lon = ipLocation.lon.toString();
        console.log("Coordinates from IP location:", { lat, lon });
      } else {
        console.log("Unable to get coordinates from IP.");
        return NextResponse.json(
          { error: "Unable to determine location" },
          { status: 400 }
        );
      }
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
          {error: "הגישה נדחתה: מפתח ה-API או האימות לא תקינים.", details: error.response?.data || error.message, },
          { status: 401 });
      }
      return NextResponse.json(
        {error: "Failed to fetch weather data", details: error.response?.data || error.message, },
        { status: error.response?.status || 500 });
    }

    return NextResponse.json(
      { error: "Unexpected error occurred", details: error instanceof Error ? error.message : "Unknown error", },
      { status: 500 } );
  }
}

// פונקציה לקבלת מיקום על בסיס ה-IP של המשתמש
const getLocationByIP = async () => {
  try {
    const response = await axios.get("http://ip-api.com/json");
    const data = response.data;

    if (data && data.lat && data.lon) {
      return { lat: data.lat, lon: data.lon };
    }
    return null;
  } catch (error) {
    console.error("Error fetching location by IP:", error);
    return null;
  }
};
