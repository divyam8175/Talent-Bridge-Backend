import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'
import userRoutes from './routes/userRoutes.js'
import applicationRoutes from './routes/applicationRoutes.js'
import vacancyRoutes from './routes/vacancyRoutes.js'
import {dbConnection} from './database/db.js'
import { errorMiddleware } from './middlewares/error.js'

const app = express()
dotenv.config({path:'./config/config.env'})

// const corsOptions = {
//   origin: process.env.FRONTEND_URL, // This will now be the actual frontend URL.
//   credentials: true,
// };
// app.use(cors());


app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}))


app.use(cors({
  origin: 'http://localhost:5173', // Replace with your actual frontend Render URL
  credentials: true
}));


app.get("/", (req, res) => {
  res.send("Backend is running successfully! 🚀");
});


app.use('/api/v1/user', userRoutes)
app.use('/api/v1/application', applicationRoutes)
app.use('/api/v1/vacancy', vacancyRoutes)

dbConnection()

app.use(errorMiddleware)

export default app
