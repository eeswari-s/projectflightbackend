import express from 'express';
import { getFlights } from '../Controllers/flightController.js';

const router = express.Router();

router.get('/', getFlights);

export default router;
