import nodemailer from 'nodemailer';
import  Booking  from '../Models/bookingModels.js'; // Import Booking model
import generatePDF from '../utils/generatePDF.js';

// Send Payment Success Email
const sendPaymentSuccessEmail = async (email, transactionDetails) => {
  try {
    if (!email || !transactionDetails?.amount) {
      console.error("Missing email or transaction details.");
      return;
    }

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
      html: `<p>Your payment of ${transactionDetails.amount} was successful. Thank you for booking with us!</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Payment success email sent!');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Create and send PDF
const sendBookingDetailsPDF = async (user, transactionDetails) => {
  try {
    if (!user?.email) {
      console.error("User email missing, cannot send PDF.");
      return;
    }

    const pdfBuffer = await generatePDF(user, transactionDetails); // ✅ Await PDF Generation

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
          content: pdfBuffer, // ✅ Fix: Ensure Buffer is passed
          encoding: 'base64',
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log('Booking PDF email sent!');
  } catch (error) {
    console.error('Error sending email with PDF:', error);
  }
};

// Handle Payment Success
const paymentSuccess = async (req, res) => {
  try {
    const { bookingId, transactionDetails } = req.body;

    if (!bookingId || !transactionDetails) {
      return res.status(400).json({ error: 'Booking ID and transaction details are required.' });
    }

    // Get booking data from the database
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    // Send Payment Success Email
    await sendPaymentSuccessEmail(booking.email, transactionDetails);

    // Generate and send PDF with booking details
    await sendBookingDetailsPDF(booking, transactionDetails);

    // Respond with success
    res.status(200).json({ message: 'Payment successful, confirmation emails sent.' });
  } catch (error) {
    console.error('Payment success error:', error);
    res.status(500).json({ error: 'An error occurred during the payment process.' });
  }
};

export { paymentSuccess };
