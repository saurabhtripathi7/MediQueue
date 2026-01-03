import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointments,
  cancelAppointment,
  payForAppointment,
  verifyAppointmentPayment,
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

userRouter.post("/update-profile", upload.single("image"), authUser, updateProfile);

userRouter.post("/book-appointment", authUser, bookAppointment);

userRouter.get("/appointments", authUser, listAppointments);

userRouter.post("/cancel-appointment", authUser, cancelAppointment);

userRouter.post("/payment-razorpay", authUser, payForAppointment);
userRouter.post("/verify-razorpay", verifyAppointmentPayment);

export default userRouter;
