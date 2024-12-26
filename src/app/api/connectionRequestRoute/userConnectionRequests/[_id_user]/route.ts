import connect from "@/app/lib/db/mongoDB";
import ConnectionRequest from "@/app/lib/models/connectionRequestSchema";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { _id_user: Types.ObjectId } }
) {
  try {
    console.log("Request method:", request.method); // לשם דיבאג
    await connect();

    const _idUser = params._id_user;
    console.log("Params:", params);

    if (!_idUser) {
      return NextResponse.json(
        { error: "Missing user's _id parameter" },
        { status: 400 }
      );
    }

    // חיפוש ההתראות של המשתמש
    const connectionReq = await ConnectionRequest.find({
      userIdReciver: _idUser,
    });

    return NextResponse.json(
      { success: true, data: connectionReq },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error get connection requests:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error getting connection requests", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        {
          message: "Error getting connection requests",
          error: "Unknown error occurred",
        },
        { status: 500 }
      );
    }
  }
}

