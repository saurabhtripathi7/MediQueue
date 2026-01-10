import jwt from "jsonwebtoken";

/**
 * ======================================================
 * AUTH MIDDLEWARE: authDoctor
 * ======================================================
 *
 * PURPOSE
 * ------------------------------------------------------
 * This middleware protects routes that require a
 * logged-in DOCTOR.
 *
 * It performs FOUR critical jobs:
 * 1. Verifies the JWT access token sent by the client
 * 2. Ensures the token belongs to a DOCTOR
 * 3. Extracts the authenticated doctor's identity
 * 4. Attaches that identity to `req.doctor`
 *
 *
 * IMPORTANT ARCHITECTURAL RULE
 * ------------------------------------------------------
 * 🔐 Auth / Application Layer  → uses `id`
 * 🗄 MongoDB / Database Layer → uses `_id`
 *
 * Controllers will later do:
 *   const doctorId = req.doctor.id;
 *
 * MongoDB will internally map that value to `_id`
 * when queries like `findById(doctorId)` are executed.
 */

const authDoctor = async (req, res, next) => {
  try {
    /* ==================================================
       1️⃣ READ AUTHORIZATION HEADER
       ==================================================
       Expected HTTP header format:
       
       Authorization: Bearer <accessToken>
    */
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    /* ==================================================
       2️⃣ EXTRACT ACCESS TOKEN
       ================================================== */
    const token = authHeader.split(" ")[1];

    /* ==================================================
       3️⃣ VERIFY ACCESS TOKEN
       ================================================== */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /*
      Expected decoded payload:

      {
        role: "doctor",
        doctorId: "<mongo_object_id_as_string>",
        email: "<doctor_email>",
        iat: <timestamp>,
        exp: <timestamp>
      }
    */

    /* ==================================================
       4️⃣ ENSURE TOKEN BELONGS TO A DOCTOR
       ================================================== */
    if (decoded.role !== "doctor") {
      return res.status(403).json({
        success: false,
        message: "Access denied: doctor only",
      });
    }

    /* ==================================================
       5️⃣ ATTACH DOCTOR TO REQUEST OBJECT
       ================================================== */
    req.doctor = {
      id: decoded.doctorId,
      email: decoded.email,
    };

    /* ==================================================
       6️⃣ PASS CONTROL FORWARD
       ================================================== */
    next();
  } catch (error) {
    /*
      Possible reasons we land here:
      - Token expired
      - Token tampered with
      - Invalid signature
      - Wrong JWT secret
    */
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authDoctor;
