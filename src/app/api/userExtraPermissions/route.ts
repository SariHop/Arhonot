import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongoDB";
import User from "@/app/lib/models/userSchema";
import { validateCity } from "@/app/api/userRoute/route";
import bcrypt from "bcrypt";
import { Types } from "mongoose";

export async function POST(request: NextRequest) {
  try {
    await connect();
    const body = await request.json();
    const { password, email, city, creatorId, ...otherFields } = body;

    await validateCity(city);

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

    // חיפוש לשם עדכון משתמש מקורי
    const creator = await User.findById(creatorId);
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


