import Flight from "../Models/flightModel.js";


const generateRandomSeat = (seats = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3']) => {
  const randomIndex = Math.floor(Math.random() * seats.length);
  return seats[randomIndex];
};

// Create Flight
export const createFlight = async (req, res) => {
  try {
    // Generate a random seat number
    const randomSeat = generateRandomSeat();

    // Include the random seat number in the request body
    const flightData = {
      ...req.body,
      seatNumber: randomSeat,  // Add the random seat number here
    };

    const flight = new Flight(flightData);
    await flight.save();
    res.status(201).json({ message: "Flight added successfully", flight });
  } catch (error) {
    res.status(500).json({ message: "Error adding flight", error });
  }
};

// Get All Flights
export const getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.find();
    res.status(200).json(flights);
  } catch (error) {
    res.status(500).json({ message: "Error fetching flights", error });
  }
};

// **Update Flight**
export const updateFlight = async (req, res) => {
  try {
    const { id } = req.params;

    // Generate a random seat number 
    const randomSeat = generateRandomSeat();

   
    const updatedFlightData = {
      ...req.body,
      seatNumber: randomSeat,  
    };

    const updatedFlight = await Flight.findByIdAndUpdate(id, updatedFlightData, { new: true });
    if (!updatedFlight) return res.status(404).json({ message: "Flight not found" });

    res.status(200).json({ message: "Flight updated successfully", updatedFlight });
  } catch (error) {
    res.status(500).json({ message: "Error updating flight", error });
  }
};

// **Delete Flight**
export const deleteFlight = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFlight = await Flight.findByIdAndDelete(id);
    if (!deletedFlight) return res.status(404).json({ message: "Flight not found" });

    res.status(200).json({ message: "Flight deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting flight", error });
  }
};


// Search Flights
export const searchFlights = async (req, res) => {
  try {
      let { departureFrom, goingTo, departureDate, date } = req.query;
console.log("Query Parameters:", req.query); // Log the query parameters
      departureDate = departureDate || date;

      

      if (!departureFrom || !goingTo || !departureDate) {
          return res.status(400).json({ message: "Please provide departureFrom, goingTo, and departureDate" });
      }
console.log("Departure Date:", departureDate); // Log the departure date
      // Convert departureDate to full ISO format
      const startDate = new Date(departureDate);
      startDate.setUTCHours(0, 0, 0, 0);
  
      const endDate = new Date(departureDate);
      endDate.setUTCHours(23, 59, 59, 999);

const flights = await Flight.find({
    departureFrom: { $regex: new RegExp(`^${departureFrom}$`, "i") },
    goingTo: { $regex: new RegExp(`^${goingTo}$`, "i") },
    departureDate: { $gte: startDate, $lte: endDate }
}); // Log the start date
     
      console.log("Flights Found:", flights);

      if (flights.length === 0) {
          return res.status(404).json({ message: "No flights found!" });
      }

      res.status(200).json(flights);
  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
};
