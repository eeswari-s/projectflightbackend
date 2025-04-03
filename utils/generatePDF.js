import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ✅ Fix `__dirname` for ES Module support
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generatePDF = async (booking) => {
  try {
    const pdfFileName = `booking_${booking._id}.pdf`;
    const pdfFilePath = path.join(__dirname, '..', 'bookings', pdfFileName);

    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(pdfFilePath);
    doc.pipe(writeStream);

    // 📝 PDF Content
    doc.fontSize(20).text('Flight Booking Confirmation', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Name: ${booking.name}`);
    doc.text(`Age: ${booking.age}`);
    doc.text(`Phone: ${booking.phone}`);
    doc.text(`Email: ${booking.email}`);
    doc.text(`Address: ${booking.address}`);
    doc.text(`Seat No: ${booking.seat}`);
    doc.text(`Total Fare: ₹${booking.totalFare}`);
    doc.text(`Flight ID: ${booking.flightId}`);
    doc.moveDown();
    doc.text('Thank you for booking with Suki World Airlines!', { align: 'center' });

    doc.end();

    // ✅ PDF generation success
    return new Promise((resolve, reject) => {
      writeStream.on('finish', () => resolve(pdfFilePath));
      writeStream.on('error', (err) => reject(err));
    });

  } catch (error) {
    console.error("PDF Generation Error:", error);
    return null; // ❌ Error handling
  }
};

export default generatePDF;
