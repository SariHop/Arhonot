import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// פונקציה לאימות הטוקן
function verifyToken(token: string): boolean {
  console.log("token:", token);
  try {
    const secretKey = process.env.SECRET_KEY!;
    jwt.verify(token, secretKey);
    return true;
  } catch {
    return false; // לא נדרש לשמור את השגיאה אם אינך משתמש בה
  }
}

export async function GET(req: NextRequest) {
  console.log("first");
  console.log("first");
  console.log("first");
  console.log("first");
  console.log("first");
  console.log("first");
  console.log("first");
  console.log("first");
  console.log("first");
  console.log("first");
  console.log("first");
  console.log("first");
  console.log("first");
  console.log("first");
  console.log("first");
  console.log("first");
  console.log("first");
  // משתמשים ב-req.cookies.get ומוודאים שנכנסים לערך של הקוקי
  const token = req.cookies.get("auth_token")?.value;
  console.log("token:", token);
  // אם יש token, בודקים אם הוא תקף
  if (token && verifyToken(token)) {
    return NextResponse.json({ message: "Protected data", token },{ status: 200 });
  } else {
    // אם אין token או שהטוקן לא תקף, מחזירים תשובה עם שגיאה
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
