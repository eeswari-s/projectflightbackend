import express from 'express';
import { paymentSuccess } from '../Controllers/paymentController.js';

const router = express.Router();

// Payment Success Route
router.post('/payment-success', paymentSuccess);

export default router;
