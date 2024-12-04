import connect from "@/app/lib/db/mongoDB";
import Alert from "@/app/lib/models/alertSchema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { _id_user: string } }
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
    const alerts = await Alert.find({ userId: _idUser });
    console.log(alerts);
    
    return NextResponse.json({ success: true, data: alerts }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error get alerts:", error);

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
