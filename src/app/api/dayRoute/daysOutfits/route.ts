import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongoDB";
import Day from "@/app/lib/models/daySchema";
import { OutfitSchema } from '@/app/lib/models/outfitSchema';  // שינוי לפי המיקום של המודל
import mongoose from 'mongoose';
import IOutfit from "@/app/types/IOutfit";

if (!mongoose.models.Outfit) {
     mongoose.model<IOutfit>('Outfit', OutfitSchema);
  }


export async function POST(request: NextRequest) {
  try {
    await connect(); // חיבור לבסיס הנתונים
    const { userId, month, year }:{userId: string, month:number, year:number} = await request.json();

    if(!userId || 0 > month || month > 11 || !year){
      console.log("userId", userId, "month", month, "year", year);
      
      return NextResponse.json({status:false, message: "שגיאה בקבלת נתונים"}, { status: 400 }); 
    }

    const startDate = new Date(Date.UTC(year, month, 1));  // החודש 0-based
    const endDate = new Date(Date.UTC(year, month + 1, 0));        // סוף החודש הנוכחי
    endDate.setUTCHours(23, 59, 59, 999); // עד סוף היום האחרון בחודש
    
    const days = await Day.find({
    userId: userId,
    date: { $gte: startDate, $lte: endDate}
    }).populate("looks"); // שימוש ב-Populate כדי להחזיר את המידע של ה-Outfits

    // .sort({ date: 1 });
    
    return NextResponse.json(days, { status: 200 }); // החזרת הימים שנמצאו
  } catch (error: unknown) {
    console.error("Error getting days of user:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error getting days of user", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error getting days of user", error: "Unknown error occurred" },
        { status: 501 }
      );
    }
  }
}
