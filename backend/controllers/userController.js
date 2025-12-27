import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { convertTo24Hr } from "../utils/convertTo24Hr.js";


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
    const userId = req.user._id;

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
    const userId = req.user._id;
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    /**
     * Build update object dynamically
     * Only include fields that are actually present
     */
    const updateData = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (gender) updateData.gender = gender;

    // DOB: validate before assigning
    if (dob) {
      const parsedDob = new Date(dob);
      if (isNaN(parsedDob.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid date of birth",
        });
      }
      updateData.dob = parsedDob;
    }

    // Address: parse only if provided
    if (address) {
      try {
        updateData.address =
          typeof address === "string" ? JSON.parse(address) : address;
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid address format",
        });
      }
    }

    // Image upload (optional)
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(
        imageFile.path,
        { resource_type: "image" }
      );
      updateData.image = imageUpload.secure_url;
    }

    // Nothing to update guard
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No changes provided",
      });
    }

    await userModel.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

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



// API to book appointment
export const bookAppointment = async (req, res) => {
  try {
    /* =========================
       1. AUTH (FROM TOKEN)
       ========================= */
    const userId = req.user._id;
    const doctorId = req.body.doctorId || req.body.docId;
    const { slotDate, slotTime } = req.body;
  
    // Basic request validation
    if (!userId || !doctorId || !slotDate || !slotTime) {
      return res.status(400).json({
        success: false,
        message: "Missing booking details",
      });
    }

    console.log("📥 Booking Request:", {
      userId,
      doctorId,
      slotDate,
      slotTime,
    });

    /* =========================
       2. FETCH DOCTOR
       ========================= */
    const doctor = await doctorModel.findById(doctorId).lean();

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    if (!doctor.available) {
      return res.status(400).json({
        success: false,
        message: "Doctor not available",
      });
    }

    /* =========================
       3. SLOT AVAILABILITY CHECK
       ========================= */
    const slotsBooked = doctor.slots_booked || {};

    if (
      slotsBooked[slotDate] &&
      slotsBooked[slotDate].includes(slotTime)
    ) {
      return res.status(400).json({
        success: false,
        message: "Slot not available",
      });
    }

    // Reserve slot in-memory
    if (!slotsBooked[slotDate]) {
      slotsBooked[slotDate] = [];
    }
    slotsBooked[slotDate].push(slotTime);

    /* =========================
       4. FETCH USER
       ========================= */
    const user = await userModel.findById(userId).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    /* =========================
       5. SAFE DATE + TIME PARSING
       ========================= */
    const normalizedTime = String(slotTime).trim();
    const time24 = convertTo24Hr(normalizedTime);

    if (!time24) {
      return res.status(400).json({
        success: false,
        message: `Invalid slot time format: "${normalizedTime}". Expected formats like "10:30 AM" or "10:30".`,
      });
    }

    const appointmentDateTime = new Date(`${slotDate}T${time24}`);

    if (isNaN(appointmentDateTime.getTime())) {
      return res.status(400).json({
        success: false,
        message: `Invalid appointment date/time (slotDate="${slotDate}", slotTime="${normalizedTime}")`,
      });
    }

    /* =========================
       6. CREATE APPOINTMENT
       ========================= */
    const appointment = await appointmentModel.create({
      userId,
      doctorId,

      // Snapshot data (history-safe)
      userData: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      docData: {
        name: doctor.name,
        speciality: doctor.speciality,
        fees: doctor.fees,
      },

      slotDate,
      slotTime: normalizedTime,
      appointmentDateTime,

      amount: doctor.fees,
    });

    /* =========================
       7. UPDATE DOCTOR SLOTS
       ========================= */
    await doctorModel.findByIdAndUpdate(doctorId, {
      slots_booked: slotsBooked,
    });

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointmentId: appointment._id,
    });

  } catch (error) {
    console.error("❌ Book appointment error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


/**
 * ======================================
 *  API: Get Logged-in User Appointments
 * ======================================
 *  - Auth Required (Access Token)
 *  - User identity derived from JWT (req.user)
 *  - Sorted by latest first
 *  - Safe & scalable
 */
export const listAppointments = async (req, res) => {
  try {
    const userId = req.user._id;

    const appointments = await appointmentModel
      .find({ userId })
      .populate("doctorId", "name speciality image address fees")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("List Appointments Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
    });
  }
};
