import connect from "@/app/lib/db/mongoDB";
import Alert from "@/app/lib/models/alertSchema";
import axios from "axios";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { _id_user: Types.ObjectId } }
) {
  try {
    await connect();

    const _idUser = params._id_user;
    if (!_idUser) {
      return NextResponse.json(
        { error: "Missing user's _id parameter" },
        { status: 400 }
      );
    }

    // חיפוש ההתראות של המשתמש
    const alerts = await Alert.find({ userId: _idUser });
    
    return NextResponse.json({ success: true, data: alerts }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error get alerts:", error);

    if (axios.isAxiosError(error)) {
      const serverError =
        error.response?.data?.error || "An unknown server error occurred";
      return NextResponse.json(
        { message: "Server error while fetching alerts", error: serverError },
        { status: error.response?.status || 500 } // Use status from Axios if available
      );
    }
    
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error getting alerts", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error getting alerts", error: "Unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
