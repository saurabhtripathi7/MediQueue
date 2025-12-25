import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";

/**
 * ======================================
 *  API: Add Doctor (Admin Only)
 * ======================================
 */
const addDoctor = async (req, res) => {
  try {
    /**
     * 1️⃣ Extract text fields from request body
     * (sent via FormData from frontend)
     */
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;

    /**
     * Extract uploaded image file (handled by multer)
     */
    const imageFile = req.file;

    /**
     * 2️⃣ Basic validation — ensure all required fields exist
     */
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    /**
     * 3️⃣ Image validation — image is mandatory
     */
    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: "Doctor image is required",
      });
    }

    /**
     * 4️⃣ Email format validation
     */
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    /**
     * 5️⃣ Password strength validation
     * - Minimum 6 characters
     * - At least 1 number
     */
    if (
      !validator.isStrongPassword(password, {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 0,
        minNumbers: 1,
        minSymbols: 0,
      })
    ) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters and include a number",
      });
    }

    /**
     * 6️⃣ Parse address safely
     * Address is sent as JSON string from frontend
     */
    let parsedAddress;
    try {
      parsedAddress = JSON.parse(address);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid address format",
      });
    }

    /**
     * 7️⃣ Check if doctor with same email already exists
     */
    const existingDoctor = await doctorModel.findOne({ email });
    if (existingDoctor) {
      return res.status(409).json({
        success: false,
        message: "Doctor with this email already exists",
      });
    }

    /**
     * 8️⃣ Hash password before storing in DB
     * bcrypt automatically handles salting internally
     */
    const hashedPassword = await bcrypt.hash(password, 10);

    /**
     * 9️⃣ Upload image to Cloudinary
     * - Auto compression
     * - Auto format (WebP/AVIF)
     * - Resize safely (no crop, no distortion)
     */
    const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",

      // Auto optimize image quality
      quality: "auto",

      // Convert to best format supported by browser
      fetch_format: "auto",

      // Resize large images safely
      transformation: [
        {
          width: 1200,
          height: 1200,
          crop: "limit",
        },
      ],

      // Store images inside Cloudinary folder
      folder: "doctors",
    });

    /**
     * Secure URL of uploaded image
     */
    const imageURL = uploadResult.secure_url;

    /**
     * 🔟 Create doctor document
     * (timestamps like createdAt / updatedAt
     * are added automatically by schema)
     */
    const newDoctor = new doctorModel({
      name,
      email,
      password: hashedPassword,
      image: imageURL,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: parsedAddress,
    });

    /**
     * Save doctor to MongoDB
     */
    await newDoctor.save();

    return res.status(201).json({
      success: true,
      message: "Doctor added successfully",
    });
  } catch (error) {
    console.error(error);

    /**
     * Handle duplicate key error (unique email index)
     */
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Doctor with this email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * ======================================
 *  API: Admin Login
 * ======================================
 */
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    /**
     * Validate admin credentials
     * (stored securely in environment variables)
     */
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    /**
     * Generate JWT token for admin
     */
    const token = jwt.sign(
      { role: "admin", email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// API to get all doctors list for admin from DB
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    console.log(doctors);
    return res.status(200).json({
      success: true,
      doctors,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export { addDoctor, adminLogin, allDoctors };
