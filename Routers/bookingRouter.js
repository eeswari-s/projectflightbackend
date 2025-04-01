import express from "express";
import { bookSeat, getBookedSeats, confirmPayment } from "../Controllers/bookingController.js";



const router = express.Router();

router.post("/book-seat", bookSeat);
router.get("/get-booked-seats/:flightId", getBookedSeats);
router.post("/confirm-payment/:bookingId", confirmPayment);

export default router;
