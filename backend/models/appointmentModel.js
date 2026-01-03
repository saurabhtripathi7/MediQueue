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
      type: String,
      required: true,
    },
    slotTime: {
      type: String,
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

    // Payment amount
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

    /* ======================================================
       🔴 PAYMENT GATEWAY FIELDS (CRITICAL)
       ====================================================== */

    // Razorpay order created before checkout
    razorpayOrderId: {
      type: String,
    },

    // Razorpay payment id after successful payment
    razorpayPaymentId: {
      type: String,
    },

    // Refund tracking
    refunded: {
      type: Boolean,
      default: false,
    },

    refundId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const appointmentModel =
  mongoose.models.appointment ||
  mongoose.model("appointment", appointmentSchema);

export default appointmentModel;
