import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {

    const body = await request.json();
    console.log("בתוך השרת גוף הבקשה",body)
    // שליפת הנתונים מהבקשה
    // const data = await request.formData();
    // const file: File | null = data.get('file') as unknown as File;

    // if (!file) {
    //   return NextResponse.json({ success: false, error: 'File not provided' });
    // }

    // // קריאת הקובץ ל-Buffer
    // const bytes = await file.arrayBuffer();
    // const buffer = Buffer.from(bytes);

    // // החזרת הבטחה כדי להמתין להעלאה
    // const uploadResult = await new Promise((resolve, reject) => {
    //   const uploadStream = cloudinary.uploader.upload_stream(
    //     { folder: 'uploads' }, // אפשר להגדיר תיקייה ב-Cloudinary
    //     (error, result) => {
    //       if (error) {
    //         reject(error);
    //       } else {
    //         resolve(result);
    //       }
    //     }
    //   );

    //   // כתיבת ה-Buffer לזרם ההעלאה
    //   uploadStream.end(buffer);
    // });

    // console.log(uploadResult)
    // return NextResponse.json({ success: true, uploadResult });
    return NextResponse.json({ success: true, body: body });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Upload failed' });
  }
}
