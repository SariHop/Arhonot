import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongoDB";
import Garment from "@/app/lib/models/garmentSchema";
import { fetchSeasons, fetchTags, fetchTypes } from "@/app/services/categoriesService";

export async function GET() {
  try {
    await connect();
    const garments = await Garment.find({});
    console.log("garments:",garments);
    return NextResponse.json({ message: "success", data: garments });
  } catch (error: unknown) {
    console.error("Error fetching garments:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error fetching garments", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error fetching garments", error: "Unknown error occurred" },
        { status: 501 }
      );
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    await connect();
    const body = await request.json();

    const validSeasons = await fetchSeasons();
    const validCategories = await fetchTypes();
    const validTags = await fetchTags();

    if (!validSeasons.includes(body.season)) {
      throw new Error("Invalid season value");
    }
    if (!validCategories.includes(body.category)) {
      throw new Error("Invalid category value");
    }
    if (!body.tags.every((tag: string) => validTags.includes(tag))) {
      throw new Error("Invalid tags value");
    }
    const newgarment = new Garment(body);
    console.log(newgarment);
    
    await newgarment.validate();
    const savedgarment = await newgarment.save();
    return NextResponse.json(
      { success: true, data: savedgarment },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error add garment:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error add garment", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error add garment", error: "Unknown error occurred" },
        { status: 501 }
      );
    }
  }
}
