import express from 'express';
import { paymentSuccess } from '../Controllers/paymentController.js';
import { createCheckoutSession } from '../Controllers/stripeController.js';

const router = express.Router();

// Payment Success Route
router.post('/payment-success', paymentSuccess);
router.post('/create-checkout-session', createCheckoutSession);

export default router;
