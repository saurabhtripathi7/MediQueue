import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    // Relations (for populate)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
      required: true,
    },

    // Slot info (human readable)
    slotDate: {
      type: String, // e.g. "2025-01-05"
      required: true,
    },
    slotTime: {
      type: String, // e.g. "10:30 AM"
      required: true,
    },

    // Snapshot data (history safe)
    userData: {
      type: Object,
      required: true,
    },
    docData: {
      type: Object,
      required: true,
    },

    // Payment
    amount: {
      type: Number,
      required: true,
    },

    // Actual datetime (for sorting & filtering)
    appointmentDateTime: {
      type: Date,
      required: true,
    },

    // Status flags
    cancelled: {
      type: Boolean,
      default: false,
    },
    payment: {
      type: Boolean,
      default: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

const appointmentModel =
  mongoose.models.appointment ||
  mongoose.model("appointment", appointmentSchema);

export default appointmentModel;
