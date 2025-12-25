import jwt from "jsonwebtoken";

// admin authentication middleware
const authAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; //gets authToken obj from header

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized, Login Again",
      });
    }

    // "Bearer <token>"
    const token = authHeader.split(" ")[1];  
    // ["Bearer", "abc.def.ghi(token)"]
    //    0         1

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verify role, NOT password
    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    req.admin = decoded;
    next();

  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export default authAdmin;
