import express from "express";
import cors from "cors";
import "dotenv/config";
import multer from "multer";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";

/* ================= APP CONFIG ================= */
const app = express();
const PORT = process.env.PORT || 4000;

/* ================= DB & CLOUDINARY ================= */
connectDB();
connectCloudinary();

/* ================= MIDDLEWARES ================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
  ALLOWED_ORIGINS should be set in Render ENV like:
  https://mediqueue.vercel.app,https://mediqueue-admin.vercel.app
*/
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [
      "http://localhost:5173", // local frontend
      "http://localhost:5174", // local admin
    ];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow Postman, server-to-server, cron jobs
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

/* ================= ROUTES ================= */
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.status(200).send("MediQueue API is running 🚀");
});

/* ================= GLOBAL ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  // Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Image size must be less than 10MB",
      });
    }

    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message: err.message || "Invalid file upload",
      });
    }
  }

  // Default error
  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* ================= START SERVER ================= */
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
