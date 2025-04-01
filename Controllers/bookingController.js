import mongoose from "mongoose";
import Booking from "../Models/bookingModels.js";
import User from "../Models/userModel.js";
import Flight from "../Models/flightModel.js";

// Book a Flight
export const bookSeat = async (req, res) => {
  try {
    const { name, flightNumber, seat } = req.body;

    // Validate input
    if (!flightNumber) {
      return res.status(400).json({ message: "Flight number is required" });
    }
    if (!seat || isNaN(seat) || seat < 1 || seat > 60) {
      return res.status(400).json({ message: "Invalid seat number format" });
    }

    // Find the user by name (case-insensitive)
    const user = await User.findOne({ name: { $regex: new RegExp("^" + name.trim() + "$", "i") } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the flight by flight number
    const flight = await Flight.findOne({ flightNumber });
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    // Check if the seat is already booked
    const existingBooking = await Booking.findOne({ flight: flight._id, seat });
    if (existingBooking) {
      return res.status(400).json({ message: "Seat already booked" });
    }

    // Base fare + Surcharges
    const baseFare = flight.price;
    const surcharges = 600;
    const totalPrice = baseFare + surcharges;

    // Create booking
    const newBooking = new Booking({
      user: user._id,
      flight: flight._id,
      seat,
      totalPrice,
    });

    // Save booking
    await newBooking.save();

    res.status(201).json({
      message: "Booking successful",
      booking: {
        id: newBooking._id,
        seat: newBooking.seat,
        totalPrice: newBooking.totalPrice,
      },
      flightDetails: {
        flightNumber: flight.flightNumber,
        flightName: flight.flightName,
        departureFrom: flight.departureFrom,
        goingTo: flight.goingTo,
        departureDate: flight.departureDate,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime,
        baseFare: flight.price,
        surcharges,
        totalPrice,
      },
      userDetails: {
        name: user.name,
      },
    });

  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: "Error booking the flight", error });
  }
};

// Get all booked seats for a flight
export const getBookedSeats = async (req, res) => {
  try {
    const { flightNumber } = req.params;

    // Find the flight by number
    const flight = await Flight.findOne({ flightNumber });
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    // Get all booked seats for the flight
    const bookings = await Booking.find({ flight: flight._id }).select("seat");

    const bookedSeats = bookings.map((b) => b.seat);
    res.json({ flightNumber, bookedSeats });

  } catch (error) {
    console.error("Error fetching booked seats:", error);
    res.status(500).json({ message: "Error fetching booked seats", error });
  }
};

// Payment confirmation (Mock)
export const confirmPayment = async (req, res) => {
  try {
    res.json({ message: "Payment successful. Booking confirmed!" });
  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({ message: "Payment failed", error });
  }
};
