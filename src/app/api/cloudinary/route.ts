import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.imageurl) {
      return NextResponse.json({ success: false, error: 'Image URL not provided' });
    }

    console.log("Uploading image to Cloudinary from base64...");

    // Upload the base64 image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(body.imageurl, {
      folder: 'Arhonot', // תיקייה ב-Cloudinary
      // width: 500, // רוחב התמונה הרצוי בפיקסלים
      // height: 500, // גובה התמונה הרצוי בפיקסלים
      // crop: 'fill', // שומר על יחס התמונה וממלא את הממדים המבוקשים
    });

    console.log("Upload successful:", uploadResult);

    return NextResponse.json({
      success: true,
      imageUrl: uploadResult.secure_url,
      publicID: uploadResult.public_id
    });
  } catch (error) {
    console.error("Error during upload:", error);
    return NextResponse.json({ success: false, error: 'Upload failed' });
  }
}
