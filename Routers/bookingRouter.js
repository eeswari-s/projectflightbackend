import express from "express";
import { createBooking, getBookedSeats , getBookingById } from "../Controllers/bookingController.js";

const router = express.Router();

router.post("/book", createBooking);
router.get("/booked-seats/:flightId", getBookedSeats); // Get booked seats
router.get("/:id", getBookingById);
export default router;
