import mongoose from "mongoose";

const flightSchema = new mongoose.Schema({
  flightNumber: { type: String, required: true, unique: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  duration: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  status: { type: String, enum: ["Scheduled", "Cancelled", "Delayed"], default: "Scheduled" }
});

const Flight = mongoose.model("Flight", flightSchema);

export default Flight;
