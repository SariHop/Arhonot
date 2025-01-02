import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongoDB";
import Alert from "@/app/lib/models/alertSchema";

export async function GET() {
  try {
    await connect();
    const alerts = await Alert.find({});
    return NextResponse.json({ message: "success", data: alerts });
  } catch (error: unknown) {
    console.error("Error fetching alerts:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error fetching alerts", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error fetching alerts", error: "Unknown error occurred" },
        { status: 501 }
      );
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    await connect();
    const { userId, title, desc, date, readen } = await request.json();
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999); // מגדיר את השעה לסוף היום
    const alert = await Alert.findOne({ userId, title, desc, date: { $gte: startOfDay, $lte: endOfDay } });
    if (alert) {
      return NextResponse.json(
        { success: true, data: "alert is already exist." },
        { status: 203 }
      );
    }
    const newAlert = new Alert({ userId, title, desc, date, readen });
    console.log(newAlert);

    await newAlert.validate();
    const savedalert = await newAlert.save();
    return NextResponse.json(
      { success: true, data: savedalert },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error add alert:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error add alert", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error add alert", error: "Unknown error occurred" },
        { status: 501 }
      );
    }
  }
}



