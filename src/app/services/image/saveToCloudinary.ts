import axios from "axios";

// פונקציה שמקבלת URL ומחזירה את הניתוב של הקובת בשרת
export async function cloudinaryUploud(imageurl: string): Promise<string | null> {

    const response = await axios.post('/api/cloudinary',{imageurl:imageurl});  
  
    return response.data
  
    // console.log(response.data)
    // return response.data;
  
  }