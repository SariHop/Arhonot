import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongoDB";
import User from "@/app/lib/models/userSchema";
import bcrypt from 'bcrypt';

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
    const { password, ...otherFields } = body;
    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 400 }
      );
    }
    try {
      const saltRounds = 10;
      // יצירת ההצפנה
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const updatedBody = {
        ...otherFields,
        password: hashedPassword,
      };
      console.log("body:")
      console.log(updatedBody);
      const newUser = new User(updatedBody);
      console.log(newUser);

      await newUser.validate();
      const savedUser = await newUser.save();
      console.log("Saved User:", savedUser);

      return NextResponse.json(
        { success: true, data: savedUser.toObject()},
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
