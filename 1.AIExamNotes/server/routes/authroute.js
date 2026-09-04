import express from "express"
import { googleAuth, logOut,register,login } from "../controllers/aothcontrol.js"

const authRouter = express.Router()

authRouter.post("/google",googleAuth)

authRouter.get("/logout",logOut)

authRouter.post("/register", register);

authRouter.post("/login", login);

export default authRouter