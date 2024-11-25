import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongoDB";
import ConnectionRequest from "@/app/lib/models/connectionRequestSchema";

export async function GET() {
  try {
    await connect();
    const connectionRequests = await ConnectionRequest.find({});
    return NextResponse.json({ message: "success", data: connectionRequests });
  } catch (error: unknown) {
    console.error("Error fetching connectionRequests:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error fetching connectionRequests", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error fetching connectionRequests", error: "Unknown error occurred" },
        { status: 501 }
      );
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    await connect();
    const body = await request.json();
    const newconnectionRequest = new ConnectionRequest(body);
    console.log(newconnectionRequest);
    
    await newconnectionRequest.validate();
    const savedconnectionRequest = await newconnectionRequest.save();
    return NextResponse.json(
      { success: true, data: savedconnectionRequest },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error add connectionRequest:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error add connectionRequest", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error add connectionRequest", error: "Unknown error occurred" },
        { status: 501 }
      );
    }
  }
}
