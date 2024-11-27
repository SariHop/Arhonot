import { NextResponse } from "next/server";

export async function GET() {
    const validSeasons = ["כללי","חורף", "אביב", "קיץ", "סתיו"];
    const typeCategories = ["חולצה", "חצאית", "שמלה", "סרפן", "נעליים", "מכנסיים","מעיל","ג'קט"];
    const tags=["ספורטיבי", "אלגנטי", "יומיומי", "ערב", "חגיגי"];
    return NextResponse.json({seasons: validSeasons, types:typeCategories, tags:tags},{status:200});
}