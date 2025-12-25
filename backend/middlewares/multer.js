import multer from "multer";

/**
 * ======================================
 *  Multer Configuration
 * ======================================
 */

// 1️⃣ Storage configuration
// We don't define `destination` because:
// - Cloudinary will read the file immediately
// - Multer stores it in a temp location
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    // Keep original filename
    cb(null, file.originalname);
  },
});

// 2️⃣ File filter (IMAGE TYPE VALIDATION)
const fileFilter = (req, file, cb) => {
  // Allowed MIME types
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // accept file
  } else {
    cb(
      new multer.MulterError(
        "LIMIT_UNEXPECTED_FILE",
        "Only JPG, PNG, WEBP images are allowed"
      )
    );
  }
};

// 3️⃣ Multer instance with limits
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 🔒 10 MB limit (because of Cloudinary free plan)
  },
});

export default upload;
