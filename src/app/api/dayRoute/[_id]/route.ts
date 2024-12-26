import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongoDB";
import Day from "@/app/lib/models/daySchema";
import { OutfitSchema } from '@/app/lib/models/outfitSchema';  // שינוי לפי המיקום של המודל
import IOutfit from "@/app/types/IOutfit";
import mongoose from 'mongoose';
if (!mongoose.models.Outfit) {
  mongoose.model<IOutfit>('Outfit', OutfitSchema);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { _id: string } }
) {
  try {
    console.log("Request method:", request.method); //NextRequestשימוש סמלי ב
    await connect();
    const _id = params._id;

    if (!_id) {
      return NextResponse.json(
        { error: "Missing _id parameter" },
        { status: 400 }
      );
    }
    const day = await Day.findById(_id);
    if (!day) {
      return NextResponse.json({ error: "day not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: day }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error add day:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error get day", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error get day", error: "Unknown error occurred" },
        { status: 501 }
      );
    }
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { _id: string } }
) {
  try {
    console.log("Request method:", request.method); //NextRequestשימוש סמלי ב

    await connect();
    const _id = params._id;

    if (!_id) {
      return NextResponse.json(
        { error: "Missing _id parameter" },
        { status: 400 }
      );
    }
    const day = await Day.findById(_id);
    if (!day) {
      return NextResponse.json({ error: "day not found" }, { status: 404 });
    }
    await Day.findByIdAndDelete(_id);
    return NextResponse.json(
      { success: true, message: "day deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error deleting day:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error deleting day", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error deleting day", error: "Unknown error occurred" },
        { status: 501 }
      );
    }
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { _id: string } }
) {
  try {
    await connect();
    const _id = params._id;
    if (!_id) {
      return NextResponse.json(
        { error: "Missing _id parameter" },
        { status: 400 }
      );
    }
    const existingday = await Day.findById(_id);
    if (!existingday) {
      return NextResponse.json({ error: "day not found" }, { status: 404 });
    }

    const body = await request.json();

    const updatedday = await Day.findByIdAndUpdate(_id, body, {
      new: true, // מחזיר את המסמך המעודכן
      runValidators: true, // מפעיל ולידציות על הנתונים החדשים
    });
    return NextResponse.json(
      { success: true, data: updatedday },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error updating day:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error updating day", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error updating day", error: "Unknown error occurred" },
        { status: 501 }
      );
    }
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { _id: string } }
) {
  try {
    // קבלת נתוני הבקשה
    const { date } = await request.json();
    console.log("Request method:", request.method);
    // התחברות לבסיס הנתונים
    await connect();
    // ולידציה לפרמטרים
    const _id = params._id;
    if (!_id) {
      return NextResponse.json(
        { error: "Missing user ID (_id) parameter" },
        { status: 400 }
      );
    }

    if (!date) {
      return NextResponse.json(
        { error: "Missing date parameter in request body" },
        { status: 401 }
      );
    }

    // חיפוש רשומה בבסיס הנתונים
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0); // מאפס את השעה לתחילת היום

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999); // מגדיר את השעה לסוף היום
    const day = await Day.findOne({
      userId: _id,
      date: { $gte: startOfDay, $lte: endOfDay }
    }).populate("looks");
    // if (!day) {
    //   return NextResponse.json(
    //     { error: "No record found for the provided user ID and date" },
    //     { status: 404 }
    //   );
    // }
    // החזרת תגובה מוצלחת
    return NextResponse.json(
      { success: true, data: day },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error occurred while retrieving day:", error);

    // טיפול בשגיאה
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Server error", details: error.message },
        { status: 500 }
      );
    }

    // שגיאה לא מזוהה
    return NextResponse.json(
      { error: "Unknown error occurred" },
      { status: 500 }
    );
  }
}

