const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Helper function to remove old profile image

const removeOldProfileImage = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error('Error removing old file:', error);
    }
  }
};


// Ensure upload directory exists
const createUploadDir = () => {
  const uploadDir = path.join(__dirname, "..", "public", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  return uploadDir;
};

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = createUploadDir();
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Get original file extension
    const ext = path.extname(file.originalname).toLowerCase();
    // Get original filename without extension
    const name = path.basename(file.originalname, ext);

    // Check if file exists
    const uploadDir = createUploadDir();
    const fullPath = path.join(uploadDir, file.originalname);

    if (fs.existsSync(fullPath)) {
      // If exists, add timestamp
      const timestamp = Date.now();
      cb(null, `${name}-${timestamp}${ext}`);
    } else {
      // Use original filename
      cb(null, file.originalname);
    }
  },
});
// Configure multer options
const multerOptions = {
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
     // Validate file types
     const filetypes = /jpeg|jpg|png|gif/i;
     const mimetype = filetypes.test(file.mimetype);
     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
 
     if (mimetype && extname) {
       return cb(null, true);
     }
     cb(new Error('Only image files (jpg, jpeg, png, gif) are allowed!'));
  },
};

// Create multer instance
const upload = multer(multerOptions);

module.exports = { upload, removeOldProfileImage };
