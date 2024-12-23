import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongoDB";
import User from "@/app/lib/models/userSchema";
import bcrypt from 'bcrypt';
import Alert from "@/app/lib/models/alertSchema";


export async function GET() {
  try {
    await connect();
    const users = await User.find({});
    return NextResponse.json({ message: "success", data: users });
  } catch (error: unknown) {
    console.error("Error fetching users:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error fetching users", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error fetching users", error: "Unknown error occurred" },
        { status: 501 }
      );
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    await connect();
    const body = await request.json();
    const { password, email, city, ...otherFields } = body;

    // await validateCity(city);
    if (city && city.length > 25) {
      return NextResponse.json(
        { message: "Invalid city" },
        { status: 402 }
      );
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 400 }
      );
    }
    try {
      const user = await User.findOne({ email });
      if (user) {
        return NextResponse.json(
          { message: "This email already exists." },
          { status: 404 }
        );
      }
      const saltRounds = 10;
      // יצירת ההצפנה
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const updatedBody = {
        ...otherFields,
        city,
        email,
        password: hashedPassword,
      };
      console.log("body:")
      console.log(updatedBody);
      const newUser = new User(updatedBody);
      console.log(newUser);
      await newUser.validate();
      const savedUser = await newUser.save();
      console.log("Saved User:", savedUser);
      console.log("Saved User after save:", savedUser.toObject());
      const formattedDesc = "אנחנו כאן כדי לעזור לך לבחור את הלוק המושלם לכל יום, בהתאמה למזג האוויר! בין אם השמש זורחת או שמיים מעוננים, אנחנו נספק לך את ההמלצות הכי טרנדיות ונוחות לפי תחזית מזג האוויר באזור שלך.\nהתחל לחקור ולהתלבש בהתאם למזג האוויר – כי כל יום הוא הזדמנות חדשה לבלות בו בסטייל!";
      const welcomeAlert = new Alert({
        userId: savedUser._id,
        title: "ברוך הבא לארעונות! 🌤️👗",
        desc: formattedDesc,
        date: new Date(),
        readen: false
      });

      welcomeAlert.save();
      return NextResponse.json(
        { success: true, data: savedUser.toObject() },
        { status: 201 }
      );
    } catch (error) {
      console.error('Error hashing password:', error);
      if (error instanceof Error) {
        return NextResponse.json(
          { message: "Internal server error", error: error.message },
          { status: 502 }
        );
      } else {
        return NextResponse.json(
          { message: "Internal server error", error: "Unknown error occurred" },
          { status: 503 }
        );
      }
    }
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
