import connect from '../../lib/db/mongoDB';
import User from '../../lib/models/userSchema';
import Token from '../../lib/models/tokenSchema';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    await connect();
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const token = crypto.randomBytes(32).toString('hex');
    await new Token({ userId: user._id, token }).save();

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/pages/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: '"ArOnot" <aronot844@gmail.com>',
      to: email,
      subject: 'Reset Your Password',
      html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                color: #333;
              }
              .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
              }
              h1 {
                color: #0070f3;
                text-align: center;
                direction: rtl;
              }
              p {
                font-size: 16px;
                line-height: 1.5;
                text-align: center;
                direction: rtl;
              }
              .button {
                display: inline-block;
                padding: 15px 25px;
                background-color: #0070f3;
                color: white;
                text-decoration: none;
                font-size: 16px;
                border-radius: 5px;
                text-align: center;
                margin-top: 20px;
              }
              .button:hover {
                background-color: #005bb5;
              }
              .footer {
                font-size: 14px;
                color: #777;
                text-align: center;
                margin-top: 20px;
                direction: rtl;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>בקשת איפוס סיסמה</h1>
              <p>קיבלנו בקשה לאפס את הסיסמה שלך. לחץ על הכפתור למטה כדי לאפס את הסיסמה שלך:</p>
              <p><a href="${resetLink}" class="button">איפוס סיסמא</a></p>
              <div class="footer" >
                <p>אם לא ביקשת איפוס סיסמה, אנא התעלם מאימייל זה.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });


    return NextResponse.json({ message: 'Email sent' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to send email' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    console.log("Handling PUT request...");

    // שלב 1: קבלת נתונים מהבקשה
    const { token, password } = await request.json();
    console.log("token:", token);
    console.log("password:", password);
    if (!token || !password) {
      return NextResponse.json(
        { error: "Missing token or password" },
        { status: 400 }
      );
    }

    // שלב 2: התחברות למסד הנתונים
    await connect();

    // שלב 3: בדיקת תוקף הטוקן
    const myToken = await Token.findOne({ token });
    if (!myToken) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    console.log("Token found:", myToken.userId);

    // שלב 4: יצירת הצפנה לסיסמה החדשה
    const saltRounds = 10;
    // יצירת ההצפנה
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // שלב 5: עדכון סיסמת המשתמש
    const updatedUser = await User.findByIdAndUpdate(
      myToken.userId, // ID של המשתמש לעדכון
      { password: hashedPassword }, // שדה לעדכון
      { new: true } // מחזיר את המסמך המעודכן לאחר העדכון
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found or update failed" },
        { status: 404 }
      );
    }

    console.log("User updated successfully:", updatedUser);

    // שלב 6: החזרת תשובה ללקוח
    return NextResponse.json(
      { message: "Password changed successfully!" }, 
      { status: 200 }
    );
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}