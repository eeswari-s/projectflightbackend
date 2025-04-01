import mongoose from "mongoose";
import Booking from "../Models/bookingModels.js";
import User from "../Models/userModel.js";
import Flight from "../Models/flightModel.js";

// Book a flight
export const bookFlight = async (req, res) => {
  try {
    const { name, flightId, seat } = req.body;
    console.log("Received Flight ID:", flightId);

    // Find the user by name (using findOne to avoid array issues)
    const user = await User.findOne({ name });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch all flights and filter inside callback
    const flights = await Flight.find();

    // Convert flightId to ObjectId before filtering
    const flightObjectId = new mongoose.Types.ObjectId(flightId);

    // Filter the correct flight
    const flight = flights.filter(f => f._id.equals(flightObjectId))[0]; // get first match

    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    // Create the booking
    const newBooking = new Booking({
      user: user._id,
      flight: flight._id,
      seat,
    });

    // Save the booking
    await newBooking.save();

    res.status(201).json({
      message: "Booking successful",
      booking: newBooking,
      flightDetails: flight,
      userDetails: user,
    });
  } catch (error) {
    res.status(500).json({ message: "Error booking the flight", error });
  }
};
