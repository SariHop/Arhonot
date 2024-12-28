import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongoDB";
import User from "@/app/lib/models/userSchema";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import Alert from "@/app/lib/models/alertSchema";

export async function POST(request: NextRequest) {
  try {
    await connect();
    const body = await request.json();
    const { password, email, city, originUserId, ...otherFields } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { message: "This email already exists." },
        { status: 404 }
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const updatedBody = {
      ...otherFields,
      city,
      email,
      password: hashedPassword,
    };

    const newUser = new User(updatedBody);
    await newUser.validate();
    const savedUser = await newUser.save();
    const formattedDesc = "אנחנו כאן כדי לעזור לך לבחור את הלוק המושלם לכל יום, בהתאמה למזג האוויר! בין אם השמש זורחת או שמיים מעוננים, אנחנו נספק לך את ההמלצות הכי טרנדיות ונוחות לפי תחזית מזג האוויר באזור שלך.\nהתחל לחקור ולהתלבש בהתאם למזג האוויר – כי כל יום הוא הזדמנות חדשה לבלות בו בסטייל!";
    const welcomeAlert = new Alert({
      userId: savedUser._id,
      title: "ברוך הבא לארעונות! 🌤️👗",
      desc: formattedDesc,
      date: new Date(),
      readen: false
    });
    welcomeAlert.save();

    const desc = "חשבון מקושר נוסף בהצלחה";
    const alert = new Alert({
      userId: originUserId,
      title: "חשבון מקושר נוסף בהצלחה",
      desc,
      date: new Date(),
      readen: false
    });
    alert.save();
    // חיפוש לשם עדכון משתמש מקורי
    const creator = await User.findById(originUserId);
    if (!creator) {
      return NextResponse.json(
        { message: "Creator user not found" },
        { status: 404 }
      );
    }

    // עדכון מערכים מקושרים
    if (creator) {
      creator.children = creator.children || [];
      creator.children.push(savedUser._id as Types.ObjectId);
      await creator.save();
    }

    if (savedUser) {
      savedUser.children = savedUser.children || [];
      savedUser.children.push(creator._id as Types.ObjectId);
      await savedUser.save();
    }

    return NextResponse.json(
      { success: true, data: savedUser.toObject() },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error add user:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error add user", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error add user", error: "Unknown error occurred" },
        { status: 501 }
      );
    }
  }
}


//פונקציה לחיפוש קשר בין יוזרים
export async function GET(request: NextRequest) {
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

    if (!sender) {
      return NextResponse.json(
        { error: "Sender not found in the database" },
        { status: 404 }
      );
    }

    if (!receiver) {
      return NextResponse.json(
        { error: "Receiver not found in the database" },
        { status: 404 }
      );
    }

    const objReceiver = new Types.ObjectId(receiverId);

    // בדיקה האם המקבל נמצא במערך ה-children של השולח או זהה לשולח
    const isReceiverAuthorized =
      sender.children.some((child) => child.equals(objReceiver)) ||
      senderId === receiverId;

    if (isReceiverAuthorized) {
      return NextResponse.json(
        {
          success: true,
          message: "Receiver is authorized",
          data: {
            sender,
            receiver,
          },
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Receiver is not authorized for this sender",
        },
        { status: 403 }
      );
    }
  } catch (error: unknown) {
    console.error("Error during operation:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error validating connection", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        {
          message: "Error validating connection",
          error: "Unknown error occurred",
        },
        { status: 501 }
      );
    }
  }
}