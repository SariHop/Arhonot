import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongoDB";
import Garment from "@/app/lib/models/garmentSchema";

export async function GET() {
  try {
    await connect();
    const garments = await Garment.find({});
    return NextResponse.json({ message: "success", data: garments });
  } catch (error: unknown) {
    console.error("Error fetching garments:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error fetching garments", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error fetching garments", error: "Unknown error occurred" },
        { status: 501 }
      );
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    await connect();
    const body = await request.json();
    const newgarment = new Garment(body);
    console.log(newgarment);
    
    await newgarment.validate();
    const savedgarment = await newgarment.save();
    return NextResponse.json(
      { success: true, data: savedgarment },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error add garment:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error add garment", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error add garment", error: "Unknown error occurred" },
        { status: 501 }
      );
    }
  }
}
