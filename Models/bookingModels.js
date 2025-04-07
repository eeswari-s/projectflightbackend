import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  phone: { type: String, required: true, match: /^[0-9]{10}$/ },
  address: { type: String, required: true },
  seat: { type: String, required: true, unique: true }, 
  flightId: { type: mongoose.Schema.Types.ObjectId, ref: "Flight", required: true }, 
  totalFare: { type: Number, required: true },
  email: { type: String, required: true, match: /\S+@\S+\.\S+/ }, 
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
