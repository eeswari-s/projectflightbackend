import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const MONGO_URI = process.env.MONGODB;

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to database");
    } catch (error) {
        console.error("❌ Database connection error:", error.message);
        process.exit(1); // Force exit if DB connection fails
    }
};

export default connectDB;