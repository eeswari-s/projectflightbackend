import mongoose from 'mongoose';

const StripeSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking', // Referencing the booking schema
      required: true,
    },
    flightId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Flight', // Referencing the flight schema
      required: true,
    },

    
    totalFare: {
      type: Number,
      required: true,
    },
  },
  
);

const Stripe = mongoose.model('Stripe', StripeSchema);

export default Stripe;
