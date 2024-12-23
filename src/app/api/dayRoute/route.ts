import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongoDB";
import Day from "@/app/lib/models/daySchema";
import IOutfit from "@/app/types/IOutfit";
import User from "@/app/lib/models/userSchema";

export async function GET() {
  try {
    await connect();
    const days = await Day.find({});
    return NextResponse.json({ message: "success", data: days });
  } catch (error: unknown) {
    console.error("Error fetching days:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error fetching days", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error fetching days", error: "Unknown error occurred" },
        { status: 501 }
      );
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    await connect();
    const body = await request.json();
    const nextDay = new Date(body.date);
    // nextDay.setDate(nextDay.getDate() + 1);    
    const newday = new Day({ ...body, date: nextDay });
    await newday.validate();
    const savedday = await newday.save();
    return NextResponse.json(
      { success: true, data: savedday },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error add day:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error add day", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error add day", error: "Unknown error occurred" },
        { status: 501 }
      );
    }
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connect();
    const { userId, date, looks, weather } = await request.json();
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999); // מגדיר את השעה לסוף היום
    const looksIds = looks.map((look: IOutfit) => look._id);

    const updatedDay = await Day.findOneAndUpdate(
      { userId: userId, date: { $gte: startOfDay, $lte: endOfDay } },
      { looks: looksIds },
      { new: true }
    );

    if (!updatedDay) {
      const userExists = await User.exists({ _id: userId });
      if (userExists) {
        const newDay = new Day({
          userId: userId,
          date: new Date(date), // תאריך נוכחי או מותאם
          looks: looksIds,
          dayDesc: "Sunday",
          weather
        });
        await newDay.save();
        if (newDay) {
          return NextResponse.json(
            { success: true, data: newDay },
            { status: 202 }
          );
        }
        else {
          return NextResponse.json(
            { success: false },
            { status: 400 }
          );
        }
      } else {
        return NextResponse.json(
          { success: false, error: "User does not exist." },
          { status: 404 }
        );
      }
    }
    return NextResponse.json(
      { success: true, data: updatedDay },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error add day:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error add day", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error add day", error: "Unknown error occurred" },
        { status: 501 }
      );
    }
  }
}
