import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

// Configure the email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Your email from .env
    pass: process.env.EMAIL_PASS,  // Your email password from .env
  },
});

// Function to send emails
export const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    console.log('📧 Email Sent Successfully');
  } catch (error) {
    console.error('❌ Error Sending Email:', error);
  }
};
