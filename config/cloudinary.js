import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:"726934253238912",
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default cloudinary;