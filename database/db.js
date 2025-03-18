import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
export const dbConnection = () => {
    mongoose.connect(MONGO_URI, {dbName:'talentBridge'})
    .then(()=>{
        console.log('MongoDB connected successfully')
    })
    .catch((err)=>{
        console.log(`Error in MongoDB connection : ${err}`)
    })
}
