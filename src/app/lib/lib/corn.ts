import cron from 'node-cron';
import connect from '../db/mongoDB'; // פונקציית התחברות לבסיס הנתונים
import Alert from '../models/alertSchema'; // המודל שלך

const startCronJob = () => {
    // ריצה פעם בשבוע ביום ראשון בשעה 00:00
    cron.schedule('0 0 * * 0', async () => {
        try {
            console.log('Cron job started...');
            // התחברות לבסיס הנתונים
            await connect();

            // יצירת התראה חדשה
            const newAlert = new Alert({
                userId: 'system',
                title: 'Weekly Alert',
                desc: 'This is your weekly alert.',
                date: new Date(),
                readen: false,
            });

            // שמירה של ההתראה
            await newAlert.save();
            console.log('Weekly alert created successfully');
        } catch (err) {
            console.error('Error in cron job:', err);
        }
    });
};

export default startCronJob;
