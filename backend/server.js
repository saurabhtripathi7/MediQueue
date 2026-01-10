import express from "express";
import cors from "cors";
import "dotenv/config";
import multer from "multer";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";

// ================= APP CONFIG =================
const app = express();
const PORT = process.env.PORT || 4000;

// ================= DB & CLOUDINARY =================
connectDB();
connectCloudinary();

// ================= MIDDLEWARES =================
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // parse form-data text fields

const allowedOrigins = [
  "http://localhost:5173", //frontend
  "http://localhost:5174", //admin panel
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow server-to-server & Postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
// ================= ROUTES =================
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("API is working !!!");
});

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  // Multer-specific errors
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
        message: err.message || "Invalid image type",
      });
    }
  }

  // Generic error fallback
  return res.status(500).json({
    success: false,
    message: err.message || "Something went wrong",
  });
});

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
