import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongoDB";
import Outfit from "@/app/lib/models/outfitSchema";

export async function GET() {
  try {
    await connect();
    const outfits = await Outfit.find({});
    return NextResponse.json({ message: "success", data: outfits });
  } catch (error: unknown) {
    console.error("Error fetching outfits:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error fetching outfits", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error fetching outfits", error: "Unknown error occurred" },
        { status: 501 }
      );
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    await connect();
    const body = await request.json();
    const newOutfit = new Outfit(body);
    console.log(newOutfit);
    
    await newOutfit.validate();
    const savedOutfit = await newOutfit.save();
    return NextResponse.json(
      { success: true, data: savedOutfit },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error add outfit:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error add Outfit", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error add outfit", error: "Unknown error occurred" },
        { status: 501 }
      );
    }
  }
}
