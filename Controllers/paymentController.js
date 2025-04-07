import nodemailer from 'nodemailer';
import Booking from '../Models/bookingModels.js'; // Import Booking model
import generatePDF from '../utils/generatePDF.js';
import dotenv from 'dotenv';

dotenv.config(); 
// Create Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send Payment Success Email
export const sendPaymentSuccessEmail = async (email, transactionDetails) => {
  try {
    if (!email || !transactionDetails?.amount) {
      console.error("Missing email or transaction details.");
      return;
    }

    const formattedAmount = (transactionDetails.amount / 100).toFixed(2); 

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🎉 Payment Successful - Booking Confirmed!',
      html: `
        <h2>Thank You for Your Payment! ✅</h2>
        <p>Your payment of <strong>₹${formattedAmount}</strong> was successful.</p>
        <p>Transaction ID: <strong>${transactionDetails.id}</strong></p>
        <p>We look forward to serving you. ✈️</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Payment success email sent to:', email);
  } catch (error) {
    console.error('❌ Error sending payment success email:', error);
  }
};

// Send Booking Details PDF
export const sendBookingDetailsPDF = async (user, transactionDetails) => {
  try {
    if (!user?.email) {
      console.error("❌ User email missing, cannot send PDF.");
      return;
    }

    const pdfBuffer = await generatePDF(user, transactionDetails); // Generate PDF

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: '📄 Your Flight Booking Confirmation',
      text: 'Attached is your booking confirmation and transaction details.',
      attachments: [
        {
          filename: 'BookingDetails.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf', 
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Booking PDF email sent to:', user.email);
  } catch (error) {
    console.error('❌ Error sending email with PDF:', error);
  }
};

// Handle Payment Success
export const paymentSuccess = async (req, res) => {
  try {
    const { bookingId, transactionDetails } = req.body;

    if (!bookingId || !transactionDetails) {
      return res.status(400).json({ error: '❌ Booking ID and transaction details are required.' });
    }

    // Fetch booking details from DB
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: '❌ Booking not found.' });
    }

    console.log('✅ Payment received for:', booking.email);
    console.log('💳 Transaction Details:', transactionDetails);

    // Send Payment Success Email
    await sendPaymentSuccessEmail(booking.email, transactionDetails);

    // Generate and send PDF with booking details
    await sendBookingDetailsPDF(booking, transactionDetails);

    // Respond with success
    res.status(200).json({ message: '✅ Payment successful, confirmation emails sent.' });
  } catch (error) {
    console.error('❌ Payment success error:', error);
    res.status(500).json({ error: 'An error occurred during the payment process.' });
  }
};


