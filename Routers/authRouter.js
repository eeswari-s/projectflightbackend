import express from "express";
import { registerUser, loginUser } from "../Controllers/authController.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";  // ✅ Import authMiddleware
import { adminMiddleware } from "../Middleware/adminMiddleware.js"; 

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
