import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  flightId: { type: mongoose.Schema.Types.ObjectId, ref: "Flight", required: true },
  seatNumber: { type: String, required: true, unique: true },
  totalPrice: { type: Number, required: true },
  paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
