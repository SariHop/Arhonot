import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongoDB";
import Alert from "@/app/lib/models/alertSchema";
import { Types } from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: { _id: Types.ObjectId } }
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
    const alert = await Alert.findById(_id);
    if (!alert) {
      return NextResponse.json({ error: "alert not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: alert }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error add alert:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error get alert", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error get alert", error: "Unknown error occurred" },
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
    const alert = await Alert.findById(_id);
    if (!alert) {
      return NextResponse.json({ error: "alert not found" }, { status: 404 });
    }
    await Alert.findByIdAndDelete(_id);
    return NextResponse.json(
      { success: true, message: "alert deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error deleting alert:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error deleting alert", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error deleting alert", error: "Unknown error occurred" },
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
    const existingalert = await Alert.findById(_id);
    if (!existingalert) {
      return NextResponse.json({ error: "alert not found" }, { status: 404 });
    }

    const body = await request.json();

    const updatedalert = await Alert.findByIdAndUpdate(_id, body, {
      new: true, // מחזיר את המסמך המעודכן
      runValidators: true, // מפעיל ולידציות על הנתונים החדשים
    });
    return NextResponse.json(
      { success: true, data: updatedalert },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error updating alert:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error updating alert", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error updating alert", error: "Unknown error occurred" },
        { status: 501 }
      );
    }
  }
}
