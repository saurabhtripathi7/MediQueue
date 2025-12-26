import express from "express";

import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
} from "../controllers/userController.js";

import { refreshAccessToken } from "../controllers/authController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

// ================= AUTH ROUTES =================
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/refresh", refreshAccessToken);

// ================= USER ROUTES =================
userRouter.get("/get-profile", authUser, getProfile);

userRouter.post(
  "/update-profile",
  upload.single("image"),
  authUser,
  updateProfile
);

export default userRouter;
