import express from 'express';
import { paymentSuccess,sendBookingDetailsPDF,sendPaymentSuccessEmail} from '../Controllers/paymentController.js';
import { createCheckoutSession } from '../Controllers/stripeController.js';

const router = express.Router();

// Payment Success Route
router.post('/payment-success', paymentSuccess);
router.post('/send-payment-success-email', sendPaymentSuccessEmail);
router.post('/send-booking-details-pdf', sendBookingDetailsPDF);
router.post('/create-checkout-session', createCheckoutSession);

export default router;
