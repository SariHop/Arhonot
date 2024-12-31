import connect from "@/app/lib/db/mongoDB";
import ConnectionRequest from "@/app/lib/models/connectionRequestSchema";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import User from "@/app/lib/models/userSchema";

//פונקציה לביטול התקשרות בין יוזרים
export async function PUT(request: NextRequest) {
    try {
      await connect();
      const url = new URL(request.url);
      const senderId = url.searchParams.get("sender");
      const receiverId = url.searchParams.get("receiver");
      if (!senderId || !receiverId) {
        return NextResponse.json(
          { error: "Both sender and receiver IDs are required" },
          { status: 400 }
        );
      }
  
      if (!Types.ObjectId.isValid(senderId) ||!Types.ObjectId.isValid(receiverId)) {
        return NextResponse.json(
          { error: "Invalid sender or receiver ID" },
          { status: 400 }
        );
      }
  
      // חיפוש המשתמשים ב-DB
      const sender = await User.findById(senderId);
      const receiver = await User.findById(receiverId);
  
      if (!sender || !receiver) {
        return NextResponse.json(
          { error: "One or both IDs not found in the database" },
          { status: 404 }
        );
      }
  
      // מחיקת בקשת חיבור קיימת
      const deleteResult = await ConnectionRequest.deleteOne({
        $or: [
          { userIdSender: senderId, userIdReciver: receiverId },
          { userIdSender: receiverId, userIdReciver: senderId },
        ],
      });
  
      if (deleteResult.deletedCount === 0) {
        return NextResponse.json(
          { error: "Connection request not found" },
          { status: 405 }
        );
      }
  
      //המרה לobjectId
      const objReceiver = new Types.ObjectId(receiverId);
      const objSender = new Types.ObjectId(senderId);
  
      // הסרת ה-ObjectId ממערך ה-children של כל משתמש
      sender.children = sender.children.filter(
        (child) => !child.equals(objReceiver)
      );
      receiver.children = receiver.children.filter(
        (child) => !child.equals(objSender)
      );
  
      // שמירת השינויים ב-DB
      const senderAfterSave = await sender.save();
      const receiverAfterSave = await receiver.save();
      console.log(senderAfterSave,'=senderAfterSave',receiverAfterSave,'=receiverAfterSave');
      
  
      // החזרת תגובה עם היוזר השולח המעודכן
      return NextResponse.json(
        {
          success: true,
          message: "Connection removed successfully",
          data:{
            updatedSender: senderAfterSave,
          }
        },
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
  