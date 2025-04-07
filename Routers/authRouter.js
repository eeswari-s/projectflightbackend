import express from "express";
import { registerUser, loginUser } from "../Controllers/authController.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";  // ✅ Import authMiddleware
import { adminMiddleware } from "../Middleware/adminMiddleware.js"; 

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.use(authMiddleware); // Use authMiddleware for all routes after this
 router.use(adminMiddleware); //  Use adminMiddleware for all routes after this

export default router;
