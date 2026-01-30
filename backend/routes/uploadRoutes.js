const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/userModel');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Upload route
router.post('/', protect, upload.fields([{ name: 'profilePicture' }, { name: 'image' }]), async (req, res) => {
  console.log('Upload route called');
  console.log('Request headers:', req.headers);
  console.log('Request file:', req.file);
  console.log('Request body:', req.body);

  try {
    const files = req.files;
    if (!files || (!files.profilePicture && !files.image)) {
      console.log('No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let file;
    let fieldname;
    if (files.profilePicture && files.profilePicture.length > 0) {
      file = files.profilePicture[0];
      fieldname = 'profilePicture';
    } else if (files.image && files.image.length > 0) {
      file = files.image[0];
      fieldname = 'image';
    } else {
      return res.status(400).json({ message: 'No valid file uploaded' });
    }

    // Return the file path that can be accessed from frontend
    const filePath = `/uploads/${file.filename}`;
    console.log('File uploaded successfully:', filePath);

    // Check if it's a profile picture upload
    if (fieldname === 'profilePicture') {
      // Update user's profilePicture field
      await User.findByIdAndUpdate(req.user._id, { profilePicture: filePath });
      res.json({
        message: 'Profile picture uploaded successfully',
        filePath: filePath
      });
    } else {
      // For other uploads like product images, just return the path
      res.json({
        message: 'File uploaded successfully',
        image: filePath
      });
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
