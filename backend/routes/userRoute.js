import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";

const userRouter = express.Router();
// User Registration
userRouter.post("/register", registerUser);
// User Login
userRouter.post("/login", loginUser);
export default userRouter;
