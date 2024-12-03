import axios from "axios";

// פונקציה שמקבלת URL ומחזירה את הניתוב של הקובת בשרת
export async function cloudinaryUploud(imageurl: string) {

  const response = await axios.post('/api/cloudinary', { imageurl: imageurl });
  return response.data

}