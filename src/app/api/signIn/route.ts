import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongoDB";
import User from "@/app/lib/models/userSchema";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

function generateToken(email: string): string {
    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
        throw new Error('SECRET_KEY is not defined in .env file');
    }
    const token = jwt.sign(
        { email },     // מידע שייכנס לטוקן
        secretKey,      // המפתח הסודי מה-.env
        { expiresIn: '1d' } // הגבלת תוקף ליום אחד
    );

    return token;
}

export async function POST(request: NextRequest) {
    try {
        await connect();
        const { email, password } = await request.json();
        console.log("email+password:", email, password);
        if (!email) {
            return NextResponse.json(
                { message: 'Missing email' },
                { status: 400 }
            )
        }
        if (!password || typeof password !== 'string') {
            return NextResponse.json(
                { message: "Invalid password" },
                { status: 401 }
            );
        }
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return NextResponse.json(
                    { message: 'Invalid username or password' },
                    { status: 402 }
                );
            }
            console.log(user);
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                console.log("not maching");
                return NextResponse.json(
                    { message: 'Invalid username or password' },
                    { status: 403 }
                );
            }
            console.log("match");
            const token = generateToken(user.email);
            console.log('Generated Token:', token);

            const response = NextResponse.json(
                { success: true, data: user },
                { status: 201 }
            );

            response.cookies.set('auth_token', token, {
                httpOnly: true, // הקוקי לא נגיש ל-JavaScript בצד הלקוח
                secure: process.env.NODE_ENV === 'production', // רק ב-HTTPS בפרודקשן
                path: '/', // זמין בכל הדפים
                maxAge: 60 * 60 * 24, // תוקף ליום אחד
            });
            return response;
        } catch (error) {
            console.error('Error hashing password:', error);
            if (error instanceof Error) {
                return NextResponse.json(
                    { message: "Internal server error", error: error.message },
                    { status: 502 }
                );
            } else {
                return NextResponse.json(
                    { message: "Internal server error", error: "Unknown error occurred" },
                    { status: 503 }
                );
            }
        }
    } catch (error: unknown) {
        console.error("Error geting user:", error);
        if (error instanceof Error) {
            return NextResponse.json(
                { message: "Error geting user", error: error.message },
                { status: 500 }
            );
        } else {
            return NextResponse.json(
                { message: "Error add user", error: "Unknown error occurred" },
                { status: 501 }
            );
        }
    }
}
