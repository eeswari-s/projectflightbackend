import Booking from "../Models/bookingModels.js";
import Flight from "../Models/flightModel.js"; // Flight model import
import generatePDF from "../utils/generatePDF.js";
import path from 'path';
import fs from 'fs';
import { sendEmail } from "../utils/emailService.js";
import dotenv from 'dotenv';
import {fileURLToPath} from 'url';

dotenv.config();

// ✅ Fix `__dirname` for ES Module support
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { name, age, phone, address, seat, flightId,email } = req.body;

    if (!name || !age || !phone || !address || !seat || !flightId ||!email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the seat is already booked
    const existingBooking = await Booking.findOne({ seat, flightId });
    if (existingBooking) {
      return res.status(400).json({ message: "This seat is already booked" });
    }

    // Fetch flight price
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    const totalFare = flight.price + 731 + 176; // Price + surcharges + insurance

    const newBooking = new Booking({
      name,
      age,
      phone,
      address,
      seat,
      flightId,
      email,
      totalFare,
    });

    await newBooking.save();

    // ✅ Generate PDF
    const pdfFilePath = await generatePDF(newBooking);
    
    if (!pdfFilePath || !fs.existsSync(pdfFilePath)) {
      return res.status(500).json({ message: "PDF generation failed" });
    }


    // ✅ Check if PDF exists before responding
    if (!fs.existsSync(pdfFilePath)) {
      return res.status(500).json({ message: "PDF generation failed" });
    }

 // ✅ Send Confirmation Email
 const emailSubject = "Booking Confirmation - Suki World Airlines";
 const emailBody = `Hi ${name},\n\nYour booking is confirmed!\n\nBooking Details:\n- Seat No: ${seat}\n- Flight: ${flight.flightNumber} (${flight.name})\n- Total Fare: ${totalFare}\n\nThank you for choosing Suki World Airlines!`;
 await sendEmail(email, emailSubject, emailBody);

    res.status(201).json({ message: "Booking successful", booking: newBooking, pdfFilePath });
  } catch (error) {
    console.error("error in createBooking:",error);
    console.error("error stack trace:", error.stack); // Log the stack trace for debugging
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get booked seats for a flight
export const getBookedSeats = async (req, res) => {
  try {
    const { flightId } = req.params;
    if (!flightId) {
      return res.status(400).json({ message: "Flight ID is required" });
    }

    const bookings = await Booking.find({ flightId }).select("seat");
    const bookedSeats = bookings.map((booking) => booking.seat);
    res.json({ bookedSeats });

    console.log("🔍 Booking Request Received:", req.body);
    console.log("🛫 Flight ID:", flightId);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Booking by ID



export const getBookingById = async (req, res) => {
  try {
    const bookingId = req.params.id?.trim(); 

  
    if (!bookingId || !bookingId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid or missing Booking ID format" });
    }

    //  Find booking by ID
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found with this ID" });
    }

    //  Send success response
    res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error("❌ Error in getBookingById:", error.message);
    res.status(500).json({ message: "Server error while fetching booking", error: error.message });
  }
};