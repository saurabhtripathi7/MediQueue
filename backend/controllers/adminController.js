import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";

import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

/* ============================================================================
   API: ADD DOCTOR (ADMIN ONLY)
   ----------------------------------------------------------------------------
   - Creates a new doctor account
   - Uploads profile image to Cloudinary
   - Stores password securely using bcrypt
============================================================================ */
const addDoctor = async (req, res) => {
  try {
    // 1️⃣ Extract text fields from multipart/form-data
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

    // Extract uploaded image (handled by multer)
    const imageFile = req.file;

    // 2️⃣ Validate required fields
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

    // 3️⃣ Image is mandatory
    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: "Doctor image is required",
      });
    }

    // 4️⃣ Email format validation
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // 5️⃣ Password strength validation
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

    // 6️⃣ Parse address JSON safely
    let parsedAddress;
    try {
      parsedAddress = JSON.parse(address);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid address format",
      });
    }

    // 7️⃣ Prevent duplicate doctor accounts
    const existingDoctor = await doctorModel.findOne({ email });
    if (existingDoctor) {
      return res.status(409).json({
        success: false,
        message: "Doctor with this email already exists",
      });
    }

    // 8️⃣ Hash password (bcrypt handles salting internally)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 9️⃣ Upload image to Cloudinary (optimized & resized)
    const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
      quality: "auto",
      fetch_format: "auto",
      transformation: [{ width: 1200, height: 1200, crop: "limit" }],
      folder: "doctors",
    });

    // 🔟 Create doctor document
    const newDoctor = new doctorModel({
      name,
      email,
      password: hashedPassword,
      image: uploadResult.secure_url,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: parsedAddress,
    });

    // Save doctor to DB
    await newDoctor.save();

    return res.status(201).json({
      success: true,
      message: "Doctor added successfully",
    });
  } catch (error) {
    console.error(error);

    // Duplicate key error fallback
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

/* ============================================================================
   API: ADMIN LOGIN
   ----------------------------------------------------------------------------
   - Validates credentials against environment variables
   - Issues JWT token
============================================================================ */
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
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

// API: GET ALL DOCTORS (ADMIN)

const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");

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

/* ============================================================================
   API: GET ALL APPOINTMENTS (ADMIN)
   ----------------------------------------------------------------------------
   - Returns all appointments
   - Sorted by newest first
============================================================================ */
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel
      .find({})
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("Admin appointments fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ============================================================================
   API: CANCEL APPOINTMENT (ADMIN)
   ----------------------------------------------------------------------------
   IMPORTANT:
   - STRICTLY schema-aligned
   - Uses only: cancelled, isCompleted
============================================================================ */
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID is required",
      });
    }

    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Prevent double cancellation
    if (appointment.cancelled === true) {
      return res.status(400).json({
        success: false,
        message: "Appointment already cancelled",
      });
    }

    // Schema-consistent update
    appointment.cancelled = true;
    appointment.isCompleted = false;

    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    console.error("Admin cancel appointment error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ============================================================================
   API: ADMIN DASHBOARD DATA
   ----------------------------------------------------------------------------
   - Aggregates counts
   - Fetches latest 5 appointments
============================================================================ */
const getAdminDashboardStats = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({}).sort({ createdAt: -1 });

    let earnings = 0;
    const doctorSet = new Set();
    const patientSet = new Set();

    appointments.forEach((appointment) => {
      // ✅ Revenue rule (authoritative)
      if (appointment.payment === true && appointment.refunded !== true) {
        earnings += Number(appointment.amount || 0);
      }

      if (appointment.doctorId) {
        doctorSet.add(appointment.doctorId.toString());
      }

      if (appointment.userId) {
        patientSet.add(appointment.userId.toString());
      }
    });

    const dashData = {
      earnings,                         // ✅ NEW (fixes revenue = 0)
      doctors: doctorSet.size,
      patients: patientSet.size,
      appointments: appointments.length,
      latestAppointments: appointments.slice(0, 5),
    };

    return res.status(200).json({
      success: true,
      dashData,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export {
  addDoctor,
  adminLogin,
  allDoctors,
  appointmentsAdmin,
  cancelAppointment,
  getAdminDashboardStats,
};
