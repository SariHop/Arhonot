import axios from 'axios';
import {  NextResponse } from 'next/server';
// import { unknown } from 'zod';

export async function GET() {
    
    const apiUrl = "https://data.gov.il/api/3/action/datastore_search";
    const resourceId = "5c78e9fa-c2e2-4771-93ff-7f400a12f7ba";
    // const limit = 10000; // מספר התוצאות (אם יש יותר, תוכל להוסיף offset)
  
    try {
      const response = await axios.get(`${apiUrl}?resource_id=${resourceId}`);//&limit=${limit}
      const data = await response.data;
  
      if (!data.success) {
        return NextResponse.json({ error: "Failed to fetch cities"},{ status:500 });
      }
  
      const cities = data.result.records.map((record:Partial<{"שם_ישוב":string}>) => record["שם_ישוב"]);
      return NextResponse.json({cities},{status:200});
    } 
    catch (error) {
      console.error("Error fetching cities:", error);
      return NextResponse.json({ error: "Failed to fetch cities"}, { status:500 });
    }
  }
  