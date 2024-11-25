import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongoDB";
import Day from "@/app/lib/models/daySchema";

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
    const newday = new Day(body);
    console.log(newday);
    
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
