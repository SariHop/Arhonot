import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongoDB";
import { Types } from "mongoose";
import User from "@/app/lib/models/userSchema";
import ConnectionRequest from "@/app/lib/models/connectionRequestSchema";
import Alert from "@/app/lib/models/alertSchema";

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

export async function PUT(request: NextRequest) {
  try {
    await connect();

    // קבלת ה-Query Params
    const url = new URL(request.url);
    const senderId = url.searchParams.get("sender");
    const receiverId = url.searchParams.get("receiver");


    if (!senderId || !receiverId) {
      return NextResponse.json(
        { error: "Both sender and receiver IDs are required" },
        { status: 400 }
      );
    }

    // חיפוש הרשומות ב-DB
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return NextResponse.json(
        { error: "One or both IDs not found in the database" },
        { status: 404 }
      );
    }

    // עדכון שדה ה-children
    const objReciver = new Types.ObjectId(receiverId);
    const objSender = new Types.ObjectId(senderId);
    if (!sender.children.includes(objReciver))
      sender.children = [...(sender.children || []), objReciver];
    if (!receiver.children.includes(objSender))
      receiver.children = [...(receiver.children || []), objSender];

    // שמירת השינויים ב-DB
    await sender.save();
    await receiver.save();
    const formattedDesc = `בקשת החיבור שלך ל${receiver.userName} התקבל והנך מקושר/ת כעת ל${receiver.userName}`;
    const alert = new Alert({
      userId: sender._id,
      title: "בקשת התחברות נענתה בהצלחה",
      desc: formattedDesc,
      date: new Date(),
      readen: false
    });
    alert.save();
    return NextResponse.json(
      { success: true, message: "Connections updated successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error updating connections:", error);

    return NextResponse.json(
      { error: "An error occurred while updating connections" },
      { status: 500 }
    );
  }
}
