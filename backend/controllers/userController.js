/**
 * ======================================================
 * USER CONTROLLER
 * ======================================================
 * This file contains all user-facing business logic:
 * - Authentication (register, login)
 * - Profile management
 * - Appointment booking & management
 *
 * IMPORTANT CONVENTION (used everywhere below):
 * ------------------------------------------------------
 * 🔐 Auth layer (JWT / middleware / controllers) uses: `id`
 * 🗄 Database layer (MongoDB / Mongoose) uses: `_id`
 *
 * `req.user.id`  → authenticated user identity (from token)
 * `_id`          → MongoDB document identifier
 *
 * They usually hold the same value, but represent
 * DIFFERENT CONCEPTS and must not be mixed.
 */

import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

import { convertTo24Hr } from "../utils/convertTo24Hr.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

/* ======================================================
   AUTH: REGISTER USER
   ======================================================
   - Validates input
   - Creates user in DB
   - Issues access + refresh tokens
   - Stores refresh token for rotation/revocation
*/
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    /* ---------- Basic input validation ---------- */
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

    /* ---------- Prevent duplicate accounts ---------- */
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    /* ---------- Secure password storage ---------- */
    const hashedPassword = await bcrypt.hash(password, 10);

    /* ---------- Create user document ---------- */
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
      throw new Error("JWT secrets are missing");
    }

    /* ---------- Token generation ---------- */
    // Access token → short-lived (used on every request)
    // Refresh token → long-lived (used to rotate access tokens)
    const accessToken = jwt.sign(
      { id: newUser._id }, // Mongo _id stored as app-level id
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: newUser._id },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    /* ---------- Persist refresh token ---------- */
    newUser.refreshToken = refreshToken;
    await newUser.save();

    return res.status(201).json({
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

/* ======================================================
   AUTH: LOGIN USER
   ======================================================
   - Verifies credentials
   - Rotates refresh token
   - Issues fresh access token
*/
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

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

    /* ---------- Fetch user with password ---------- */
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    /* ---------- Password verification ---------- */
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    /* ---------- Token rotation ---------- */
    const accessToken = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json({
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

/* ======================================================
   USER: GET PROFILE
   ======================================================
   - Auth protected
   - Uses identity from JWT (req.user.id)
   - Never trusts frontend-sent userId
*/
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // 🔐 from access token

    const user = await userModel
      .findById(userId)
      .select("-password"); // never expose password

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

/* ======================================================
   USER: UPDATE PROFILE
   ======================================================
   - Partial updates supported
   - Only provided fields are modified
   - Image upload handled via Cloudinary
*/
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    /* ---------- Build update object dynamically ---------- */
    const updateData = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (gender) updateData.gender = gender;

    /* ---------- Date validation ---------- */
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

    /* ---------- Address parsing ---------- */
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

    /* ---------- Optional image upload ---------- */
    if (imageFile) {
      const upload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      updateData.image = upload.secure_url;
    }

    /* ---------- Guard: nothing to update ---------- */
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

/* ======================================================
   APPOINTMENT: BOOK
   ======================================================
   - Auth protected
   - Uses authenticated user identity (req.user.id)
   - Prevents double booking
   - Stores snapshot of user & doctor data
   - Updates doctor slot availability
*/
export const bookAppointment = async (req, res) => {
  try {
    /* --------------------------------------------------
       1️⃣ AUTHENTICATED USER ID
       --------------------------------------------------
       - Comes from verified JWT
       - Never trust frontend for userId
    */
    const userId = req.user.id;

    /* --------------------------------------------------
       2️⃣ REQUEST DATA
       -------------------------------------------------- */
    const doctorId = req.body.doctorId || req.body.docId;
    const { slotDate, slotTime } = req.body;

    if (!userId || !doctorId || !slotDate || !slotTime) {
      return res.status(400).json({
        success: false,
        message: "Missing booking details",
      });
    }

    /* --------------------------------------------------
       3️⃣ FETCH DOCTOR
       --------------------------------------------------
       - lean() for performance (read-only)
    */
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

    /* --------------------------------------------------
       4️⃣ SLOT AVAILABILITY CHECK
       --------------------------------------------------
       slots_booked structure:
       {
         "2025-01-01": ["10:30 AM", "11:00 AM"]
       }
    */
    const slotsBooked = doctor.slots_booked || {};

    if (slotsBooked[slotDate]?.includes(slotTime)) {
      return res.status(400).json({
        success: false,
        message: "Slot not available",
      });
    }

    // Reserve slot locally before DB write
    slotsBooked[slotDate] = [...(slotsBooked[slotDate] || []), slotTime];

    /* --------------------------------------------------
       5️⃣ FETCH USER (FOR SNAPSHOT)
       --------------------------------------------------
       Snapshot is stored to preserve history
       even if user updates profile later
    */
    const user = await userModel.findById(userId).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    /* --------------------------------------------------
       6️⃣ NORMALIZE & VALIDATE TIME
       -------------------------------------------------- */
    const normalizedTime = String(slotTime).trim();
    const time24 = convertTo24Hr(normalizedTime);

    if (!time24) {
      return res.status(400).json({
        success: false,
        message: "Invalid slot time format",
      });
    }

    const appointmentDateTime = new Date(`${slotDate}T${time24}`);
    if (isNaN(appointmentDateTime.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment date/time",
      });
    }

    /* --------------------------------------------------
       7️⃣ CREATE APPOINTMENT
       -------------------------------------------------- */
    const appointment = await appointmentModel.create({
      userId,          // Stored as ObjectId internally
      doctorId,

      slotDate,
      slotTime: normalizedTime,
      appointmentDateTime,

      amount: doctor.fees,

      // Immutable snapshots (important for history)
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
    });

    /* --------------------------------------------------
       8️⃣ UPDATE DOCTOR SLOTS
       -------------------------------------------------- */
    await doctorModel.findByIdAndUpdate(doctorId, {
      slots_booked: slotsBooked,
    });

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointmentId: appointment._id, // DB document id
    });
  } catch (error) {
    console.error("Book Appointment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


/* ======================================================
   APPOINTMENT: LIST USER APPOINTMENTS
   ======================================================
   - Auth protected
   - Returns appointments for logged-in user only
   - Sorted by most recent first
*/
export const listAppointments = async (req, res) => {
  try {
    /* --------------------------------------------------
       1️⃣ AUTHENTICATED USER ID
       -------------------------------------------------- */
    const userId = req.user.id;

    /* --------------------------------------------------
       2️⃣ FETCH APPOINTMENTS
       --------------------------------------------------
       - populate doctor details for UI
       - exclude sensitive data
    */
    const appointments = await appointmentModel
      .find({ userId })
      .populate("doctorId", "name speciality image address fees")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("List Appointments Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
    });
  }
};

/* ======================================================
   APPOINTMENT: CANCEL
   ======================================================
   - Auth protected
   - Only appointment owner can cancel
   - Idempotent (safe to call twice)
   - Releases doctor slot
*/
export const cancelAppointment = async (req, res) => {
  try {
    /* --------------------------------------------------
       1️⃣ AUTHENTICATED USER
       -------------------------------------------------- */
    const userId = req.user.id;
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "appointmentId is required",
      });
    }

    /* --------------------------------------------------
       2️⃣ FETCH APPOINTMENT
       -------------------------------------------------- */
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    /* --------------------------------------------------
       3️⃣ AUTHORISATION CHECK
       --------------------------------------------------
       ObjectId comparison must use string
    */
    if (appointment.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized action",
      });
    }

    /* --------------------------------------------------
       4️⃣ IDEMPOTENCY CHECK
       -------------------------------------------------- */
    if (appointment.cancelled) {
      return res.status(400).json({
        success: false,
        message: "Appointment already cancelled",
      });
    }

    /* --------------------------------------------------
       5️⃣ CANCEL APPOINTMENT
       -------------------------------------------------- */
    appointment.cancelled = true;
    await appointment.save();

    /* --------------------------------------------------
       6️⃣ RELEASE DOCTOR SLOT
       --------------------------------------------------
       $pull removes slotTime from specific date array
    */
    await doctorModel.findByIdAndUpdate(appointment.doctorId, {
      $pull: {
        [`slots_booked.${appointment.slotDate}`]: appointment.slotTime,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel Appointment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
