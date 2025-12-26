import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;


//  * Controller to refresh the Access Token
export const refreshAccessToken = async (req, res) => {
  try {
    // 1. Extract the refresh token from the request body
    const { refreshToken } = req.body;

    // 2. Initial Validation: Check if the token actually exists in the request
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing",
      });
    }

    // 3. Verify the token's cryptographic signature and expiration
    // This ensures the token was created by us and hasn't expired yet and fetches the payload
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    // 4. Database Lookup: Find the user associated with this token
    // We use the ID that was embedded inside the token payload (decoded.id).
    const user = await userModel.findById(decoded.id);

    // 5. Security Check (Crucial Step):
    // - Check if the user still exists in the DB.
    // - Check if the token provided matches the one currently stored in the DB for this user.
    // This allows you to "revoke" access by removing the token from the DB (e.g., during logout).
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // 6. Generate a NEW Access Token
    // Access tokens are short-lived (e.g., 15 mins) for security.
    const newAccessToken = jwt.sign(
      { id: user._id }, // Payload: usually the user ID
      JWT_SECRET,       // Sign with the Access Token Secret
      { expiresIn: "15m" } // Short expiration time
    );

    // 7. Send the new Access Token back to the client
    res.json({
      success: true,
      accessToken: newAccessToken,
    });

  } catch (err) {
    // 8. Error Handling
    // If jwt.verify fails (token expired or tampered with), code jumps here.
    return res.status(403).json({
      success: false,
      message: "Refresh token expired or invalid",
    });
  }
};


// LOGOUT USER
export const logoutUser = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    const userId = req.user.id;

    // 🔴 CRITICAL STEP: revoke refresh token
    await userModel.findByIdAndUpdate(userId, {
      refreshToken: null,
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};
