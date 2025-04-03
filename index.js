import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import uploadRoutes from './Routers/uploadRouter.js';
import connectDB from './Database/config.js'; // Database connection import
import authRoutes from "./Routers/authRouter.js";
import flightRoutes from "./Routers/flightRouter.js";
import bookingRouter from "./Routers/bookingRouter.js";
import paymentRoutes from "./Routers/paymentRoutes.js";


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Get __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve 'uploads' folder as static (Fix for ENOENT error)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//static file serving(for serving pdf files)
app.use('/bookings', express.static(path.join(process.cwd(), 'bookings')));

// Connect to database
connectDB();

// Use the upload routes
app.use('/api', uploadRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/booking", bookingRouter);
app.use('/api', paymentRoutes); //




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


