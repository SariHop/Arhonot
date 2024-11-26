import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongoDB";
import ConnectionRequest from "@/app/lib/models/connectionRequestSchema";

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
    const connectionRequest = await ConnectionRequest.findById(_id);
    if (!connectionRequest) {
      return NextResponse.json({ error: "connectionRequest not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: connectionRequest }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error add connectionRequest:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error get connectionRequest", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error get connectionRequest", error: "Unknown error occurred" },
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
    const connectionRequest = await ConnectionRequest.findById(_id);
    if (!connectionRequest) {
      return NextResponse.json({ error: "connectionRequest not found" }, { status: 404 });
    }
    await ConnectionRequest.findByIdAndDelete(_id);
    return NextResponse.json(
      { success: true, message: "connectionRequest deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error deleting connectionRequest:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error deleting connectionRequest", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error deleting connectionRequest", error: "Unknown error occurred" },
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
    const existingconnectionRequest = await ConnectionRequest.findById(_id);
    if (!existingconnectionRequest) {
      return NextResponse.json({ error: "connectionRequest not found" }, { status: 404 });
    }

    const body = await request.json();

    const updatedconnectionRequest = await ConnectionRequest.findByIdAndUpdate(_id, body, {
      new: true, // מחזיר את המסמך המעודכן
      runValidators: true, // מפעיל ולידציות על הנתונים החדשים
    });
    return NextResponse.json(
      { success: true, data: updatedconnectionRequest },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error updating connectionRequest:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error updating connectionRequest", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error updating connectionRequest", error: "Unknown error occurred" },
        { status: 501 }
      );
    }
  }
}
