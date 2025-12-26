import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    image: {
      type: String,
      default:
        "https://res.cloudinary.com/demo/image/upload/v1700000000/default-user.png",
    },

    address: { type: Object, default: { line1: "", line2: "" } },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Not Selected"],
      default: "Not Selected",
    },

    dob: {
      type: Date,
    },

    phone: {
      type: String,
      trim: true,
      match: [/^[0-9]{10}$/, "Please enter a valid phone number"],
    },

    role: {
      type: String,
      enum: ["user", "admin", "doctor"],
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // ✅ createdAt & updatedAt
  }
);

const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;
