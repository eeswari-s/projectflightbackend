import { PDFDocument } from 'pdf-lib';  
import fs from 'fs';
import path from 'path';

const generatePDF = async (bookingDetails, transactionDetails) => {
  console.log("Booking Details:", bookingDetails); // Debugging
  console.log("Transaction Details:", transactionDetails); // Debugging

  if (!bookingDetails || !transactionDetails) {
    console.error("Missing booking or transaction details");
    return null;
  }

  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    // Draw the booking success details on the PDF
    page.drawText(`Transaction Status: ${transactionDetails.status}`, { x: 50, y: height - 100, size: 18 });
    page.drawText(`Booking ID: ${bookingDetails._id}`, { x: 50, y: height - 120, size: 12 });
    page.drawText(`Name: ${bookingDetails.name}`, { x: 50, y: height - 140, size: 12 });
    page.drawText(`Seat: ${bookingDetails.seat}`, { x: 50, y: height - 160, size: 12 });
    page.drawText(`Flight: ${bookingDetails.flightId?.flightName || "N/A"}`, { x: 50, y: height - 180, size: 12 });
    page.drawText(`Total Fare: ₹${bookingDetails.totalFare}`, { x: 50, y: height - 200, size: 12 });

    // Serialize the PDF to bytes
    const pdfBytes = await pdfDoc.save();

    // Ensure bookings folder exists
    const dirPath = path.join(process.cwd(), 'bookings');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }

    // Save the PDF file
    const filePath = path.join(dirPath, `${bookingDetails._id}-booking.pdf`);
    fs.writeFileSync(filePath, pdfBytes);

    console.log("PDF generated successfully:", filePath); // Debugging

    return filePath;
  } catch (error) {
    console.error("PDF generation error:", error);
    return null;
  }
};

export default generatePDF;
