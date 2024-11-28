"use server"
import axios from "axios";

// פונקציית פניה לשרת חיצוני המסיר רקע מתמונה, מקבלת אוביקט תמונה
export async function removeBackground(imageFormData: FormData): Promise<string | null> {
  try {
    const apiRemoveBackgroundKey = process.env.API_REMOVE_BACKGROUND_API;

    const response = await axios.post("https://api.remove.bg/v1.0/removebg", imageFormData, {
      headers: {
        "X-Api-Key": apiRemoveBackgroundKey,
      },
      responseType: "arraybuffer",
    });

    // יצירת URL מתוך התמונה המעובדת
    const imageBuffer = Buffer.from(response.data, "binary");
    const base64Image = imageBuffer.toString("base64");
    const imageUrl = `data:image/png;base64,${base64Image}`;

    return imageUrl;

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error while removing background:", error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error("Error while removing background:", error.message);
    } else {
      console.error("Unknown error occurred while removing background");
    }

    return null;
  }
}

// פונקציה שמקבלת URL ומחזירה את הניתוב של הקובת בשרת
export async function cloudinaryUploud(imageurl: string): Promise<string | null> {
  try {
    // console.log("מה שיישלח לשרת", imageurl)

    // invalid url
    const response = await axios.post("/api/cloudinary", imageurl)
    return response.data;

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error ", error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error("Error ", error.message);
    } else {
      console.error("Unknown error occurred ");
    }
    return null;
  }
}


