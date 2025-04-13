import stripe from "../config/stripeConfig.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, message: "Amount is required" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: "https://projectflightfrontend.vercel.app/payment-success", // Success URL
      cancel_url: "http://localhost:5173/payment-failed", // Cancel URL
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Flight Booking",
            },
            unit_amount: amount * 100, // Amount in paisa
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: req.body.bookingId,  
        email: req.body.email,          
      },
    });

    res.status(200).json({
      success: true,
      message: "Checkout session created",
      sessionId: session.id,
      checkoutUrl: session.url 
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Checkout session creation failed",
      error: error.message,
    });
  }
};
