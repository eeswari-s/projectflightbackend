import User from "../Models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// ✅ User Registration
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists!" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({ message: "User Registered Successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ User Login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials!" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials!" });
        }

        // Generate token only for admin
        if (user.role === "admin") {
            const token = jwt.sign(
                { _id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            return res.status(200).json({
                message: "Admin logged in successfully",
                token,
                role: user.role,
            });
        }

        // User login (No token)
        res.status(200).json({ message: "User logged in successfully (No Token)" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
