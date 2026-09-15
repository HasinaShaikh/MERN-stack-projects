import express from "express"
import dotenv from "dotenv"
import connectDB from "./utils/connectDB.js"
import authRouter from "./routes/authroute.js"
import aiRouter from "./routes/airoutes.js";
import quizRouter from "./routes/quizRoutes.js";
import flashcardRouter from "./routes/flashcardroute.js";
import progressRouter from "./routes/progressroute.js";

import cookieParser from "cookie-parser"
import cors from "cors"
dotenv.config()
// console.log("JWT SECRET LOADED:", !!process.env.JWT_SECRET_KEY);

const PORT = process.env.PORT || 4002
const app = express()

app.use(cors(
    {
        origin:"http://localhost:5173",
        credentials:true,
        methods:["GET","POST","PUT","OPTIONS","DELETE"]
    }
))
app.use(express.json())
app.use(cookieParser())

app.get("/",(req,res)=>
{
    res.json({message:"Exam Notes AI backend running"})
})

app.use("/api/auth",authRouter)
app.use("/api/ai",aiRouter)
app.use("/api/quiz", quizRouter);
app.use("/api/flashcards",flashcardRouter);
app.use("/api/progress", progressRouter);

app.listen(PORT,"0.0.0.0",() =>
{
     console.log(`Server running on port ${PORT}`)
     connectDB()
})
