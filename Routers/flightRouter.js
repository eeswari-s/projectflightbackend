import express from "express";
import { createFlight, getAllFlights, updateFlight, deleteFlight,  searchFlights, } from "../Controllers/flightController.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";  // ✅ Import authMiddleware
import { adminMiddleware } from "../Middleware/adminMiddleware.js"; 

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, createFlight);  // Admin only
router.get("/", getAllFlights);  // Public access
router.put("/:id", authMiddleware, adminMiddleware, updateFlight); // Admin only
router.delete("/:id", authMiddleware, adminMiddleware, deleteFlight); // Admin only
router.get("/search", searchFlights);

export default router;
