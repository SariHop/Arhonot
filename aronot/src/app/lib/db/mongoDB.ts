import mongoose from "mongoose"
const MONGODB_URL = process.env.MONGO_URL || "";
let isConnected: boolean = false;

const connect = async () => {
    if (isConnected) {
        console.log("already connected!");
        return
    }
    if (!MONGODB_URL) {
        throw new Error('Please define the MONGODB_URL environment variable inside .env');
    }
    console.log(MONGODB_URL);
    try {
        const db = await mongoose.connect(MONGODB_URL);
        isConnected = db.connection.readyState === 1;
        console.log("Mongodb connection successfull !!!");
    } catch (error) {
        throw new Error("Error in connecting to mongoDB." + error);
    }
}
export default connect;