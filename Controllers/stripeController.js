import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    if (!bookingId || !amount) {
      return res.status(400).json({ error: "❌ Booking ID and amount are required." });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: 'http://localhost:5173/payment-success', // ✅ Redirect after success
      cancel_url: 'http://localhost:5173/payment-failed',
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'Flight Booking',
            },
            unit_amount: amount * 100, // Convert ₹ to paise
          },
          quantity: 1,
        },
      ],
    });

    res.json({ id: session.id, url: session.url }); // Send session URL to frontend
  } catch (error) {
    console.error('❌ Stripe Checkout Error:', error);
    res.status(500).json({ error: '❌ Payment failed.' });
  }
};
