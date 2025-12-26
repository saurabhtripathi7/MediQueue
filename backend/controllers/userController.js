import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// ============================
// REGISTER USER
// ============================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1️⃣ Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // 2️⃣ Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create user
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    // 5️⃣ Validate env secrets
    if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
      throw new Error("JWT secrets are not defined");
    }

    // 6️⃣ Generate tokens
    const accessToken = jwt.sign(
      { id: newUser._id },
      JWT_SECRET,
      { expiresIn: "15m" } // short-lived
    );

    const refreshToken = jwt.sign(
      { id: newUser._id },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" } // long-lived
    );

    // 7️⃣ Save refresh token in DB
    // Could be used later for token revocation 
    newUser.refreshToken = refreshToken;
    await newUser.save();

    // 8️⃣ Response
    res.status(201).json({
      success: true,
      accessToken,
      refreshToken,
    });

  } catch (error) {
    console.error("Register User Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // 2️⃣ Check if user exists to log-in that user
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials or user not registered",
      });
    }

    // 3️⃣ Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password); //compare with saved hashed password from DB
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });   
    }

    // 4️⃣ Validate env secrets
    if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
      throw new Error("JWT secrets are not defined");
    }

    // 5️⃣ Generate new access token
    const accessToken = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    // 6️⃣ Generate new refresh token
    const refreshToken = jwt.sign(
      { id: user._id },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // 7️⃣ Store refresh token in DB (rotate)
    user.refreshToken = refreshToken;
    await user.save();

    // 8️⃣ Send response
    res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
    });

  } catch (error) {
    console.error("Login User Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const userData = await userModel
      .findById(userId)
      .select("-password");

    res.status(200).json({
      success: true,
      user: userData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// API to update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ from auth middleware
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    // 1️⃣ Validate required fields
    if (!name || !phone || !dob || !gender) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // 2️⃣ Safely parse address
    let parsedAddress;
    try {
      parsedAddress =
        typeof address === "string" ? JSON.parse(address) : address;
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid address format",
      });
    }

    // 3️⃣ Build update object
    const updateData = {
      name,
      phone,
      address: parsedAddress,
      dob,
      gender,
    };

    // 4️⃣ Upload image if present
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(
        imageFile.path,
        { resource_type: "image" }
      );
      updateData.image = imageUpload.secure_url;
    }

    // 5️⃣ Single DB update
    await userModel.findByIdAndUpdate(userId, updateData);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });

  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
