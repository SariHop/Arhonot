import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongoDB";
import Users from "@/app/lib/models/userSchema";

export async function GET(
  request: NextRequest,
  { params }: { params: { _id: string } }
) {
  try {
    console.log("Request method:", request.method); //NextRequestשימוש סמלי ב
    await connect();
    const _id = params._id;
    console.log("Params:", params);

    if (!_id) {
      return NextResponse.json(
        { error: "Missing _id parameter" },
        { status: 400 }
      );
    }
    const user = await Users.findById(_id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error add user:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error get user", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error get user", error: "Unknown error occurred" },
        { status: 501 }
      );
    }
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { _id: string } }
) {
  try {
    console.log("Request method:", request.method); //NextRequestשימוש סמלי ב

    await connect();
    const _id = params._id;
    console.log("DELETE _id:", _id);

    if (!_id) {
      return NextResponse.json(
        { error: "Missing _id parameter" },
        { status: 400 }
      );
    }
    const user = await Users.findById(_id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    await Users.findByIdAndDelete(_id);
    return NextResponse.json(
      { success: true, message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error deleting user:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error deleting user", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error deleting user", error: "Unknown error occurred" },
        { status: 501 }
      );
    }
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { _id: string } }
) {
  try {
    await connect();
    const _id = params._id;
    if (!_id) {
      return NextResponse.json(
        { error: "Missing _id parameter" },
        { status: 400 }
      );
    }
    const existingUser = await Users.findById(_id);
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();

    const updatedUser = await Users.findByIdAndUpdate(_id, body, {
      new: true, // מחזיר את המסמך המעודכן
      runValidators: true, // מפעיל ולידציות על הנתונים החדשים
    });
    return NextResponse.json(
      { success: true, data: updatedUser },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error updating user:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error updating user", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error updating user", error: "Unknown error occurred" },
        { status: 501 }
      );
    }
  }
}
