import Stripe from 'stripe';
import Booking from '../Models/bookingModels.js'; // Import Booking model
import Flight from '../Models/flightModel.js'; // Import Flight model
import StripeModel from '../Models/stripeModel.js'; // Import Stripe model
import mongoose from 'mongoose';
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);  // Replace with your Stripe secret key

// Controller function to create Stripe Checkout session
export const createCheckoutSession = async (req, res) => {
  const { bookingId, flightId } = req.body;
  console.log('Received bookingId:', bookingId);
  console.log('Received flightId:', flightId);
  try {
    // Fetch booking and flight from the database
    const bookingObjectId = mongoose.Types.ObjectId.isValid(bookingId) ? mongoose.Types.ObjectId(bookingId) : null;
    const flightObjectId = mongoose.Types.ObjectId.isValid(flightId) ? mongoose.Types.ObjectId(flightId) : null;


    // Check if booking or flight doesn't exist
    if (!bookingObjectId || !flightObjectId) {
      return res.status(400).json({ error: 'Invalid bookingId or flightId' });
    }
  // Fetch booking and flight from the database
  const booking = await Booking.findById(bookingObjectId);
  const flight = await Flight.findById(flightObjectId);
    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: flight.flightName, // Flight name
            },
            unit_amount: booking.totalFare * 100, // Price in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:5173/payment-success?bookingId=${bookingId}`, // Pass bookingId to success URL
      cancel_url: 'http://localhost:5173/payment-failed', // Cancel URL
    });

    // Save session details in the Stripe model
    const stripeData = new StripeModel({
      bookingId,
      flightId,
      totalFare: booking.totalFare, // Store the totalFare from booking
    });

    await stripeData.save(); // Save session to the database

    // Send session URL to the client for redirection to Stripe Checkout
    res.json({ checkout_url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error.stack); // Log full error stack
    res.status(500).json({ error: 'Internal Server Error', message: error.message }); // Send error details in response
  }
};
