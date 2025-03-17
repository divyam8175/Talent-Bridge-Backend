import mongoose from 'mongoose'

export const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URL, {dbName:'talentBridge'})
    .then(()=>{
        console.log('MongoDB connected successfully')
    })
    .catch((err)=>{
        console.log(`Error in MongoDB connection : ${err}`)
    })
}