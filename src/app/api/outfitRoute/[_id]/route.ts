import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongoDB";
import Outfit from "@/app/lib/models/outfitSchema";

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
    const outfit = await Outfit.findById(_id);
    if (!outfit) {
      return NextResponse.json({ error: "outfit not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: outfit }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error add outfit:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error get outfit", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error get outfit", error: "Unknown error occurred" },
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
    const outfit = await Outfit.findById(_id);
    if (!outfit) {
      return NextResponse.json({ error: "outfit not found" }, { status: 404 });
    }
    await Outfit.findByIdAndDelete(_id);
    return NextResponse.json(
      { success: true, message: "outfit deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error deleting outfit:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error deleting outfit", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error deleting outfit", error: "Unknown error occurred" },
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
    const existingOutfit = await Outfit.findById(_id);
    if (!existingOutfit) {
      return NextResponse.json({ error: "outfit not found" }, { status: 404 });
    }

    const body = await request.json();

    const updatedOutfit = await Outfit.findByIdAndUpdate(_id, body, {
      new: true, // מחזיר את המסמך המעודכן
      runValidators: true, // מפעיל ולידציות על הנתונים החדשים
    });
    return NextResponse.json(
      { success: true, data: updatedOutfit },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error updating outfit:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error updating outfit", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error updating outfit", error: "Unknown error occurred" },
        { status: 501 }
      );
    }
  }
}
