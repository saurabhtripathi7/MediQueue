import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import appointmentModel from "../models/appointmentModel.js";

const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.params;

    const doctor = await doctorModel.findById(docId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    doctor.available = !doctor.available;
    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Availability changed",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const doctorsList = async (req, res) => {
  try {
    // 1. Fetch doctors
    // Use string syntax for select to exclude password and email
    const doctors = await doctorModel.find({}).select("-password -email"); 

    // 2. Return success with data
    res.status(200).json({ 
      success: true, 
      doctors
    });

  } catch (error) {
    console.error("Error in doctorList:", error); // Use console.error for errors

    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 2️⃣ Check if doctor exists
    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, doctor.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 4️⃣ Generate JWT token
    const token = jwt.sign(
      {
        role: "doctor",
        doctorId: doctor._id,
        email: doctor.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5️⃣ Return response
    return res.status(200).json({
      success: true,
      token,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        image: doctor.image,
        speciality: doctor.speciality,
      },
    });
  } catch (error) {
    console.error("Doctor login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ============================================================================
// API: GET DOCTOR APPOINTMENTS (DOCTOR PANEL)
// ----------------------------------------------------------------------------
// - Requires authDoctor middleware
// - Fetches ONLY appointments belonging to the logged-in doctor
// - Doctor identity is derived from JWT (NOT request body)
// ============================================================================


const appointmentsDoctor = async (req, res) => {
  try {
    // Doctor ID comes from authDoctor middleware (JWT)
    const doctorId = new mongoose.Types.ObjectId(req.doctor.id);

    const appointments = await appointmentModel
      .find({ doctorId })
      .sort({ appointmentDateTime: -1 }) 
      .populate({
        path: "userId",
        model: "User",           // explicitly tell Mongoose
        select: "name email image dob",
      });

    return res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("Doctor appointments fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ============================================================================
// API: COMPLETE APPOINTMENT (DOCTOR PANEL)
// ----------------------------------------------------------------------------
// - Auth protected (authDoctor middleware)
// - Doctor identity derived from JWT
// - Only owning doctor can complete appointment
// - Idempotent
// ============================================================================

const appointmentComplete = async (req, res) => {
  try {
    const doctorId = req.doctor.id; // from JWT 
    const { appointmentId } = req.body; 

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "appointmentId is required",
      });
    }

    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    //  Ownership check
    if (appointment.doctorId.toString() !== doctorId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized action",
      });
    }

    //  Idempotency
    if (appointment.isCompleted) {
      return res.status(200).json({
        success: true,
        message: "Appointment already completed",
      });
    }

    appointment.isCompleted = true;
    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Appointment marked as completed",
    });
  } catch (error) {
    console.error("Complete appointment error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ============================================================================
// API: CANCEL APPOINTMENT (DOCTOR PANEL)
// ----------------------------------------------------------------------------
// - Auth protected (authDoctor middleware)
// - Doctor identity derived from JWT
// - Only owning doctor can cancel appointment
// - Releases slot
// - Idempotent
// ============================================================================

const appointmentCancel = async (req, res) => {
  try {
    const doctorId = req.doctor.id; // from JWT
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "appointmentId is required",
      });
    }

    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Ownership check
    if (appointment.doctorId.toString() !== doctorId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized action",
      });
    }

    // Idempotency
    if (appointment.cancelled) {
      return res.status(200).json({
        success: true,
        message: "Appointment already cancelled",
      });
    }

    appointment.cancelled = true;
    await appointment.save();

    //  Release slot
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
    console.error("Cancel appointment error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ============================================================================
// API: GET DOCTOR DASHBOARD DATA
// ----------------------------------------------------------------------------
// - Auth protected (authDoctor middleware)
// - Doctor identity derived from JWT
// - Returns earnings, total appointments, unique patients,
//   and latest 5 appointments
// ============================================================================

const doctorDashboard = async (req, res) => {
  try {
    // 🔐 Doctor ID from JWT
    const doctorId = req.doctor.id;

    // Fetch all appointments for this doctor
    const appointments = await appointmentModel
      .find({ doctorId })
      .sort({ appointmentDateTime: -1 });

    // ===================== CALCULATIONS =====================

    let earnings = 0;
    let completedCount = 0;
    let cancelledCount = 0;
    let pendingCount = 0;

    const patientSet = new Set();

    appointments.forEach((appointment) => {
      // ✅ Revenue rule (correct)
      if (appointment.payment && !appointment.refunded) {
        earnings += appointment.amount;
      }

      // ✅ Status counters (mutually exclusive)
      if (appointment.isCompleted) completedCount++;
      else if (appointment.cancelled) cancelledCount++;
      else pendingCount++;

      // ✅ Unique patients
      patientSet.add(appointment.userId.toString());
    });

    // Completion rate should NOT include pending
    const effectiveTotal = completedCount + cancelledCount;

    const completionRate =
      effectiveTotal > 0
        ? Math.round((completedCount / effectiveTotal) * 100)
        : 0;

    // ===================== DASHBOARD DATA =====================

    const dashData = {
      // existing fields (unchanged)
      earnings,
      appointments: appointments.length,
      patients: patientSet.size,

      // performance metrics (same names, better logic)
      completedAppointments: completedCount,
      cancelledAppointments: cancelledCount,
      pendingAppointments: pendingCount,
      completionRate,

      // unchanged behavior
      latestAppointments: appointments.slice(0, 5),
    };

    return res.status(200).json({
      success: true,
      dashData,
    });
  } catch (error) {
    console.error("Doctor dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
    });
  }
};



// ============================================================================
// API: GET DOCTOR PROFILE (DOCTOR PANEL)
// ----------------------------------------------------------------------------
// - Auth protected (authDoctor middleware)
// - Doctor identity derived from JWT
// - Never trusts frontend-sent docId
// ============================================================================

const doctorProfile = async (req, res) => {
  try {
    const doctorId = req.doctor.id; // from authDoctor middleware

    const doctor = await doctorModel
      .findById(doctorId)
      .select("-password");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      profileData: doctor,
    });
  } catch (error) {
    console.error("Doctor profile fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ============================================================================
// API: UPDATE DOCTOR PROFILE (DOCTOR PANEL)
// ----------------------------------------------------------------------------
// - Auth protected (authDoctor middleware)
// - Partial updates only
// - Doctor identity derived from JWT
// ============================================================================

const updateDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.doctor.id; // from JWT
    const { fees, address, available } = req.body;

    const updateData = {};

    if (fees !== undefined) updateData.fees = fees;
    if (address !== undefined) updateData.address = address;
    if (available !== undefined) updateData.available = available;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update",
      });
    }

    const updatedDoctor = await doctorModel.findByIdAndUpdate(
      doctorId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedDoctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profileData: updatedDoctor,
    });
  } catch (error) {
    console.error("Update doctor profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};





export {
  changeAvailability,
  doctorsList,
  doctorLogin,
  appointmentsDoctor,
  appointmentComplete,
  appointmentCancel,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
};