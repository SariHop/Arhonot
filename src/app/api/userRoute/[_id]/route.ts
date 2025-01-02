import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongoDB";
import User from "@/app/lib/models/userSchema";
import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const apiUrl = `${baseUrl}/api/staticData`;

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
    const user = await User.findById(_id).populate("children");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error get user:", error);
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
    const user = await User.findById(_id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    await User.findByIdAndDelete(_id);
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
    const existingUser = await User.findById(_id);
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { city, ...otherFields } = body;

    const existingEmail = await User.findOne({ email: body.email });
    if (existingEmail && String(existingEmail._id) !== _id) {
      return NextResponse.json(
        { error: "Email already in use by another user" },
        { status: 404 }
      );
    }    
    const response = await axios.get(`${apiUrl}/coordinates/`, {
      params: { city },
    });
    console.log("response of cageCoordinates", response);
    
    // וידוא שהתקבלו קואורדינטות תקינות
    if (!response.data || !response.data.lat || !response.data.lon) {
      return NextResponse.json(
        { message: "Invalid coordinates received." },
        { status: 404 }
      );
    }

    console.log(`Coordinates for ${city}:`, response.data.lat, response.data.lon);
    const finalBody={
      ...otherFields,
      city,
      lat: response.data.lat,
      lon: response.data.lon
    };
    const updatedUser = await User.findByIdAndUpdate(_id, finalBody, {
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
