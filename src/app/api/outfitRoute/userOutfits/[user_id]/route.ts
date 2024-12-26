import connect from "@/app/lib/db/mongoDB";
import Day from "@/app/lib/models/daySchema";
import Outfit from "@/app/lib/models/outfitSchema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest,{ params }: { params: { user_id: string } }) {
    try {
      await connect();
      const _id = params.user_id;
  
      if (!_id) {
        return NextResponse.json(
          { error: "Missing user_id parameter" },
          { status: 400 }
        );
      }
  
      // שליפת כל הלוקים של המשתמש
      const outfits = await Outfit.find({ userId: _id });
      
  
      // חישוב טווח תאריכים של החודש האחרון
      const now = new Date();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);
  
      // שליפת כל הימים של המשתמש בטווח החודש האחרון
      const days = await Day.find({
        userId: _id,
        date: { $gte: oneMonthAgo, $lte: now },
      });
  
      if (!days || days.length === 0) {
        // אם אין ימים לחודש האחרון, נחזיר את הלוקים כמו שהם
        return NextResponse.json({ success: true, data: outfits }, { status: 200 });
      }
  
      // יצירת מיפוי של כמות הופעות לכל לוק
      const outfitCountMap: Record<string, number> = {};
      days.forEach((day) => {
        day.looks.forEach((lookId) => {
          const lookIdString = String(lookId); // מוודאים שה-ID הוא מחרוזת
          outfitCountMap[lookIdString] = (outfitCountMap[lookIdString] || 0) + 1;
        });
      });
    
      // הוספת כמות ההופעות לכל לוק
      const outfitsWithCount = outfits.map((outfit) => ({
        ...outfit.toObject(),
        appearanceCount: outfitCountMap[String(outfit._id)] || 0, // ברירת מחדל 0 אם לא הופיע
      }));
  
      return NextResponse.json({ success: true, data: outfitsWithCount }, { status: 200 });
    } catch (error: unknown) {
      console.error("Error getting outfits of user:", error);
      if (error instanceof Error) {
        return NextResponse.json(
          { message: "Error getting outfits of user", error: error.message },
          { status: 500 }
        );
      } else {
        return NextResponse.json(
          { message: "Error getting outfits of user", error: "Unknown error occurred" },
          { status: 501 }
        );
      }
    }
  }