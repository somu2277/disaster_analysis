const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Define storage for the images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Generate unique filename to avoid overwrites
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, crypto.randomBytes(8).toString('hex') + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|webp/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Images Only (jpeg, jpg, png, webp)!'));
  }
}

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

module.exports = upload;
