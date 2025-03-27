import express from "express";
import { createFlight, getAllFlights, filterFlights, updateFlight, deleteFlight } from "../Controllers/flightController.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";
import { adminMiddleware } from "../Middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", getAllFlights);
router.get("/search", filterFlights);
router.post("/", authMiddleware, adminMiddleware, createFlight);
router.put("/:id", authMiddleware, adminMiddleware, updateFlight);
router.delete("/:id", authMiddleware, adminMiddleware, deleteFlight);

export default router;
