import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongoDB";
import User from "@/app/lib/models/userSchema";

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
    const newUser = new User(body);
    console.log(newUser);
    
    await newUser.validate();
    const savedUser = await newUser.save();
    return NextResponse.json(
      { success: true, data: savedUser },
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
