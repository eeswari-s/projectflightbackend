import cloudinary from '../config/cloudinary.js';
import multer from 'multer';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

// Get __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up Multer storage (for temporary file uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Temporary folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Upload Image Function
const uploadImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    // Get correct timestamp
    const timestamp = Math.floor(Date.now() / 1000); // Correct timestamp format

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "uploads",
      timestamp: timestamp // Pass correct timestamp
    });

    console.log(result);

    // Delete the temporary file after upload
    fs.unlinkSync(file.path);

    res.status(200).json({ 
      message: "Image uploaded successfully",
      imageUrl: result.secure_url
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: 'Image upload failed', error });
  }
};

export { upload, uploadImage };
