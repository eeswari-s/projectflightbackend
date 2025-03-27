import express from 'express';
import { upload, uploadImage } from '../controllers/uploadController.js';

const router = express.Router();

router.post('/upload', upload.single('image'), uploadImage);

export default router;
