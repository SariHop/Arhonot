import connect from "@/app/lib/db/mongoDB";
import ConnectionRequest from "@/app/lib/models/connectionRequestSchema";
import { isValidObjectId, Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import User from "@/app/lib/models/userSchema";

export async function GET(
  request: NextRequest,
  { params }: { params: { _id_user: Types.ObjectId } }
) {
  try {
    console.log("Request method:", request.method); // לשם דיבאג
    await connect();

    const _idUser = params._id_user;
    console.log("Params:", params);

    if (!_idUser) {
      return NextResponse.json(
        { error: "Missing user's _id parameter" },
        { status: 400 }
      );
    }

    // חיפוש ההתראות של המשתמש
    const connectionReq = await ConnectionRequest.find({
      userIdReciver: _idUser,
    });

    return NextResponse.json(
      { success: true, data: connectionReq },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error get connection requests:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error getting connection requests", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        {
          message: "Error getting connection requests",
          error: "Unknown error occurred",
        },
        { status: 500 }
      );
    }
  }
}
//פונקציה לביטול התקשרות בין יוזרים
export async function PUT(
  request: NextRequest,
  {params,}: {params: { _id_user: string }}
) {
  try {
    const sender = params._id_user.trim();
    console.log("Cleaned params._id_user:", sender);
    const { userIdToRemove } = await request.json();
    console.log("Raw userIdToRemove from request body:", userIdToRemove);

    await connect();
    // המרת הערכים ל-ObjectId
    const senderId = new Types.ObjectId(sender);
    const removeId = new Types.ObjectId(userIdToRemove.trim());
    console.log("Parsed ObjectId for senderId:", senderId);
    console.log("Parsed ObjectId for removeId:", removeId);

    if (!isValidObjectId(senderId)) {
      console.error("Invalid senderId format:", senderId);
      return NextResponse.json(
        { error: `Invalid senderId format: ${senderId}` },
        { status: 400 }
      );
    }

    if (!isValidObjectId(removeId)) {
      console.error("Invalid userIdToRemove format:", removeId);
      return NextResponse.json(
        { error: `Invalid userIdToRemove format: ${removeId}` },
        { status: 400 }
      );
    }
    // בדיקת קיום משתמשים בבסיס הנתונים
    const [existSender, existRemove] = await Promise.all([
      User.findById(senderId),
      User.findById(removeId),
    ]);
    console.log("existSender:", existSender);
    console.log("existRemove:", existRemove);

    if (!existSender || !existRemove) {
      console.error("One or both users not found:", {
        existSender,
        existRemove,
      });
      return NextResponse.json(
        { error: "One or both users not found in the database." },
        { status: 404 }
      );
    }

    // חיפוש בקשת חיבור קיימת
    const connectionRequest = await ConnectionRequest.findOne({
      $or: [
        { userIdSender: senderId, userIdReciver: removeId },
        { userIdSender: removeId, userIdReciver: senderId },
      ],
    });
    console.log("Connection request found:", connectionRequest);
    if (!connectionRequest) {
      return NextResponse.json(
        { error: "connection erquest not found" },
        { status: 404 }
      );
    }
    // מחיקת בקשת חיבור אם נמצאה
    await connectionRequest.deleteOne();
    console.log("Connection request deleted");
    const [updateSender, updateRemove] = await Promise.all([
      User.updateOne({ _id: senderId }, { $pull: { children: removeId } }),
      User.updateOne({ _id: removeId }, { $pull: { children: senderId } }),
    ]);

    console.log("Updated sender's children list:", updateSender);
    console.log("Updated removeId's children list:", updateRemove);

    return NextResponse.json(
      { success: true, message: "Connection and users updated successfully" ,data:{
        existSender, existRemove
      }},
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error during operation:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error removing connection", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        {
          message: "Error removing connection",
          error: "Unknown error occurred",
        },
        { status: 501 }
      );
    }
  }
}
