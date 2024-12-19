import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongoDB";
import User from "@/app/lib/models/userSchema";

export async function GET(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  try {
    console.log("Request method:", request.method); //NextRequestשימוש סמלי ב
    await connect();
    const email = params.email;
    console.log(email);
    
    console.log("Params:", params);

    if (!email) {
      return NextResponse.json(
        { error: "Missing email parameter" },
        { status: 400 }
      );
    }
    const user = await User.findOne({email});
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