import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongoDB";
import Garment from "@/app/lib/models/garmentSchema";

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
    const garment = await Garment.findById(_id);
    if (!garment) {
      return NextResponse.json({ error: "garment not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: garment }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error add garment:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error get garment", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error get garment", error: "Unknown error occurred" },
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
    const garment = await Garment.findById(_id);
    if (!garment) {
      return NextResponse.json({ error: "garment not found" }, { status: 404 });
    }
    await Garment.findByIdAndDelete(_id);
    return NextResponse.json(
      { success: true, message: "garment deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error deleting garment:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error deleting garment", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error deleting garment", error: "Unknown error occurred" },
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
    const existinggarment = await Garment.findById(_id);
    if (!existinggarment) {
      return NextResponse.json({ error: "garment not found" }, { status: 404 });
    }

    const body = await request.json();

    const updatedgarment = await Garment.findByIdAndUpdate(_id, body, {
      new: true, // מחזיר את המסמך המעודכן
      runValidators: true, // מפעיל ולידציות על הנתונים החדשים
    });
    return NextResponse.json(
      { success: true, data: updatedgarment },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error updating garment:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error updating garment", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error updating garment", error: "Unknown error occurred" },
        { status: 501 }
      );
    }
  }
}
