import axios from "axios";
//פונקציית פניה לשרת חיצוני המסיר רקע מתמונה, מקבלת אוביקט תמונה

export async function removeBackground(imageFormData: FormData): Promise<void> {
  try {
    const apiRemoveBackgroundKey = process.env.API_REMOVE_BACKGROUND_API;

    const response = await axios.post("https://api.remove.bg/v1.0/removebg", imageFormData, {
      headers: {
        "X-Api-Key": apiRemoveBackgroundKey, 
      },
    });

    console.log("Response data:", response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error while removing background:", error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error("Error while removing background:", error.message);
    } else {
      console.error("Unknown error occurred while removing background");
    }
  }
}
