import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongoDB";
import Outfit from "@/app/lib/models/outfitSchema";
export async function GET(
    request: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        console.log("Request method:", request.method); //NextRequestשימוש סמלי ב
        console.log("outfit reqest");
        await connect();
        const userId = params.userId;
        console.log("Params:", params);

        if (!userId) {
            return NextResponse.json(
                { error: "Missing _id parameter" },
                { status: 400 }
            );
        }
        const outfits = await Outfit.find({ userId: userId });
        if (!outfits) {
            return NextResponse.json({ error: "outfits not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: outfits }, { status: 200 });
    } catch (error: unknown) {
        console.error("Error geting outfits:", error);
        if (error instanceof Error) {
            return NextResponse.json(
                { message: "Error geting outfits", error: error.message },
                { status: 500 }
            );
        } else {
            return NextResponse.json(
                { message: "Error get outfits", error: "Unknown error occurred" },
                { status: 501 }
            );
        }
    }
}