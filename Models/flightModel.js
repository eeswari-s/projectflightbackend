import mongoose from "mongoose";

const flightSchema = new mongoose.Schema({
  flightNumber: { type: String, required: true, unique: true },
  flightName: { type: String, required: true },
  departureFrom: { type: String, required: true },
  goingTo: { type: String, required: true },
  departureDate: { type: Date, required: true },
  price: { type: Number, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  duration: { type: String, required: true }, // Total travel duration
  stop: { type: String, required: true }, // Non-stop or 1 stop etc.
  image: { type: String } // Flight image URL
}, { timestamps: true });

const Flight = mongoose.model("Flight", flightSchema);

export default Flight;
