import jwt from "jsonwebtoken";

/**
 * ======================================================
 * AUTH MIDDLEWARE: authUser
 * ======================================================
 *
 * PURPOSE
 * ------------------------------------------------------
 * This middleware protects routes that require a
 * logged-in user.
 *
 * It performs THREE critical jobs:
 * 1. Verifies the JWT access token sent by the client
 * 2. Extracts the authenticated user's identity
 * 3. Attaches that identity to `req.user` for downstream use
 *
 *
 * IMPORTANT ARCHITECTURAL RULE
 * ------------------------------------------------------
 * 🔐 Auth / Application Layer  → uses `id`
 * 🗄 MongoDB / Database Layer → uses `_id`
 *
 * Why?
 * - `_id` is a MongoDB implementation detail
 * - `id` is an application-level identity
 * - This keeps auth logic DB-agnostic and future-proof
 *
 * Controllers will later do:
 *   const userId = req.user.id;
 *
 * MongoDB will internally map that value to `_id`
 * when queries like `findById(userId)` are executed.
 */

const authUser = async (req, res, next) => {
  try {
    /* ==================================================
       1️⃣ READ AUTHORIZATION HEADER
       ==================================================
       Expected HTTP header format:
       
       Authorization: Bearer <accessToken>
       
       - If header is missing → user is not logged in
       - If format is wrong  → token is invalid
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
       ==================================================
       Example:
       "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
       → extract only the token part
    */
    const token = authHeader.split(" ")[1];

    /* ==================================================
       3️⃣ VERIFY ACCESS TOKEN
       ==================================================
       jwt.verify does ALL of the following:
       - Confirms token signature is valid
       - Confirms token is not expired
       - Decodes payload if token is valid
       
       If ANY of these fail → it throws an error
    */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /*
      Decoded payload structure
      (created during login/register):

      {
        id: "<mongo_object_id_as_string>",
        iat: <issued_at_timestamp>,
        exp: <expiry_timestamp>
      }
    */

    /* ==================================================
       4️⃣ ATTACH USER TO REQUEST OBJECT
       ==================================================
       We expose ONLY what the rest of the app needs:
       - the authenticated user's identity (`id`)
       
       ❌ We do NOT expose `_id`
       because that would leak MongoDB internals
       into the auth layer.
    */
    req.user = {
      id: decoded.id,
    };

    /* ==================================================
       5️⃣ PASS CONTROL TO NEXT MIDDLEWARE / CONTROLLER
       ==================================================
       At this point:
       - User is authenticated
       - req.user.id is trusted
       - Controllers can safely proceed
    */
    next();
  } catch (error) {
    /*
      Possible reasons we land here:
      - Token expired
      - Token was tampered with
      - Invalid signature
      - Wrong JWT secret
    */
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authUser;
