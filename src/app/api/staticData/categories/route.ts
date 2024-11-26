import { NextResponse } from "next/server";

export async function GET() {
    const validSeasons = ["חורף", "אביב", "קיץ", "סתיו"];
    const typeCategories = ["ספורטיבי", "אלגנטי", "יומיומי", "ערב", "חגיגי"];
    return NextResponse.json({seasons: validSeasons, types:typeCategories},{status:200});
}