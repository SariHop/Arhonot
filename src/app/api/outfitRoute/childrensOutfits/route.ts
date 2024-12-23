import connect from "@/app/lib/db/mongoDB";
import Day from "@/app/lib/models/daySchema";
import User from "@/app/lib/models/userSchema";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connect(); // חיבור לבסיס הנתונים
    const { userId, date }: { userId: string; date: Date } = await request.json();
    console.log(date);
    // מציאת הילדים של המשתמש
    const user = await User.findById(userId)
      .select("children")
      .populate<{ children: { _id: Types.ObjectId; userName: string }[] }>("children", "userName"); // הגדרת טיפוס מותאם

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const childrenIds: string[] = user.children.map((child) => String(child._id));
    // הגדרת תחום התאריכים לאותו יום
    const startDate = new Date(date);
    // startDate.setDate(startDate.getDate() + 1)
    startDate.setUTCHours(0, 0, 0, 0); // תחילת היום
    const endDate = new Date(date);
    // endDate.setDate(endDate.getDate() + 1)
    endDate.setUTCHours(23, 59, 59, 999); // סוף היום
    console.log(startDate)
    console.log(endDate)

    // מציאת כל הימים עם לוקים של הילדים לתאריך המבוקש
    const days = await Day.find({
      userId: { $in: childrenIds }, // מציאת ימים ששייכים לילדים
      date: { $gte: startDate, $lte: endDate }, // סינון לפי תאריך
    })
      .populate("looks") // מביא את המידע על הלוקים
      .lean(); // מחזיר אובייקטים פשוטים שניתן לערוך      
    // הוספת שמות הילדים לאובייקטים של days
    const childrenMap = new Map(
      user.children.map((child) => [String(child._id), child.userName])
    );

    const daysWithNames = days.map((day) => ({
      ...day,
      childName: childrenMap.get(day.userId.toString()), // הוספת שם הילד לכל יום
    }));

    return NextResponse.json({ days: daysWithNames, status: 200 }); // מחזיר את הימים שנמצאו
  } catch (error: unknown) {
    console.error("Error getting outfits for children:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error getting outfits for children", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error getting outfits for children", error: "Unknown error occurred" },
        { status: 501 }
      );
    }
  }
}


