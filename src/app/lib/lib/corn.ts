import cron from 'node-cron';
import connect from '../db/mongoDB'; // פונקציית התחברות לבסיס הנתונים
import Alert from '../models/alertSchema'; // המודל שלך
import Garment from '../models/garmentSchema'; // המודל של Garment
import { Types } from 'mongoose';

const startCronJob = (userId: Types.ObjectId) => {
    // ריצה פעם בחודש ביום הראשון של החודש בשעה 00:00
    cron.schedule('0 0 26 * *', async () => {
        try {
            console.log('Monthly average expenses cron job started...');

            // התחברות לבסיס הנתונים
            await connect();

            // שליפת כל הבגדים של המשתמש עם userId המתאים
            const garments = await Garment.find({ userId });

            // חילוץ מחירים וחישוב הממוצע
            const prices = garments.map(garment => garment.price).filter(price => price != null); // הסרת ערכים null
            const total = prices.reduce((sum, price) => sum + price, 0);
            const average = prices.length > 0 ? total / prices.length : 0;

            // יצירת התראה חדשה
            const newAlert = new Alert({
                userId,
                title: 'Monthly Expenses Summary',
                desc: `Your average monthly expenses for garments is $${average.toFixed(2)}.`,
                date: new Date(),
                readen: false,
            });

            // שמירת ההתראה
            await newAlert.save();
            console.log('Monthly average expenses alert created successfully');
        } catch (err) {
            console.error('Error in cron job:', err);
        }
    });
};

export default startCronJob;
