import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongoDB";
import Garment from "@/app/lib/models/garmentSchema";
import { Types } from "mongoose";

export async function GET(
    request: NextRequest,
    { params }: { params: { userId: string} }
) {
    try {
        console.log("Request method:", request.method); //NextRequestשימוש סמלי ב
        await connect();
        const userId = params.userId;
        console.log("Params:", params);

        if (!userId) {
            return NextResponse.json(
                { error: "Missing _id parameter" },
                { status: 400 }
            );
        }
        const objectId = new Types.ObjectId(userId);

        const garments = await Garment.find({ userId: objectId });
        if (!garments) {
            return NextResponse.json({ error: "garments not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: garments }, { status: 200 });
    } catch (error: unknown) {
        console.error("Error geting garments:", error);
        if (error instanceof Error) {
            return NextResponse.json(
                { message: "Error geting garments", error: error.message },
                { status: 500 }
            );
        } else {
            return NextResponse.json(
                { message: "Error get garments", error: "Unknown error occurred" },
                { status: 501 }
            );
        }
    }
}