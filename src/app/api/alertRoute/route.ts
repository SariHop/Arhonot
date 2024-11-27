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
    const body = await request.json();
    const newalert = new Alert(body);
    console.log(newalert);
    
    await newalert.validate();
    const savedalert = await newalert.save();
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


