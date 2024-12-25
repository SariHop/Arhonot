import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongoDB";
import User from "@/app/lib/models/userSchema";
import ConnectionRequest from "@/app/lib/models/connectionRequestSchema";
import { Types } from "mongoose";
// import Alert from "@/app/lib/models/alertSchema";

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
        {
          message: "Error fetching connectionRequests",
          error: "Unknown error occurred",
        },
        { status: 501 }
      );
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    await connect();
    const body = await request.json();
    const { userIdSender, userIdReciver } = body;
    const senderId = new Types.ObjectId(userIdSender.trim());
    const removeId = new Types.ObjectId(userIdReciver.trim());

    const connectionRequest = await ConnectionRequest.findOne({
      $or: [
        { userIdSender: senderId, userIdReciver: removeId },
        { userIdSender: removeId, userIdReciver: senderId },
      ],
    });

    if (connectionRequest) {
      if (connectionRequest?.status === "rejected") {
        // אם בקשת חיבור קיימת, עדכן את הסטטוס ל-pending
        connectionRequest.status = "pending";
        const updatedConnectionRequest = await connectionRequest.save();
        return NextResponse.json(
          {
            success: true,
            message: "Connection request status updated to pending",
            data: updatedConnectionRequest,
          },
          { status: 201 }
        );
      } else if (connectionRequest?.status === "accepted") {
        return NextResponse.json(
          {
            success: true,
            message: "Connection request status already acceted",
            data: connectionRequest,
          },
          { status: 202 }
        );
      }
      else{
        return NextResponse.json(
          {
            success: true,
            message: "Connection request status already pending",
            data: connectionRequest,
          },
          { status: 203 }
        );

      }
    } else {
      const newconnectionRequest = new ConnectionRequest(body);
      console.log(newconnectionRequest);

      await newconnectionRequest.validate();
      const savedconnectionRequest = await newconnectionRequest.save();
      return NextResponse.json(
        { success: true, data: savedconnectionRequest, message: "Connection request status created", },
        { status: 200 }
      );
    }
  } catch (error: unknown) {
    console.error("Error add connectionRequest:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error add connectionRequest", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        {
          message: "Error add connectionRequest",
          error: "Unknown error occurred",
        },
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
    const senderAfterSave= await sender.save();
    const receiverAfterSave= await receiver.save();

    return NextResponse.json(
      { success: true, message: "Connections updated successfully",data:{
        sender: senderAfterSave,
        receiver: receiverAfterSave,
      },},
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
