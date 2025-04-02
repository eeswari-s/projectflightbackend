import nodemailer from 'nodemailer';
import { Booking } from '../models/Booking.js';
import generatePDF from '../utils/generatePDF.js';

// Send Payment Success Email
const sendPaymentSuccessEmail = async (email, transactionDetails) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Transaction Successful!',
    text: `Your payment of ₹${transactionDetails.amount} was successful. Thank you for booking with us!`,
    html: `<p>Your payment of ₹${transactionDetails.amount} was successful. Thank you for booking with us!</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Create and send PDF
const sendBookingDetailsPDF = async (user, transactionDetails) => {
  const pdf = generatePDF(user, transactionDetails);
  // Send the generated PDF as an attachment
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Your Booking Confirmation',
    text: 'Attached is your booking confirmation and transaction details.',
    attachments: [
      {
        filename: 'BookingDetails.pdf',
        content: pdf,
        encoding: 'base64',
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email with PDF:', error);
  }
};

// Handle Payment Success
const paymentSuccess = async (req, res) => {
  try {
    const { bookingId, transactionDetails } = req.body;

    // Get booking data from the database
    const booking = await Booking.findById(bookingId);

    // Send Payment Success Email
    await sendPaymentSuccessEmail(booking.email, transactionDetails);

    // Generate and send PDF with booking details
    await sendBookingDetailsPDF(booking, transactionDetails);

    // Respond with success
    res.status(200).json({ message: 'Payment successful, confirmation emails sent.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred during the payment process.' });
  }
};

export { paymentSuccess };
