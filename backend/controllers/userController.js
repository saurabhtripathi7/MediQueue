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

import razorpay from "razorpay";
import crypto from "crypto";


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
    const { name, email, password, dob } = req.body;

    /* ---------- Basic input validation ---------- */
    if (!name || !email || !password || !dob) {
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
      dob,
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
        image: user.image,
        dob: user.dob,
      },
      docData: {
        name: doctor.name,
        speciality: doctor.speciality,
        fees: doctor.fees,
        image: doctor.image,
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
       -------------------------------------------------- */
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
       -------------------------------------------------- */
    await doctorModel.findByIdAndUpdate(appointment.doctorId, {
      $pull: {
        [`slots_booked.${appointment.slotDate}`]: appointment.slotTime,
      },
    });

    /* --------------------------------------------------
       7️⃣ REFUND (IF PAYMENT WAS MADE)
       --------------------------------------------------
       - Refund is a side-effect
       - Backend decides eligibility
    */
    let refundInfo = null;

    if (appointment.payment) {
      try {
        refundInfo = await refundAppointmentPayment(appointment);
      } catch (refundError) {
        console.error("Refund failed:", refundError);
        // IMPORTANT:
        // We do NOT rollback cancellation if refund fails
        // Real systems handle refund retries separately
      }
    }

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      refund: refundInfo
        ? "Refund initiated"
        : "No refund applicable",
    });
  } catch (error) {
    console.error("Cancel Appointment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


/**
 * ======================================================
 * RAZORPAY CLIENT SETUP
 * ======================================================
 * - key_id     → public identifier (safe to expose to frontend)
 * - key_secret → private secret (MUST stay on backend)
 *
 * This client is used only to:
 * 1. Create payment orders
 * 2. (Optional) Fetch order info
 */
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * ======================================================
 * APPOINTMENT: INITIATE PAYMENT (RAZORPAY)
 * ======================================================
 *
 * PURPOSE:
 * --------
 * This endpoint DOES NOT take money.
 * It only creates a Razorpay "order" (payment intent).
 *
 * FLOW:
 * -----
 * 1. Verify authenticated user
 * 2. Validate appointment
 * 3. Enforce ownership (security)
 * 4. Prevent double payment (idempotency)
 * 5. Create Razorpay order
 * 6. Persist orderId for later verification
 *
 * SECURITY NOTE:
 * --------------
 * - Never trust frontend for amount
 * - Never accept appointmentId without ownership check
 */
export const payForAppointment = async (req, res) => {
  try {
    /* --------------------------------------------------
       1️⃣ AUTHENTICATED USER
       --------------------------------------------------
       Comes from JWT middleware (trusted identity)
    */
    const userId = req.user.id;

    /* --------------------------------------------------
       2️⃣ INPUT VALIDATION
       -------------------------------------------------- */
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "appointmentId is required",
      });
    }

    /* --------------------------------------------------
       3️⃣ FETCH APPOINTMENT
       --------------------------------------------------
       Needed for:
       - amount
       - ownership check
       - status validation
    */
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment || appointment.cancelled) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found or cancelled",
      });
    }

    /* --------------------------------------------------
       4️⃣ OWNERSHIP CHECK (CRITICAL SECURITY)
       --------------------------------------------------
       Prevents IDOR attacks
       Ensures user can only pay for their own appointment
    */
    if (appointment.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized payment attempt",
      });
    }

    /* --------------------------------------------------
       5️⃣ IDEMPOTENCY CHECK
       --------------------------------------------------
       Prevents:
       - double-click payments
       - refresh-based duplicates
    */
    if (appointment.payment) {
      return res.status(400).json({
        success: false,
        message: "Appointment already paid",
      });
    }

    /* --------------------------------------------------
       6️⃣ CREATE RAZORPAY ORDER
       --------------------------------------------------
       IMPORTANT:
       - Razorpay expects amount in smallest currency unit
         INR → paise
    */
    const options = {
      amount: appointment.amount * 100,
      currency: process.env.CURRENCY || "INR",
      receipt: appointmentId.toString(), // traceability
    };

    const order = await razorpayInstance.orders.create(options);

    /* --------------------------------------------------
       7️⃣ PERSIST ORDER ID
       --------------------------------------------------
       Creates trust bridge:
       Appointment ←→ Razorpay Order
    */
    appointment.razorpayOrderId = order.id;
    await appointment.save();

    /* --------------------------------------------------
       8️⃣ RETURN ORDER TO FRONTEND
       --------------------------------------------------
       Frontend uses this to open Razorpay Checkout
    */
    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Pay For Appointment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to initiate payment",
    });
  }
};

/**
 * ======================================================
 * APPOINTMENT: VERIFY PAYMENT (RAZORPAY)
 * ======================================================
 *
 * PURPOSE:
 * --------
 * Convert an untrusted frontend claim into
 * a trusted backend fact using cryptography.
 *
 * THIS IS WHERE TRUST IS ESTABLISHED.
 *
 * FLOW:
 * -----
 * 1. Receive Razorpay payment proof
 * 2. Locate appointment via orderId
 * 3. Ensure idempotency
 * 4. Recompute HMAC signature
 * 5. Compare with Razorpay signature
 * 6. Mark appointment as paid
 *
 * SECURITY GUARANTEE:
 * -------------------
 * Only Razorpay (and us) can generate a valid signature.
 */
export const verifyAppointmentPayment = async (req, res) => {
  try {
    /* --------------------------------------------------
       1️⃣ EXTRACT PAYMENT PROOF
       --------------------------------------------------
       These values come from Razorpay Checkout
       (forwarded by frontend)
    */
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Incomplete payment details",
      });
    }

    /* --------------------------------------------------
       2️⃣ FETCH APPOINTMENT USING ORDER ID
       --------------------------------------------------
       Order ID is unique & backend-generated
       (safer than appointmentId)
    */
    const appointment = await appointmentModel.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found for this order",
      });
    }

    /* --------------------------------------------------
       3️⃣ IDEMPOTENCY CHECK
       --------------------------------------------------
       Safe for retries, refreshes, duplicate callbacks
    */
    if (appointment.payment) {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
      });
    }

    /* --------------------------------------------------
       4️⃣ CRYPTOGRAPHIC SIGNATURE VERIFICATION
       --------------------------------------------------
       Razorpay signs: 
        order_id|payment_id
       using our SECRET key.

       We recompute the same and compare.
    */
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    /* --------------------------------------------------
       5️⃣ MARK PAYMENT SUCCESS
       --------------------------------------------------
       At this point:
       - Money is already captured by Razorpay
       - Authenticity is proven
    */
    appointment.payment = true;
    appointment.razorpayPaymentId = razorpay_payment_id;
    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Verify Payment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

/**
 * ======================================================
 * APPOINTMENT: REFUND PAYMENT (RAZORPAY)
 * ======================================================
 *
 * PURPOSE:
 * --------
 * Initiates a refund via Razorpay for a paid appointment.
 *
 * IMPORTANT:
 * ----------
 * - Backend does NOT send money
 * - Razorpay processes the refund
 * - This API is idempotent
 */
export const refundAppointmentPayment = async (appointment) => {
  // Guard 1: Only refund paid appointments
  if (!appointment.payment) {
    return {
      refunded: false,
      reason: "Appointment was not paid",
    };
  }

  // Guard 2: Ensure payment ID exists
  if (!appointment.razorpayPaymentId) {
    throw new Error("Missing Razorpay payment ID");
  }

  // Guard 3: Idempotency (if you later add refunded flag)
  if (appointment.refunded) {
    return {
      refunded: true,
      message: "Refund already processed",
    };
  }

  try {
    // Call Razorpay refund API
    const refund = await razorpayInstance.payments.refund(
      appointment.razorpayPaymentId,
      {
        amount: appointment.amount * 100, // optional (partial refund possible)
      }
    );

    // Mark refunded in DB (dynamic field is fine for now)
    appointment.refunded = true;
    appointment.refundId = refund.id;
    await appointment.save();

    return {
      refunded: true,
      refundId: refund.id,
    };
  } catch (error) {
    console.error("Refund Error:", error);
    throw new Error("Refund failed at payment gateway");
  }
};

