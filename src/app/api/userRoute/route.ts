import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongoDB";
import User from "@/app/lib/models/userSchema";
import bcrypt from 'bcrypt';
import fs from 'fs/promises';
import axios from "axios";
import path from "path";

const baseUrl=process.env.NEXT_PUBLIC_BASE_URL;
const apiUrl = `${baseUrl}/api/staticData`;


const validateCity = async (city: string) => {
  let cities = [];
  const filePath = path.join(process.cwd(), 'src/app/data/cities.json');
  
  try {
    const stats = await fs.stat(filePath);
    const lastModifiedTime = stats.mtime;  // זמן השינוי האחרון בקובץ

    // בדוק אם הקובץ שונה לאחרונה
    const currentTime = new Date();
    const timeDiff = (currentTime.getTime() - lastModifiedTime.getTime()) / (1000 * 60 * 60 * 24); // הזמן בימים

    if (timeDiff > 1) {  // אם עבר יותר מיום מאז השינוי האחרון
      throw new Error("The cities file is older than 1 day. Fetching new data...");
    } else {
      // קרא את הערים מהקובץ אם הוא לא ישן יותר מיום
      const citiesData = await fs.readFile(filePath, 'utf-8');
      cities = JSON.parse(citiesData);
      console.log(cities);
      
    }
  } catch (error) {
    // אם הקובץ לא קיים או קרתה שגיאה, קרא את הערים מה-API ושמור אותן
    console.error(error);
    
    try {
      const response = await axios.get(`${apiUrl}/cities`);      
      await fs.writeFile(filePath, JSON.stringify(response.data.cities));
      cities = response.data.cities;
    } catch (error) {
      console.error("Error getting cities:", error);
      throw error;
    }
  }

  // אם העיר לא נמצאת ברשימה, זרוק שגיאה
  if (!cities.some((c:string) => c.trim() === city.trim()))  {
    console.error(`Invalid city: ${city}`);
    throw new Error(`Invalid city: ${city}`);
  }
};




export async function GET() {
  try {
    await connect();
    const users = await User.find({});
    return NextResponse.json({ message: "success", data: users });
  } catch (error: unknown) {
    console.error("Error fetching users:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error fetching users", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error fetching users", error: "Unknown error occurred" },
        { status: 501 }
      );
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    await connect();
    const body = await request.json();
    const { password, email, city, ...otherFields } = body;

    await validateCity(city);

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 400 }
      );
    }
    try {
      const user = await User.findOne({ email });
      if (user) {
        return NextResponse.json(
          { message: "This email already exists." },
          { status: 404 }
        );
      }
      const saltRounds = 10;
      // יצירת ההצפנה
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const updatedBody = {
        ...otherFields,
        city,
        email,
        password: hashedPassword,
      };
      console.log("body:")
      console.log(updatedBody);
      const newUser = new User(updatedBody);
      console.log(newUser);
      await newUser.validate();
      const savedUser = await newUser.save();
      console.log("Saved User:", savedUser);
      console.log("Saved User after save:", savedUser.toObject());


      return NextResponse.json(
        { success: true, data: savedUser.toObject() },
        { status: 201 }
      );
    } catch (error) {
      console.error('Error hashing password:', error);
      if (error instanceof Error) {
        return NextResponse.json(
          { message: "Internal server error", error: error.message },
          { status: 502 }
        );
      } else {
        return NextResponse.json(
          { message: "Internal server error", error: "Unknown error occurred" },
          { status: 503 }
        );
      }
    }
  } catch (error: unknown) {
    console.error("Error add user:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error add user", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error add user", error: "Unknown error occurred" },
        { status: 501 }
      );
    }
  }
}
